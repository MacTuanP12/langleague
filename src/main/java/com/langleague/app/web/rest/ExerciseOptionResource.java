package com.langleague.app.web.rest;

import com.langleague.app.repository.ExerciseOptionRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.service.ExerciseOptionService;
import com.langleague.app.service.dto.ExerciseOptionDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.app.domain.ExerciseOption}.
 */
@RestController
@RequestMapping("/api/exercise-options")
public class ExerciseOptionResource {

    private static final Logger LOG = LoggerFactory.getLogger(ExerciseOptionResource.class);

    private static final String ENTITY_NAME = "exerciseOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExerciseOptionService exerciseOptionService;

    private final ExerciseOptionRepository exerciseOptionRepository;

    public ExerciseOptionResource(ExerciseOptionService exerciseOptionService, ExerciseOptionRepository exerciseOptionRepository) {
        this.exerciseOptionService = exerciseOptionService;
        this.exerciseOptionRepository = exerciseOptionRepository;
    }

    /**
     * {@code POST  /exercise-options} : Create a new exerciseOption.
     *
     * @param exerciseOptionDTO the exerciseOptionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exerciseOptionDTO, or with status {@code 400 (Bad Request)} if the exerciseOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "') or hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ExerciseOptionDTO> createExerciseOption(@Valid @RequestBody ExerciseOptionDTO exerciseOptionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ExerciseOption : {}", exerciseOptionDTO);
        if (exerciseOptionDTO.getId() != null) {
            throw new BadRequestAlertException("A new exerciseOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        exerciseOptionDTO = exerciseOptionService.save(exerciseOptionDTO);
        return ResponseEntity.created(new URI("/api/exercise-options/" + exerciseOptionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, exerciseOptionDTO.getId().toString()))
            .body(exerciseOptionDTO);
    }

    /**
     * {@code PUT  /exercise-options/:id} : Updates an existing exerciseOption.
     *
     * @param id the id of the exerciseOptionDTO to save.
     * @param exerciseOptionDTO the exerciseOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseOptionDTO,
     * or with status {@code 400 (Bad Request)} if the exerciseOptionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exerciseOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "') or hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ExerciseOptionDTO> updateExerciseOption(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ExerciseOptionDTO exerciseOptionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ExerciseOption : {}, {}", id, exerciseOptionDTO);
        if (exerciseOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseOptionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        exerciseOptionDTO = exerciseOptionService.update(exerciseOptionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exerciseOptionDTO.getId().toString()))
            .body(exerciseOptionDTO);
    }

    /**
     * {@code PATCH  /exercise-options/:id} : Partial updates given fields of an existing exerciseOption, field will ignore if it is null
     *
     * @param id the id of the exerciseOptionDTO to save.
     * @param exerciseOptionDTO the exerciseOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseOptionDTO,
     * or with status {@code 400 (Bad Request)} if the exerciseOptionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the exerciseOptionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the exerciseOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "') or hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ExerciseOptionDTO> partialUpdateExerciseOption(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ExerciseOptionDTO exerciseOptionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ExerciseOption partially : {}, {}", id, exerciseOptionDTO);
        if (exerciseOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseOptionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExerciseOptionDTO> result = exerciseOptionService.partialUpdate(exerciseOptionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exerciseOptionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /exercise-options} : get all the exerciseOptions.
     * This endpoint is generally not used - options are fetched with exercises.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseOptions in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.TEACHER + "\")")
    public List<ExerciseOptionDTO> getAllExerciseOptions() {
        LOG.debug("REST request to get all ExerciseOptions");
        return exerciseOptionService.findAll();
    }

    /**
     * {@code GET  /exercise-options/:id} : get the "id" exerciseOption.
     *
     * @param id the id of the exerciseOptionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exerciseOptionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ExerciseOptionDTO> getExerciseOption(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ExerciseOption : {}", id);
        Optional<ExerciseOptionDTO> exerciseOptionDTO = exerciseOptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(exerciseOptionDTO);
    }

    /**
     * {@code DELETE  /exercise-options/:id} : delete the "id" exerciseOption.
     *
     * @param id the id of the exerciseOptionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<Void> deleteExerciseOption(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ExerciseOption : {}", id);
        exerciseOptionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
