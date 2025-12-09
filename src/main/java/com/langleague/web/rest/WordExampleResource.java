package com.langleague.web.rest;

import com.langleague.repository.WordExampleRepository;
import com.langleague.service.WordExampleService;
import com.langleague.service.dto.WordExampleDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
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
 * REST controller for managing {@link com.langleague.domain.WordExample}.
 */
@RestController
@RequestMapping("/api/word-examples")
public class WordExampleResource {

    private static final Logger LOG = LoggerFactory.getLogger(WordExampleResource.class);

    private static final String ENTITY_NAME = "wordExample";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WordExampleService wordExampleService;

    private final WordExampleRepository wordExampleRepository;

    public WordExampleResource(WordExampleService wordExampleService, WordExampleRepository wordExampleRepository) {
        this.wordExampleService = wordExampleService;
        this.wordExampleRepository = wordExampleRepository;
    }

    /**
     * {@code POST  /word-examples} : Create a new wordExample.
     *
     * @param wordExampleDTO the wordExampleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new wordExampleDTO, or with status {@code 400 (Bad Request)} if the wordExample has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<WordExampleDTO> createWordExample(@Valid @RequestBody WordExampleDTO wordExampleDTO) throws URISyntaxException {
        LOG.debug("REST request to save WordExample : {}", wordExampleDTO);
        if (wordExampleDTO.getId() != null) {
            throw new BadRequestAlertException("A new wordExample cannot already have an ID", ENTITY_NAME, "idexists");
        }
        wordExampleDTO = wordExampleService.save(wordExampleDTO);
        return ResponseEntity.created(new URI("/api/word-examples/" + wordExampleDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, wordExampleDTO.getId().toString()))
            .body(wordExampleDTO);
    }

    /**
     * {@code PUT  /word-examples/:id} : Updates an existing wordExample.
     *
     * @param id the id of the wordExampleDTO to save.
     * @param wordExampleDTO the wordExampleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wordExampleDTO,
     * or with status {@code 400 (Bad Request)} if the wordExampleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the wordExampleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<WordExampleDTO> updateWordExample(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WordExampleDTO wordExampleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update WordExample : {}, {}", id, wordExampleDTO);
        if (wordExampleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, wordExampleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!wordExampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        wordExampleDTO = wordExampleService.update(wordExampleDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wordExampleDTO.getId().toString()))
            .body(wordExampleDTO);
    }

    /**
     * {@code PATCH  /word-examples/:id} : Partial updates given fields of an existing wordExample, field will ignore if it is null
     *
     * @param id the id of the wordExampleDTO to save.
     * @param wordExampleDTO the wordExampleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wordExampleDTO,
     * or with status {@code 400 (Bad Request)} if the wordExampleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the wordExampleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the wordExampleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WordExampleDTO> partialUpdateWordExample(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WordExampleDTO wordExampleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update WordExample partially : {}, {}", id, wordExampleDTO);
        if (wordExampleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, wordExampleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!wordExampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WordExampleDTO> result = wordExampleService.partialUpdate(wordExampleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wordExampleDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /word-examples} : get all the wordExamples.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of wordExamples in body.
     */
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WordExampleDTO>> getAllWordExamples(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of WordExamples");
        Page<WordExampleDTO> page = wordExampleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /word-examples/:id} : get the "id" wordExample.
     *
     * @param id the id of the wordExampleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the wordExampleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WordExampleDTO> getWordExample(@PathVariable("id") Long id) {
        LOG.debug("REST request to get WordExample : {}", id);
        Optional<WordExampleDTO> wordExampleDTO = wordExampleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(wordExampleDTO);
    }

    /**
     * {@code DELETE  /word-examples/:id} : delete the "id" wordExample.
     *
     * @param id the id of the wordExampleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWordExample(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete WordExample : {}", id);
        wordExampleService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
