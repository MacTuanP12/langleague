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
     *
     * @param progressDTO the progressDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new progressDTO, or with status {@code 400 (Bad Request)} if the progress has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
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
     *
     * @param id the id of the progressDTO to save.
     * @param progressDTO the progressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated progressDTO,
     * or with status {@code 400 (Bad Request)} if the progressDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the progressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
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
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of progresses in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
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

    @GetMapping("/user/{userProfileId}")
    public List<ProgressDTO> getProgressesByUser(@PathVariable Long userProfileId) {
        return progressService.findAllByUserProfileId(userProfileId);
    }

    @GetMapping("/unit/{unitId}")
    public List<ProgressDTO> getProgressesByUnit(@PathVariable Long unitId) {
        return progressService.findAllByUnitId(unitId);
    }

    @GetMapping("/user/{userProfileId}/unit/{unitId}")
    public ResponseEntity<ProgressDTO> getProgressByUserAndUnit(@PathVariable Long userProfileId, @PathVariable Long unitId) {
        Optional<ProgressDTO> progressDTO = progressService.findByUserProfileIdAndUnitId(userProfileId, unitId);
        return ResponseUtil.wrapOrNotFound(progressDTO);
    }

    @PostMapping("/complete-unit/{unitId}")
    public ResponseEntity<ProgressDTO> completeUnit(@PathVariable Long unitId) {
        ProgressDTO result = progressService.completeUnit(unitId);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code GET  /progresses/:id} : get the "id" progress.
     *
     * @param id the id of the progressDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the progressDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProgressDTO> getProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Progress : {}", id);
        Optional<ProgressDTO> progressDTO = progressService.findOne(id);
        return ResponseUtil.wrapOrNotFound(progressDTO);
    }

    /**
     * {@code DELETE  /progresses/:id} : delete the "id" progress.
     *
     * @param id the id of the progressDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Progress : {}", id);
        progressService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
