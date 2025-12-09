package com.langleague.web.rest;

import com.langleague.repository.ReadingExerciseRepository;
import com.langleague.service.ReadingExerciseService;
import com.langleague.service.dto.ReadingExerciseDTO;
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
 * REST controller for managing {@link com.langleague.domain.ReadingExercise}.
 */
@RestController
@RequestMapping("/api/reading-exercises")
public class ReadingExerciseResource {

    private static final Logger LOG = LoggerFactory.getLogger(ReadingExerciseResource.class);

    private static final String ENTITY_NAME = "readingExercise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReadingExerciseService readingExerciseService;

    private final ReadingExerciseRepository readingExerciseRepository;

    public ReadingExerciseResource(ReadingExerciseService readingExerciseService, ReadingExerciseRepository readingExerciseRepository) {
        this.readingExerciseService = readingExerciseService;
        this.readingExerciseRepository = readingExerciseRepository;
    }

    /**
     * {@code POST  /reading-exercises} : Create a new readingExercise.
     *
     * @param readingExerciseDTO the readingExerciseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new readingExerciseDTO, or with status {@code 400 (Bad Request)} if the readingExercise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReadingExerciseDTO> createReadingExercise(@Valid @RequestBody ReadingExerciseDTO readingExerciseDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ReadingExercise : {}", readingExerciseDTO);
        if (readingExerciseDTO.getId() != null) {
            throw new BadRequestAlertException("A new readingExercise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        readingExerciseDTO = readingExerciseService.save(readingExerciseDTO);
        return ResponseEntity.created(new URI("/api/reading-exercises/" + readingExerciseDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, readingExerciseDTO.getId().toString()))
            .body(readingExerciseDTO);
    }

    /**
     * {@code PUT  /reading-exercises/:id} : Updates an existing readingExercise.
     *
     * @param id the id of the readingExerciseDTO to save.
     * @param readingExerciseDTO the readingExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated readingExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the readingExerciseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the readingExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReadingExerciseDTO> updateReadingExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ReadingExerciseDTO readingExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ReadingExercise : {}, {}", id, readingExerciseDTO);
        if (readingExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, readingExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!readingExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        readingExerciseDTO = readingExerciseService.update(readingExerciseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, readingExerciseDTO.getId().toString()))
            .body(readingExerciseDTO);
    }

    /**
     * {@code PATCH  /reading-exercises/:id} : Partial updates given fields of an existing readingExercise, field will ignore if it is null
     *
     * @param id the id of the readingExerciseDTO to save.
     * @param readingExerciseDTO the readingExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated readingExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the readingExerciseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the readingExerciseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the readingExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReadingExerciseDTO> partialUpdateReadingExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ReadingExerciseDTO readingExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ReadingExercise partially : {}, {}", id, readingExerciseDTO);
        if (readingExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, readingExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!readingExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReadingExerciseDTO> result = readingExerciseService.partialUpdate(readingExerciseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, readingExerciseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reading-exercises} : get all the readingExercises.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of readingExercises in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ReadingExerciseDTO>> getAllReadingExercises(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of ReadingExercises");
        Page<ReadingExerciseDTO> page = readingExerciseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reading-exercises/:id} : get the "id" readingExercise.
     *
     * @param id the id of the readingExerciseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the readingExerciseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReadingExerciseDTO> getReadingExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ReadingExercise : {}", id);
        Optional<ReadingExerciseDTO> readingExerciseDTO = readingExerciseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(readingExerciseDTO);
    }

    /**
     * {@code DELETE  /reading-exercises/:id} : delete the "id" readingExercise.
     *
     * @param id the id of the readingExerciseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReadingExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ReadingExercise : {}", id);
        readingExerciseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /reading-exercises/chapter/:chapterId} : get all reading exercises for a specific chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exercises in body.
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<ReadingExerciseDTO>> getReadingExercisesByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get reading exercises by chapter : {}", chapterId);
        List<ReadingExerciseDTO> exercises = readingExerciseService.findByChapterId(chapterId);
        return ResponseEntity.ok().body(exercises);
    }
}
