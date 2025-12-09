package com.langleague.web.rest;

import com.langleague.domain.enumeration.ExerciseType;
import com.langleague.repository.ExerciseResultRepository;
import com.langleague.service.ExerciseResultService;
import com.langleague.service.dto.ChapterStatisticsDTO;
import com.langleague.service.dto.ExerciseResultDTO;
import com.langleague.service.dto.ExerciseStatisticsDTO;
import com.langleague.service.dto.SubmitExerciseDTO;
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
 * REST controller for managing {@link com.langleague.domain.ExerciseResult}.
 */
@RestController
@RequestMapping("/api/exercise-results")
public class ExerciseResultResource {

    private static final Logger LOG = LoggerFactory.getLogger(ExerciseResultResource.class);

    private static final String ENTITY_NAME = "exerciseResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExerciseResultService exerciseResultService;

    private final ExerciseResultRepository exerciseResultRepository;

    public ExerciseResultResource(ExerciseResultService exerciseResultService, ExerciseResultRepository exerciseResultRepository) {
        this.exerciseResultService = exerciseResultService;
        this.exerciseResultRepository = exerciseResultRepository;
    }

    /**
     * {@code POST  /exercise-results} : Create a new exerciseResult.
     *
     * @param exerciseResultDTO the exerciseResultDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exerciseResultDTO, or with status {@code 400 (Bad Request)} if the exerciseResult has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseResultDTO> createExerciseResult(@RequestBody ExerciseResultDTO exerciseResultDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ExerciseResult : {}", exerciseResultDTO);
        if (exerciseResultDTO.getId() != null) {
            throw new BadRequestAlertException("A new exerciseResult cannot already have an ID", ENTITY_NAME, "idexists");
        }
        exerciseResultDTO = exerciseResultService.save(exerciseResultDTO);
        return ResponseEntity.created(new URI("/api/exercise-results/" + exerciseResultDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, exerciseResultDTO.getId().toString()))
            .body(exerciseResultDTO);
    }

    /**
     * {@code PUT  /exercise-results/:id} : Updates an existing exerciseResult.
     *
     * @param id the id of the exerciseResultDTO to save.
     * @param exerciseResultDTO the exerciseResultDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseResultDTO,
     * or with status {@code 400 (Bad Request)} if the exerciseResultDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exerciseResultDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseResultDTO> updateExerciseResult(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExerciseResultDTO exerciseResultDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ExerciseResult : {}, {}", id, exerciseResultDTO);
        if (exerciseResultDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseResultDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        exerciseResultDTO = exerciseResultService.update(exerciseResultDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exerciseResultDTO.getId().toString()))
            .body(exerciseResultDTO);
    }

    /**
     * {@code PATCH  /exercise-results/:id} : Partial updates given fields of an existing exerciseResult, field will ignore if it is null
     *
     * @param id the id of the exerciseResultDTO to save.
     * @param exerciseResultDTO the exerciseResultDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseResultDTO,
     * or with status {@code 400 (Bad Request)} if the exerciseResultDTO is not valid,
     * or with status {@code 404 (Not Found)} if the exerciseResultDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the exerciseResultDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseResultDTO> partialUpdateExerciseResult(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExerciseResultDTO exerciseResultDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ExerciseResult partially : {}, {}", id, exerciseResultDTO);
        if (exerciseResultDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseResultDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExerciseResultDTO> result = exerciseResultService.partialUpdate(exerciseResultDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exerciseResultDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /exercise-results} : get all the exerciseResults.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseResults in body.
     */
    @GetMapping("")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDTO>> getAllExerciseResults(
        @org.springframework.data.web.PageableDefault(
            size = 20,
            sort = "completedAt",
            direction = org.springframework.data.domain.Sort.Direction.DESC
        ) @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of ExerciseResults");
        Page<ExerciseResultDTO> page = exerciseResultService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /exercise-results/:id} : get the "id" exerciseResult.
     *
     * @param id the id of the exerciseResultDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exerciseResultDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseResultDTO> getExerciseResult(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ExerciseResult : {}", id);
        Optional<ExerciseResultDTO> exerciseResultDTO = exerciseResultService.findOne(id);
        return ResponseUtil.wrapOrNotFound(exerciseResultDTO);
    }

    /**
     * {@code DELETE  /exercise-results/:id} : delete the "id" exerciseResult.
     *
     * @param id the id of the exerciseResultDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteExerciseResult(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ExerciseResult : {}", id);
        exerciseResultService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /exercise-results/submit} : Submit exercise result from frontend.
     *
     * @param submitExerciseDTO the submission data from frontend.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exerciseResultDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/submit")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseResultDTO> submitExercise(@Valid @RequestBody SubmitExerciseDTO submitExerciseDTO)
        throws URISyntaxException {
        LOG.debug("REST request to submit exercise : {}", submitExerciseDTO);
        ExerciseResultDTO result = exerciseResultService.submitExercise(submitExerciseDTO);
        return ResponseEntity.created(new URI("/api/exercise-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /exercise-results/my-results} : Get all exercise results for current user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseResults in body.
     */
    @GetMapping("/my-results")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDTO>> getMyExerciseResults() {
        LOG.debug("REST request to get exercise results for current user");
        List<ExerciseResultDTO> results = exerciseResultService.findByCurrentUser();
        return ResponseEntity.ok().body(results);
    }

    /**
     * {@code GET  /exercise-results/my-results/by-type} : Get exercise results for current user by type.
     *
     * @param exerciseType the exercise type.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseResults in body.
     */
    @GetMapping("/my-results/by-type")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDTO>> getMyExerciseResultsByType(@RequestParam ExerciseType exerciseType) {
        LOG.debug("REST request to get exercise results for current user by type: {}", exerciseType);
        List<ExerciseResultDTO> results = exerciseResultService.findByCurrentUserAndExerciseType(exerciseType);
        return ResponseEntity.ok().body(results);
    }

    /**
     * {@code GET  /exercise-results/my-results/recent} : Get recent exercise results for current user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseResults in body.
     */
    @GetMapping("/my-results/recent")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDTO>> getMyRecentExerciseResults() {
        LOG.debug("REST request to get recent exercise results for current user");
        List<ExerciseResultDTO> results = exerciseResultService.findRecentByCurrentUser();
        return ResponseEntity.ok().body(results);
    }

    /**
     * {@code GET  /exercise-results/my-statistics} : Get exercise statistics for current user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the statistics in body.
     */
    @GetMapping("/my-statistics")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseStatisticsDTO> getMyExerciseStatistics() {
        LOG.debug("REST request to get exercise statistics for current user");
        ExerciseStatisticsDTO stats = exerciseResultService.getStatisticsForCurrentUser();
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /exercise-results/my-results/by-chapter/:chapterId} : Get exercise results for current user by chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseResults in body.
     */
    @GetMapping("/my-results/by-chapter/{chapterId}")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDTO>> getMyExerciseResultsByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get exercise results for current user by chapter: {}", chapterId);
        List<ExerciseResultDTO> results = exerciseResultService.findByCurrentUserAndChapter(chapterId);
        return ResponseEntity.ok().body(results);
    }

    /**
     * {@code GET  /exercise-results/my-results/by-chapter/:chapterId/by-type} : Get exercise results for current user by chapter and type.
     *
     * @param chapterId the chapter ID
     * @param exerciseType the exercise type
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseResults in body.
     */
    @GetMapping("/my-results/by-chapter/{chapterId}/by-type")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDTO>> getMyExerciseResultsByChapterAndType(
        @PathVariable Long chapterId,
        @RequestParam ExerciseType exerciseType
    ) {
        LOG.debug("REST request to get exercise results for current user by chapter: {} and type: {}", chapterId, exerciseType);
        List<ExerciseResultDTO> results = exerciseResultService.findByCurrentUserAndChapterAndType(chapterId, exerciseType);
        return ResponseEntity.ok().body(results);
    }

    /**
     * {@code GET  /exercise-results/my-statistics/by-chapter/:chapterId} : Get statistics for current user by chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the statistics in body.
     */
    @GetMapping("/my-statistics/by-chapter/{chapterId}")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChapterStatisticsDTO> getMyStatisticsByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get statistics for current user by chapter: {}", chapterId);
        ChapterStatisticsDTO stats = exerciseResultService.getStatisticsForChapter(chapterId);
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /exercise-results/count} : Get count of completed exercises for current user.
     * Use case: Dashboard statistics
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and count in body.
     */
    @GetMapping("/count")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> countMyExercises() {
        LOG.debug("REST request to count my exercises");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        Long count = exerciseResultService.countByUserLogin(userLogin);
        return ResponseEntity.ok().body(count);
    }
}
