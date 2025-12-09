package com.langleague.web.rest;

import com.langleague.repository.GrammarRepository;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.GrammarService;
import com.langleague.service.dto.GrammarDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.Grammar}.
 */
@RestController
@RequestMapping("/api/grammars")
public class GrammarResource {

    private static final Logger LOG = LoggerFactory.getLogger(GrammarResource.class);

    private static final String ENTITY_NAME = "grammar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrammarService grammarService;

    private final GrammarRepository grammarRepository;

    public GrammarResource(GrammarService grammarService, GrammarRepository grammarRepository) {
        this.grammarService = grammarService;
        this.grammarRepository = grammarRepository;
    }

    /**
     * {@code POST  /grammars} : Create a new grammar.
     *
     * @param grammarDTO the grammarDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grammarDTO, or with status {@code 400 (Bad Request)} if the grammar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GrammarDTO> createGrammar(@Valid @RequestBody GrammarDTO grammarDTO) throws URISyntaxException {
        LOG.debug("REST request to save Grammar : {}", grammarDTO);
        if (grammarDTO.getId() != null) {
            throw new BadRequestAlertException("A new grammar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        grammarDTO = grammarService.save(grammarDTO);
        return ResponseEntity.created(new URI("/api/grammars/" + grammarDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, grammarDTO.getId().toString()))
            .body(grammarDTO);
    }

    /**
     * {@code PUT  /grammars/:id} : Updates an existing grammar.
     *
     * @param id the id of the grammarDTO to save.
     * @param grammarDTO the grammarDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grammarDTO,
     * or with status {@code 400 (Bad Request)} if the grammarDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grammarDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PutMapping("/{id}")
    public ResponseEntity<GrammarDTO> updateGrammar(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GrammarDTO grammarDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Grammar : {}, {}", id, grammarDTO);
        if (grammarDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grammarDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grammarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

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
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GrammarDTO> partialUpdateGrammar(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GrammarDTO grammarDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Grammar partially : {}, {}", id, grammarDTO);
        if (grammarDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grammarDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grammarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GrammarDTO> result = grammarService.partialUpdate(grammarDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grammarDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /grammars} : get all the grammars.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("")
    public ResponseEntity<List<GrammarDTO>> getAllGrammars(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Grammars");
        Page<GrammarDTO> page = grammarService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /grammars/:id} : get the "id" grammar.
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
     * {@code DELETE  /grammars/:id} : delete the "id" grammar.
     *
     * @param id the id of the grammarDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrammar(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Grammar : {}", id);
        grammarService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /grammars/chapter/:chapterId} : get all grammars for a specific chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<GrammarDTO>> getGrammarsByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get grammars by chapter : {}", chapterId);
        List<GrammarDTO> grammars = grammarService.findByChapterId(chapterId);
        return ResponseEntity.ok().body(grammars);
    }
}
