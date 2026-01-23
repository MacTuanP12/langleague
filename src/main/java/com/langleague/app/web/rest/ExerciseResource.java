package com.langleague.app.web.rest;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.ExerciseRepository;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.ExerciseOptionService;
import com.langleague.app.service.ExerciseService;
import com.langleague.app.service.dto.CheckAnswerDTO;
import com.langleague.app.service.dto.ExerciseDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.app.domain.Exercise}.
 */
@RestController
@RequestMapping("/api/exercises")
@Transactional
public class ExerciseResource {

    private static final Logger LOG = LoggerFactory.getLogger(ExerciseResource.class);

    private static final String ENTITY_NAME = "exercise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExerciseService exerciseService;

    private final ExerciseRepository exerciseRepository;

    private final UnitRepository unitRepository;

    private final ExerciseOptionService exerciseOptionService;

    public ExerciseResource(
        ExerciseService exerciseService,
        ExerciseRepository exerciseRepository,
        UnitRepository unitRepository,
        ExerciseOptionService exerciseOptionService
    ) {
        this.exerciseService = exerciseService;
        this.exerciseRepository = exerciseRepository;
        this.unitRepository = unitRepository;
        this.exerciseOptionService = exerciseOptionService;
    }

    /**
     * {@code POST  /exercises} : Create a new exercise.
     *
     * @param exerciseDTO the exerciseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exerciseDTO, or with status {@code 400 (Bad Request)} if the exercise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<ExerciseDTO> createExercise(@Valid @RequestBody ExerciseDTO exerciseDTO) throws URISyntaxException {
        LOG.debug("REST request to save Exercise : {}", exerciseDTO);
        if (exerciseDTO.getId() != null) {
            throw new BadRequestAlertException("A new exercise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (exerciseDTO.getUnitId() == null) {
            throw new BadRequestAlertException("A new exercise must belong to a unit", ENTITY_NAME, "unitnull");
        }
        Unit unit = unitRepository
            .findById(exerciseDTO.getUnitId())
            .orElseThrow(() -> new BadRequestAlertException("Unit not found", ENTITY_NAME, "unitnotfound"));
        SecurityUtils.checkOwnership(unit.getBook());

        exerciseDTO = exerciseService.save(exerciseDTO);
        return ResponseEntity.created(new URI("/api/exercises/" + exerciseDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, exerciseDTO.getId().toString()))
            .body(exerciseDTO);
    }

    /**
     * {@code POST  /exercises/bulk} : Create multiple exercises.
     *
     * @param exercises the list of exercises to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the list of new exerciseDTOs.
     */
    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<List<ExerciseDTO>> createExercisesBulk(@Valid @RequestBody List<ExerciseDTO> exercises) {
        LOG.debug("REST request to save bulk Exercises");
        if (exercises.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        Long unitId = exercises.get(0).getUnitId();
        Unit unit = unitRepository
            .findById(unitId)
            .orElseThrow(() -> new BadRequestAlertException("Unit not found", ENTITY_NAME, "unitnotfound"));
        SecurityUtils.checkOwnership(unit.getBook());

        List<ExerciseDTO> result = exerciseService.saveBulk(unitId, exercises);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "bulk")).body(result);
    }

    /**
     * {@code PUT  /exercises/:id} : Updates an existing exercise.
     *
     * @param id the id of the exerciseDTO to save.
     * @param exerciseDTO the exerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseDTO,
     * or with status {@code 400 (Bad Request)} if the exerciseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<ExerciseDTO> updateExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ExerciseDTO exerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Exercise : {}, {}", id, exerciseDTO);
        if (exerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        // Single findById call instead of existsById + findById (Performance fix)
        Exercise exercise = exerciseRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(exercise.getUnit().getBook());

        exerciseDTO = exerciseService.update(exerciseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exerciseDTO.getId().toString()))
            .body(exerciseDTO);
    }

    /**
     * {@code PUT  /exercises/bulk} : Update multiple exercises.
     * This endpoint allows teachers to update multiple exercises at once for better performance.
     *
     * @param exercises the list of exercises to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the list of updated exerciseDTOs.
     */
    @PutMapping("/bulk")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<List<ExerciseDTO>> updateExercisesBulk(@Valid @RequestBody List<ExerciseDTO> exercises) {
        LOG.debug("REST request to bulk update Exercises, count: {}", exercises.size());

        if (exercises.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // Verify ownership for the first exercise (assuming all belong to same book/unit)
        Long firstExerciseId = exercises.get(0).getId();
        if (firstExerciseId == null) {
            throw new BadRequestAlertException("Exercise ID cannot be null", ENTITY_NAME, "idnull");
        }

        Exercise firstExercise = exerciseRepository
            .findById(firstExerciseId)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(firstExercise.getUnit().getBook());

        // Verify all exercises have IDs
        for (ExerciseDTO exerciseDTO : exercises) {
            if (exerciseDTO.getId() == null) {
                throw new BadRequestAlertException("All exercises must have an ID for bulk update", ENTITY_NAME, "idnull");
            }
        }

        List<ExerciseDTO> result = exerciseService.bulkUpdate(exercises);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, "bulk")).body(result);
    }

    /**
     * {@code PATCH  /exercises/:id} : Partial updates given fields of an existing exercise, field will ignore if it is null
     *
     * @param id the id of the exerciseDTO to save.
     * @param exerciseDTO the exerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseDTO,
     * or with status {@code 400 (Bad Request)} if the exerciseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the exerciseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the exerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<ExerciseDTO> partialUpdateExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ExerciseDTO exerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Exercise partially : {}, {}", id, exerciseDTO);
        if (exerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        // Single findById call instead of existsById + findById (Performance fix)
        Exercise exercise = exerciseRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(exercise.getUnit().getBook());

        Optional<ExerciseDTO> result = exerciseService.partialUpdate(exerciseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exerciseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /exercises} : get all the exercises.
     * This endpoint is generally not used - exercises are fetched by unit.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exercises in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.TEACHER + "\")")
    public ResponseEntity<List<ExerciseDTO>> getAllExercises(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Exercises");
        Page<ExerciseDTO> page = exerciseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /exercises/:id} : get the "id" exercise.
     * Students and Teachers can view exercises.
     *
     * @param id the id of the exerciseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exerciseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> getExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Exercise : {}", id);
        Optional<ExerciseDTO> exerciseDTO = exerciseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(exerciseDTO);
    }

    /**
     * {@code GET  /exercises/by-unit/:unitId} : get all the exercises by unitId WITH OPTIONS.
     * This endpoint is designed for self-study mode where the frontend needs all questions
     * and answer options (including isCorrect field) for client-side answer checking.
     * This avoids N+1 query problem by eagerly fetching options.
     * Students and Teachers can view exercises.
     *
     * @param unitId the id of the unit.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exercises with options in body.
     */
    @GetMapping("/by-unit/{unitId}")
    public List<ExerciseDTO> getAllExercisesByUnitWithOptions(@PathVariable Long unitId) {
        LOG.debug("REST request to get all Exercises with options by unitId : {}", unitId);
        return exerciseService.findAllByUnitIdWithOptions(unitId);
    }

    /**
     * {@code GET  /exercises/:id/options} : get all options for the "id" exercise.
     * @deprecated This endpoint is deprecated. Use GET /api/exercises/by-unit/{unitId} instead,
     * which returns exercises with their options in a single request.
     *
     * @param id the id of the exercise.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of options in body.
     */
    @Deprecated
    @GetMapping("/{id}/options")
    public List<ExerciseOptionDTO> getExerciseOptions(@PathVariable Long id) {
        LOG.debug("REST request to get all Options by exerciseId : {}", id);
        return exerciseOptionService.findAllByExerciseId(id);
    }

    /**
     * {@code POST  /exercises/:id/check} : Check the answer for the "id" exercise.
     * @deprecated This endpoint is deprecated for self-study mode.
     * The frontend should perform answer checking locally using the isCorrect field from options.
     *
     * @param id the id of the exercise.
     * @param checkAnswerDTO the answer to check.
     * @return the result ("CORRECT" or "WRONG").
     */
    @Deprecated
    @PostMapping("/{id}/check")
    public ResponseEntity<String> checkAnswer(@PathVariable Long id, @RequestBody CheckAnswerDTO checkAnswerDTO) {
        LOG.debug("REST request to check answer for Exercise : {}", id);
        String result = exerciseService.checkAnswer(id, checkAnswerDTO.getStudentAnswer());
        return ResponseEntity.ok(result);
    }

    /**
     * {@code DELETE  /exercises/:id} : delete the "id" exercise.
     *
     * @param id the id of the exerciseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<Void> deleteExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Exercise : {}", id);

        Exercise exercise = exerciseRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(exercise.getUnit().getBook());

        exerciseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
