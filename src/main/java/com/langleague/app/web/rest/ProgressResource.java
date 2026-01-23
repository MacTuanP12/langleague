package com.langleague.app.web.rest;

import com.langleague.app.repository.ProgressRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.service.ProgressService;
import com.langleague.app.service.dto.ProgressDTO;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.app.domain.Progress}.
 */
@RestController
@RequestMapping("/api/progresses")
public class ProgressResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProgressResource.class);

    private static final String ENTITY_NAME = "progress";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProgressService progressService;

    private final ProgressRepository progressRepository;

    public ProgressResource(ProgressService progressService, ProgressRepository progressRepository) {
        this.progressService = progressService;
        this.progressRepository = progressRepository;
    }

    /**
     * {@code POST  /progresses} : Create a new progress.
     * Only students can create progress. Teacher không có quyền truy cập progress.
     *
     * @param progressDTO the progressDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new progressDTO, or with status {@code 400 (Bad Request)} if the progress has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> createProgress(@Valid @RequestBody ProgressDTO progressDTO) throws URISyntaxException {
        LOG.debug("REST request to save Progress : {}", progressDTO);
        if (progressDTO.getId() != null) {
            throw new BadRequestAlertException("A new progress cannot already have an ID", ENTITY_NAME, "idexists");
        }
        progressDTO = progressService.save(progressDTO);
        return ResponseEntity.created(new URI("/api/progresses/" + progressDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, progressDTO.getId().toString()))
            .body(progressDTO);
    }

    /**
     * {@code PUT  /progresses/:id} : Updates an existing progress.
     * Note: Students should use complete-unit endpoint instead. This is for admin purposes only.
     *
     * @param id the id of the progressDTO to save.
     * @param progressDTO the progressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated progressDTO,
     * or with status {@code 400 (Bad Request)} if the progressDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the progressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ProgressDTO> updateProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProgressDTO progressDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Progress : {}, {}", id, progressDTO);
        if (progressDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, progressDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!progressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        progressDTO = progressService.update(progressDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, progressDTO.getId().toString()))
            .body(progressDTO);
    }

    /**
     * {@code PATCH  /progresses/:id} : Partial updates given fields of an existing progress, field will ignore if it is null
     * Only students can update their own progress. Teacher không có quyền truy cập progress.
     *
     * @param id the id of the progressDTO to save.
     * @param progressDTO the progressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated progressDTO,
     * or with status {@code 400 (Bad Request)} if the progressDTO is not valid,
     * or with status {@code 404 (Not Found)} if the progressDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the progressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> partialUpdateProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProgressDTO progressDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Progress partially : {}, {}", id, progressDTO);
        if (progressDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, progressDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!progressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProgressDTO> result = progressService.partialUpdate(progressDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, progressDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /progresses} : get all the progresses.
     * This endpoint is generally not used - progress is tracked per student or per unit.
     * Only students can view progresses. Teacher không có quyền truy cập progress.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of progresses in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public List<ProgressDTO> getAllProgresses() {
        LOG.debug("REST request to get all Progresses");
        return progressService.findAll();
    }

    /**
     * {@code GET  /progresses/my-progresses} : get all the progresses for current user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of progresses in body.
     */
    @GetMapping("/my-progresses")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public List<ProgressDTO> getMyProgresses() {
        LOG.debug("REST request to get all Progresses for current user");
        return progressService.findAllByCurrentUser();
    }

    /**
     * {@code GET  /progresses/my-progresses/unit/:unitId} : get progress for current user and unit.
     *
     * @param unitId the id of the unit.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/my-progresses/unit/{unitId}")
    public ResponseEntity<ProgressDTO> getMyProgressByUnit(@PathVariable Long unitId) {
        LOG.debug("REST request to get Progress for current user and unit : {}", unitId);
        Optional<ProgressDTO> progressDTO = progressService.findByCurrentUserAndUnitId(unitId);
        return ResponseUtil.wrapOrNotFound(progressDTO);
    }

    /**
     * {@code GET  /progresses/user/:userProfileId} : get all progresses for a specific user.
     * Only students can view their own progress. Teacher không có quyền truy cập progress.
     *
     * @param userProfileId the id of the user profile.
     * @return the list of progresses.
     */
    @GetMapping("/user/{userProfileId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public List<ProgressDTO> getProgressesByUser(@PathVariable Long userProfileId) {
        return progressService.findAllByUserProfileId(userProfileId);
    }

    /**
     * {@code GET  /progresses/unit/:unitId} : get all progresses for a specific unit.
     * Only students can view their own progress. Teacher không có quyền truy cập progress.
     *
     * @param unitId the id of the unit.
     * @return the list of progresses.
     */
    @GetMapping("/unit/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public List<ProgressDTO> getProgressesByUnit(@PathVariable Long unitId) {
        return progressService.findAllByUnitId(unitId);
    }

    /**
     * {@code GET  /progresses/user/:userProfileId/unit/:unitId} : get progress for a specific user and unit.
     * Only students can view their own progress. Teacher không có quyền truy cập progress.
     *
     * @param userProfileId the id of the user profile.
     * @param unitId the id of the unit.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO.
     */
    @GetMapping("/user/{userProfileId}/unit/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> getProgressByUserAndUnit(@PathVariable Long userProfileId, @PathVariable Long unitId) {
        Optional<ProgressDTO> progressDTO = progressService.findByUserProfileIdAndUnitId(userProfileId, unitId);
        return ResponseUtil.wrapOrNotFound(progressDTO);
    }

    /**
     * {@code POST  /progresses/complete-unit/:unitId} : Mark a unit as completed for current user.
     *
     * @param unitId the id of the unit to complete.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO.
     */
    @PostMapping("/complete-unit/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> completeUnit(@PathVariable Long unitId) {
        ProgressDTO result = progressService.completeUnit(unitId);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code POST  /progresses/toggle-bookmark/:unitId} : Toggle bookmark status for a unit.
     * UC-49: Manual bookmark functionality for review.
     *
     * @param unitId the id of the unit to bookmark/unbookmark.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO.
     */
    @PostMapping("/toggle-bookmark/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> toggleBookmark(@PathVariable Long unitId) {
        LOG.debug("REST request to toggle bookmark for unit : {}", unitId);
        ProgressDTO result = progressService.toggleBookmark(unitId);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code POST  /progresses/track-access/:unitId} : Track unit access for auto-resume.
     * UC-49: Automatic tracking of last accessed unit.
     *
     * @param unitId the id of the unit being accessed.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO.
     */
    @PostMapping("/track-access/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> trackUnitAccess(@PathVariable Long unitId) {
        LOG.debug("REST request to track access for unit : {}", unitId);
        ProgressDTO result = progressService.trackUnitAccess(unitId);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code GET  /progresses/bookmarked} : Get all bookmarked units for current user.
     * UC-49: Retrieve bookmarked units for review.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookmarked progresses.
     */
    @GetMapping("/bookmarked")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public List<ProgressDTO> getBookmarkedUnits() {
        LOG.debug("REST request to get bookmarked units for current user");
        return progressService.findBookmarkedByCurrentUser();
    }

    /**
     * {@code GET  /progresses/resume} : Get the most recently accessed unit for auto-resume.
     * UC-49: Resume learning from last accessed unit.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO.
     */
    @GetMapping("/resume")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> getResumeUnit() {
        LOG.debug("REST request to get resume unit for current user");
        Optional<ProgressDTO> progressDTO = progressService.findMostRecentlyAccessedByCurrentUser();
        return ResponseUtil.wrapOrNotFound(progressDTO);
    }

    /**
     * {@code POST  /progresses/update-section/:unitId/:sectionType} : Update section progress.
     * UC-49: Granular tracking of vocabulary, grammar, and exercise completion.
     *
     * @param unitId the id of the unit.
     * @param sectionType the type of section completed (VOCABULARY, GRAMMAR, EXERCISE).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO.
     */
    @PostMapping("/update-section/{unitId}/{sectionType}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> updateSectionProgress(@PathVariable Long unitId, @PathVariable String sectionType) {
        LOG.debug("REST request to update section progress for unit {} : section {}", unitId, sectionType);
        ProgressDTO result = progressService.updateSectionProgress(unitId, sectionType);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code GET  /progresses/stats/completion-rate} : get system-wide completion rate.
     * Only admins can view this statistic.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the rate in body.
     */
    @GetMapping("/stats/completion-rate")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<Integer> getSystemCompletionRate() {
        LOG.debug("REST request to get system completion rate");
        return ResponseEntity.ok(progressService.getSystemCompletionRate());
    }

    /**
     * {@code GET  /progresses/:id} : get the "id" progress.
     * Only students can view their own progress. Teacher không có quyền truy cập progress.
     *
     * @param id the id of the progressDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<ProgressDTO> getProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Progress : {}", id);
        Optional<ProgressDTO> progressDTO = progressService.findOne(id);
        return ResponseUtil.wrapOrNotFound(progressDTO);
    }

    /**
     * {@code DELETE  /progresses/:id} : delete the "id" progress.
     * Note: Only admins can delete progress records.
     *
     * @param id the id of the progressDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<Void> deleteProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Progress : {}", id);
        progressService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
