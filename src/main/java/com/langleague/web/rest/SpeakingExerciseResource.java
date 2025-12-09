package com.langleague.web.rest;

import com.langleague.repository.SpeakingExerciseRepository;
import com.langleague.service.SpeakingExerciseService;
import com.langleague.service.dto.SpeakingExerciseDTO;
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
 * REST controller for managing {@link com.langleague.domain.SpeakingExercise}.
 */
@RestController
@RequestMapping("/api/speaking-exercises")
public class SpeakingExerciseResource {

    private static final Logger LOG = LoggerFactory.getLogger(SpeakingExerciseResource.class);

    private static final String ENTITY_NAME = "speakingExercise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SpeakingExerciseService speakingExerciseService;

    private final SpeakingExerciseRepository speakingExerciseRepository;

    public SpeakingExerciseResource(
        SpeakingExerciseService speakingExerciseService,
        SpeakingExerciseRepository speakingExerciseRepository
    ) {
        this.speakingExerciseService = speakingExerciseService;
        this.speakingExerciseRepository = speakingExerciseRepository;
    }

    /**
     * {@code POST  /speaking-exercises} : Create a new speakingExercise.
     *
     * @param speakingExerciseDTO the speakingExerciseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new speakingExerciseDTO, or with status {@code 400 (Bad Request)} if the speakingExercise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SpeakingExerciseDTO> createSpeakingExercise(@Valid @RequestBody SpeakingExerciseDTO speakingExerciseDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save SpeakingExercise : {}", speakingExerciseDTO);
        if (speakingExerciseDTO.getId() != null) {
            throw new BadRequestAlertException("A new speakingExercise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        speakingExerciseDTO = speakingExerciseService.save(speakingExerciseDTO);
        return ResponseEntity.created(new URI("/api/speaking-exercises/" + speakingExerciseDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, speakingExerciseDTO.getId().toString()))
            .body(speakingExerciseDTO);
    }

    /**
     * {@code PUT  /speaking-exercises/:id} : Updates an existing speakingExercise.
     *
     * @param id the id of the speakingExerciseDTO to save.
     * @param speakingExerciseDTO the speakingExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated speakingExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the speakingExerciseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the speakingExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SpeakingExerciseDTO> updateSpeakingExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SpeakingExerciseDTO speakingExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update SpeakingExercise : {}, {}", id, speakingExerciseDTO);
        if (speakingExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, speakingExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!speakingExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        speakingExerciseDTO = speakingExerciseService.update(speakingExerciseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, speakingExerciseDTO.getId().toString()))
            .body(speakingExerciseDTO);
    }

    /**
     * {@code PATCH  /speaking-exercises/:id} : Partial updates given fields of an existing speakingExercise, field will ignore if it is null
     *
     * @param id the id of the speakingExerciseDTO to save.
     * @param speakingExerciseDTO the speakingExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated speakingExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the speakingExerciseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the speakingExerciseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the speakingExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SpeakingExerciseDTO> partialUpdateSpeakingExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SpeakingExerciseDTO speakingExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update SpeakingExercise partially : {}, {}", id, speakingExerciseDTO);
        if (speakingExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, speakingExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!speakingExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SpeakingExerciseDTO> result = speakingExerciseService.partialUpdate(speakingExerciseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, speakingExerciseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /speaking-exercises} : get all the speakingExercises.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of speakingExercises in body.
     */
    @GetMapping("")
    public ResponseEntity<List<SpeakingExerciseDTO>> getAllSpeakingExercises(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of SpeakingExercises");
        Page<SpeakingExerciseDTO> page = speakingExerciseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /speaking-exercises/:id} : get the "id" speakingExercise.
     *
     * @param id the id of the speakingExerciseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the speakingExerciseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SpeakingExerciseDTO> getSpeakingExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to get SpeakingExercise : {}", id);
        Optional<SpeakingExerciseDTO> speakingExerciseDTO = speakingExerciseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(speakingExerciseDTO);
    }

    /**
     * {@code DELETE  /speaking-exercises/:id} : delete the "id" speakingExercise.
     *
     * @param id the id of the speakingExerciseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpeakingExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete SpeakingExercise : {}", id);
        speakingExerciseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /speaking-exercises/chapter/:chapterId} : get all speaking exercises for a specific chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exercises in body.
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<SpeakingExerciseDTO>> getSpeakingExercisesByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get speaking exercises by chapter : {}", chapterId);
        List<SpeakingExerciseDTO> exercises = speakingExerciseService.findByChapterId(chapterId);
        return ResponseEntity.ok().body(exercises);
    }
}
