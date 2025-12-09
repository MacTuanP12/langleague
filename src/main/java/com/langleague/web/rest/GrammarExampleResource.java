package com.langleague.web.rest;

import com.langleague.repository.GrammarExampleRepository;
import com.langleague.service.GrammarExampleService;
import com.langleague.service.dto.GrammarExampleDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.GrammarExample}.
 */
@RestController
@RequestMapping("/api/grammar-examples")
public class GrammarExampleResource {

    private static final Logger LOG = LoggerFactory.getLogger(GrammarExampleResource.class);

    private static final String ENTITY_NAME = "grammarExample";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrammarExampleService grammarExampleService;

    private final GrammarExampleRepository grammarExampleRepository;

    public GrammarExampleResource(GrammarExampleService grammarExampleService, GrammarExampleRepository grammarExampleRepository) {
        this.grammarExampleService = grammarExampleService;
        this.grammarExampleRepository = grammarExampleRepository;
    }

    /**
     * {@code POST  /grammar-examples} : Create a new grammarExample.
     *
     * @param grammarExampleDTO the grammarExampleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grammarExampleDTO, or with status {@code 400 (Bad Request)} if the grammarExample has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GrammarExampleDTO> createGrammarExample(@RequestBody GrammarExampleDTO grammarExampleDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save GrammarExample : {}", grammarExampleDTO);
        if (grammarExampleDTO.getId() != null) {
            throw new BadRequestAlertException("A new grammarExample cannot already have an ID", ENTITY_NAME, "idexists");
        }
        grammarExampleDTO = grammarExampleService.save(grammarExampleDTO);
        return ResponseEntity.created(new URI("/api/grammar-examples/" + grammarExampleDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, grammarExampleDTO.getId().toString()))
            .body(grammarExampleDTO);
    }

    /**
     * {@code PUT  /grammar-examples/:id} : Updates an existing grammarExample.
     *
     * @param id the id of the grammarExampleDTO to save.
     * @param grammarExampleDTO the grammarExampleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grammarExampleDTO,
     * or with status {@code 400 (Bad Request)} if the grammarExampleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grammarExampleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GrammarExampleDTO> updateGrammarExample(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GrammarExampleDTO grammarExampleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update GrammarExample : {}, {}", id, grammarExampleDTO);
        if (grammarExampleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grammarExampleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grammarExampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        grammarExampleDTO = grammarExampleService.update(grammarExampleDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grammarExampleDTO.getId().toString()))
            .body(grammarExampleDTO);
    }

    /**
     * {@code PATCH  /grammar-examples/:id} : Partial updates given fields of an existing grammarExample, field will ignore if it is null
     *
     * @param id the id of the grammarExampleDTO to save.
     * @param grammarExampleDTO the grammarExampleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grammarExampleDTO,
     * or with status {@code 400 (Bad Request)} if the grammarExampleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the grammarExampleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the grammarExampleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GrammarExampleDTO> partialUpdateGrammarExample(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GrammarExampleDTO grammarExampleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GrammarExample partially : {}, {}", id, grammarExampleDTO);
        if (grammarExampleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grammarExampleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grammarExampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GrammarExampleDTO> result = grammarExampleService.partialUpdate(grammarExampleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grammarExampleDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /grammar-examples} : get all the grammarExamples.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammarExamples in body.
     */
    @GetMapping("")
    public ResponseEntity<List<GrammarExampleDTO>> getAllGrammarExamples(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of GrammarExamples");
        Page<GrammarExampleDTO> page = grammarExampleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /grammar-examples/:id} : get the "id" grammarExample.
     *
     * @param id the id of the grammarExampleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grammarExampleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GrammarExampleDTO> getGrammarExample(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GrammarExample : {}", id);
        Optional<GrammarExampleDTO> grammarExampleDTO = grammarExampleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(grammarExampleDTO);
    }

    /**
     * {@code DELETE  /grammar-examples/:id} : delete the "id" grammarExample.
     *
     * @param id the id of the grammarExampleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrammarExample(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GrammarExample : {}", id);
        grammarExampleService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
