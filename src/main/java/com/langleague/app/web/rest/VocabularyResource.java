package com.langleague.app.web.rest;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Unit;
import com.langleague.app.domain.Vocabulary;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.repository.VocabularyRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.VocabularyService;
import com.langleague.app.service.dto.VocabularyDTO;
import com.langleague.app.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.app.domain.Vocabulary}.
 */
@RestController
@RequestMapping("/api/vocabularies")
public class VocabularyResource {

    private static final Logger LOG = LoggerFactory.getLogger(VocabularyResource.class);

    private static final String ENTITY_NAME = "vocabulary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VocabularyService vocabularyService;

    private final VocabularyRepository vocabularyRepository;

    private final UnitRepository unitRepository;

    public VocabularyResource(
        VocabularyService vocabularyService,
        VocabularyRepository vocabularyRepository,
        UnitRepository unitRepository
    ) {
        this.vocabularyService = vocabularyService;
        this.vocabularyRepository = vocabularyRepository;
        this.unitRepository = unitRepository;
    }

    private void checkOwnership(Book book) {
        if (!SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.TEACHER)) {
            throw new AccessDeniedException("You do not have the authority to perform this action");
        }
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new AccessDeniedException("User not logged in"));

        if (
            book.getTeacherProfile() == null ||
            book.getTeacherProfile().getUser() == null ||
            !currentUserLogin.equals(book.getTeacherProfile().getUser().getLogin())
        ) {
            throw new AccessDeniedException("You are not the owner of this book");
        }
    }

    /**
     * {@code POST  /vocabularies} : Create a new vocabulary.
     *
     * @param vocabularyDTO the vocabularyDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vocabularyDTO, or with status {@code 400 (Bad Request)} if the vocabulary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<VocabularyDTO> createVocabulary(@Valid @RequestBody VocabularyDTO vocabularyDTO) throws URISyntaxException {
        LOG.debug("REST request to save Vocabulary : {}", vocabularyDTO);
        if (vocabularyDTO.getId() != null) {
            throw new BadRequestAlertException("A new vocabulary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (vocabularyDTO.getUnit() == null || vocabularyDTO.getUnit().getId() == null) {
            throw new BadRequestAlertException("A new vocabulary must belong to a unit", ENTITY_NAME, "unitnull");
        }
        Unit unit = unitRepository
            .findById(vocabularyDTO.getUnit().getId())
            .orElseThrow(() -> new BadRequestAlertException("Unit not found", ENTITY_NAME, "unitnotfound"));
        checkOwnership(unit.getBook());

        vocabularyDTO = vocabularyService.save(vocabularyDTO);
        return ResponseEntity.created(new URI("/api/vocabularies/" + vocabularyDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, vocabularyDTO.getId().toString()))
            .body(vocabularyDTO);
    }

    /**
     * {@code POST  /vocabularies/bulk} : Create multiple vocabularies.
     *
     * @param vocabularies the list of vocabularies to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the list of new vocabularyDTOs.
     */
    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "') or hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<List<VocabularyDTO>> createVocabulariesBulk(@Valid @RequestBody List<VocabularyDTO> vocabularies) {
        LOG.debug("REST request to save bulk Vocabularies");
        if (vocabularies.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // Validate ownership for the first item (assuming all belong to same unit/book for now, or we check each)
        // For simplicity and performance, we check the first one's unit.
        // In a robust system, we should group by unit and check each unit.
        Long unitId = vocabularies.get(0).getUnit().getId();
        Unit unit = unitRepository
            .findById(unitId)
            .orElseThrow(() -> new BadRequestAlertException("Unit not found", ENTITY_NAME, "unitnotfound"));
        checkOwnership(unit.getBook());

        List<VocabularyDTO> result = vocabularyService.saveBulk(unitId, vocabularies);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "bulk")).body(result);
    }

    /**
     * {@code PUT  /vocabularies/:id} : Updates an existing vocabulary.
     *
     * @param id the id of the vocabularyDTO to save.
     * @param vocabularyDTO the vocabularyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vocabularyDTO,
     * or with status {@code 400 (Bad Request)} if the vocabularyDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vocabularyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VocabularyDTO> updateVocabulary(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VocabularyDTO vocabularyDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Vocabulary : {}, {}", id, vocabularyDTO);
        if (vocabularyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vocabularyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vocabularyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vocabulary vocabulary = vocabularyRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        checkOwnership(vocabulary.getUnit().getBook());

        vocabularyDTO = vocabularyService.update(vocabularyDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vocabularyDTO.getId().toString()))
            .body(vocabularyDTO);
    }

    /**
     * {@code PATCH  /vocabularies/:id} : Partial updates given fields of an existing vocabulary, field will ignore if it is null
     *
     * @param id the id of the vocabularyDTO to save.
     * @param vocabularyDTO the vocabularyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vocabularyDTO,
     * or with status {@code 400 (Bad Request)} if the vocabularyDTO is not valid,
     * or with status {@code 404 (Not Found)} if the vocabularyDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the vocabularyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VocabularyDTO> partialUpdateVocabulary(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VocabularyDTO vocabularyDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Vocabulary partially : {}, {}", id, vocabularyDTO);
        if (vocabularyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vocabularyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vocabularyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vocabulary vocabulary = vocabularyRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        checkOwnership(vocabulary.getUnit().getBook());

        Optional<VocabularyDTO> result = vocabularyService.partialUpdate(vocabularyDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vocabularyDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /vocabularies} : get all the vocabularies.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vocabularies in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<VocabularyDTO>> getAllVocabularies(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Vocabularies");
        Page<VocabularyDTO> page = vocabularyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /vocabularies/:id} : get the "id" vocabulary.
     *
     * @param id the id of the vocabularyDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vocabularyDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VocabularyDTO> getVocabulary(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Vocabulary : {}", id);
        Optional<VocabularyDTO> vocabularyDTO = vocabularyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vocabularyDTO);
    }

    /**
     * {@code GET  /vocabularies/by-unit/:unitId} : get all the vocabularies by unitId.
     *
     * @param unitId the id of the unit.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vocabularies in body.
     */
    @GetMapping("/by-unit/{unitId}")
    public List<VocabularyDTO> getAllVocabulariesByUnit(@PathVariable Long unitId) {
        LOG.debug("REST request to get all Vocabularies by unitId : {}", unitId);
        return vocabularyService.findAllByUnitId(unitId);
    }

    /**
     * {@code DELETE  /vocabularies/:id} : delete the "id" vocabulary.
     *
     * @param id the id of the vocabularyDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVocabulary(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Vocabulary : {}", id);

        Vocabulary vocabulary = vocabularyRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        checkOwnership(vocabulary.getUnit().getBook());

        vocabularyService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
