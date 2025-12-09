package com.langleague.web.rest;

import com.langleague.repository.WritingExerciseRepository;
import com.langleague.service.WritingExerciseService;
import com.langleague.service.dto.WritingExerciseDTO;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.WritingExercise}.
 */
@RestController
@RequestMapping("/api/writing-exercises")
public class WritingExerciseResource {

    private static final Logger LOG = LoggerFactory.getLogger(WritingExerciseResource.class);

    private static final String ENTITY_NAME = "writingExercise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WritingExerciseService writingExerciseService;

    private final WritingExerciseRepository writingExerciseRepository;

    public WritingExerciseResource(WritingExerciseService writingExerciseService, WritingExerciseRepository writingExerciseRepository) {
        this.writingExerciseService = writingExerciseService;
        this.writingExerciseRepository = writingExerciseRepository;
    }

    /**
     * {@code POST  /writing-exercises} : Create a new writingExercise.
     *
     * @param writingExerciseDTO the writingExerciseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new writingExerciseDTO, or with status {@code 400 (Bad Request)} if the writingExercise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<WritingExerciseDTO> createWritingExercise(@Valid @RequestBody WritingExerciseDTO writingExerciseDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save WritingExercise : {}", writingExerciseDTO);
        if (writingExerciseDTO.getId() != null) {
            throw new BadRequestAlertException("A new writingExercise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        writingExerciseDTO = writingExerciseService.save(writingExerciseDTO);
        return ResponseEntity.created(new URI("/api/writing-exercises/" + writingExerciseDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, writingExerciseDTO.getId().toString()))
            .body(writingExerciseDTO);
    }

    /**
     * {@code PUT  /writing-exercises/:id} : Updates an existing writingExercise.
     *
     * @param id the id of the writingExerciseDTO to save.
     * @param writingExerciseDTO the writingExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated writingExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the writingExerciseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the writingExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<WritingExerciseDTO> updateWritingExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody WritingExerciseDTO writingExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update WritingExercise : {}, {}", id, writingExerciseDTO);
        if (writingExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, writingExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!writingExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        writingExerciseDTO = writingExerciseService.update(writingExerciseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, writingExerciseDTO.getId().toString()))
            .body(writingExerciseDTO);
    }

    /**
     * {@code PATCH  /writing-exercises/:id} : Partial updates given fields of an existing writingExercise, field will ignore if it is null
     *
     * @param id the id of the writingExerciseDTO to save.
     * @param writingExerciseDTO the writingExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated writingExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the writingExerciseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the writingExerciseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the writingExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WritingExerciseDTO> partialUpdateWritingExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody WritingExerciseDTO writingExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update WritingExercise partially : {}, {}", id, writingExerciseDTO);
        if (writingExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, writingExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!writingExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WritingExerciseDTO> result = writingExerciseService.partialUpdate(writingExerciseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, writingExerciseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /writing-exercises} : get all the writingExercises.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of writingExercises in body.
     */
    @GetMapping("")
    public ResponseEntity<List<WritingExerciseDTO>> getAllWritingExercises(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of WritingExercises");
        Page<WritingExerciseDTO> page = writingExerciseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /writing-exercises/:id} : get the "id" writingExercise.
     *
     * @param id the id of the writingExerciseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the writingExerciseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<WritingExerciseDTO> getWritingExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to get WritingExercise : {}", id);
        Optional<WritingExerciseDTO> writingExerciseDTO = writingExerciseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(writingExerciseDTO);
    }

    /**
     * {@code DELETE  /writing-exercises/:id} : delete the "id" writingExercise.
     *
     * @param id the id of the writingExerciseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWritingExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete WritingExercise : {}", id);
        writingExerciseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /writing-exercises/chapter/:chapterId} : get all writing exercises for a specific chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exercises in body.
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<WritingExerciseDTO>> getWritingExercisesByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get writing exercises by chapter : {}", chapterId);
        List<WritingExerciseDTO> exercises = writingExerciseService.findByChapterId(chapterId);
        return ResponseEntity.ok().body(exercises);
    }
}
