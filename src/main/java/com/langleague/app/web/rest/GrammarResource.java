package com.langleague.app.web.rest;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Grammar;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.GrammarRepository;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.GrammarService;
import com.langleague.app.service.dto.GrammarDTO;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.app.domain.Grammar}.
 */
@RestController
@RequestMapping("/api/grammars")
@Transactional
public class GrammarResource {

    private static final Logger LOG = LoggerFactory.getLogger(GrammarResource.class);

    private static final String ENTITY_NAME = "grammar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrammarService grammarService;

    private final GrammarRepository grammarRepository;

    private final UnitRepository unitRepository;

    public GrammarResource(GrammarService grammarService, GrammarRepository grammarRepository, UnitRepository unitRepository) {
        this.grammarService = grammarService;
        this.grammarRepository = grammarRepository;
        this.unitRepository = unitRepository;
    }

    private void checkUnitOwnership(Long unitId) {
        Unit unit = unitRepository
            .findById(unitId)
            .orElseThrow(() -> new BadRequestAlertException("Unit not found", ENTITY_NAME, "unitnotfound"));
        SecurityUtils.checkOwnership(unit.getBook());
    }

    private Grammar validateAndGetGrammar(Long id, GrammarDTO grammarDTO) {
        if (grammarDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grammarDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        return getGrammarAndCheckOwnership(id);
    }

    private Grammar getGrammarAndCheckOwnership(Long id) {
        Grammar grammar = grammarRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(grammar.getUnit().getBook());
        return grammar;
    }

    /**
     * {@code POST  /grammars} : Create a new grammar.
     *
     * @param grammarDTO the grammarDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grammarDTO, or with status {@code 400 (Bad Request)} if the grammar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<GrammarDTO> createGrammar(@Valid @RequestBody GrammarDTO grammarDTO) throws URISyntaxException {
        LOG.debug("REST request to save Grammar : {}", grammarDTO);
        if (grammarDTO.getId() != null) {
            throw new BadRequestAlertException("A new grammar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (grammarDTO.getUnitId() == null) {
            throw new BadRequestAlertException("A new grammar must belong to a unit", ENTITY_NAME, "unitnull");
        }
        checkUnitOwnership(grammarDTO.getUnitId());

        grammarDTO = grammarService.save(grammarDTO);
        return ResponseEntity.created(new URI("/api/grammars/" + grammarDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, grammarDTO.getId().toString()))
            .body(grammarDTO);
    }

    /**
     * {@code POST  /grammars/bulk} : Create multiple grammars.
     *
     * @param grammars the list of grammars to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the list of new grammarDTOs.
     */
    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<List<GrammarDTO>> createGrammarsBulk(@Valid @RequestBody List<GrammarDTO> grammars) {
        LOG.debug("REST request to save bulk Grammars");
        if (grammars.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        Long unitId = grammars.getFirst().getUnitId();
        checkUnitOwnership(unitId);

        List<GrammarDTO> result = grammarService.saveBulk(unitId, grammars);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "bulk")).body(result);
    }

    /**
     * {@code PUT  /grammars/:id} : Updates an existing grammar.
     *
     * @param id the id of the grammarDTO to save.
     * @param grammarDTO the grammarDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grammarDTO,
     * or with status {@code 400 (Bad Request)} if the grammarDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grammarDTO couldn't be updated.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<GrammarDTO> updateGrammar(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GrammarDTO grammarDTO
    ) {
        LOG.debug("REST request to update Grammar : {}, {}", id, grammarDTO);
        validateAndGetGrammar(id, grammarDTO);

        grammarDTO = grammarService.update(grammarDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grammarDTO.getId().toString()))
            .body(grammarDTO);
    }

    /**
     * {@code PATCH  /grammars/:id} : Partial updates given fields of an existing grammar, field will ignore if it is null
     *
     * @param id the id of the grammarDTO to save.
     * @param grammarDTO the grammarDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grammarDTO,
     * or with status {@code 400 (Bad Request)} if the grammarDTO is not valid,
     * or with status {@code 404 (Not Found)} if the grammarDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the grammarDTO couldn't be updated.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<GrammarDTO> partialUpdateGrammar(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GrammarDTO grammarDTO
    ) {
        LOG.debug("REST request to partial update Grammar partially : {}, {}", id, grammarDTO);
        validateAndGetGrammar(id, grammarDTO);

        Optional<GrammarDTO> result = grammarService.partialUpdate(grammarDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grammarDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /grammars} : get all the grammars.
     * This endpoint is generally not used - grammars are fetched by unit.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<List<GrammarDTO>> getAllGrammars(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Grammars");
        Page<GrammarDTO> page = grammarService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /grammars/:id} : get the "id" grammar.
     * Students and Teachers can view grammars.
     *
     * @param id the id of the grammarDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grammarDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GrammarDTO> getGrammar(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Grammar : {}", id);
        Optional<GrammarDTO> grammarDTO = grammarService.findOne(id);
        return ResponseUtil.wrapOrNotFound(grammarDTO);
    }

    /**
     * {@code GET  /grammars/by-unit/:unitId} : get all the grammars by unitId.
     * Students and Teachers can view grammars.
     *
     * @param unitId the id of the unit.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("/by-unit/{unitId}")
    public List<GrammarDTO> getAllGrammarsByUnit(@PathVariable Long unitId) {
        LOG.debug("REST request to get all Grammars by unitId : {}", unitId);
        return grammarService.findAllByUnitId(unitId);
    }

    /**
     * {@code DELETE  /grammars/:id} : delete the "id" grammar.
     *
     * @param id the id of the grammarDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<Void> deleteGrammar(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Grammar : {}", id);

        getGrammarAndCheckOwnership(id);

        grammarService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
