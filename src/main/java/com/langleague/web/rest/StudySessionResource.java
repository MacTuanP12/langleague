package com.langleague.web.rest;

import com.langleague.repository.StudySessionRepository;
import com.langleague.service.StudySessionService;
import com.langleague.service.dto.StudySessionDTO;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.StudySession}.
 */
@RestController
@RequestMapping("/api/study-sessions")
public class StudySessionResource {

    private static final Logger LOG = LoggerFactory.getLogger(StudySessionResource.class);

    private static final String ENTITY_NAME = "studySession";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudySessionService studySessionService;

    private final StudySessionRepository studySessionRepository;

    public StudySessionResource(StudySessionService studySessionService, StudySessionRepository studySessionRepository) {
        this.studySessionService = studySessionService;
        this.studySessionRepository = studySessionRepository;
    }

    /**
     * {@code POST  /study-sessions} : Create a new studySession.
     *
     * @param studySessionDTO the studySessionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studySessionDTO, or with status {@code 400 (Bad Request)} if the studySession has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<StudySessionDTO> createStudySession(@Valid @RequestBody StudySessionDTO studySessionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save StudySession : {}", studySessionDTO);
        if (studySessionDTO.getId() != null) {
            throw new BadRequestAlertException("A new studySession cannot already have an ID", ENTITY_NAME, "idexists");
        }
        studySessionDTO = studySessionService.save(studySessionDTO);
        return ResponseEntity.created(new URI("/api/study-sessions/" + studySessionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, studySessionDTO.getId().toString()))
            .body(studySessionDTO);
    }

    /**
     * {@code PUT  /study-sessions/:id} : Updates an existing studySession.
     *
     * @param id the id of the studySessionDTO to save.
     * @param studySessionDTO the studySessionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studySessionDTO,
     * or with status {@code 400 (Bad Request)} if the studySessionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studySessionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<StudySessionDTO> updateStudySession(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudySessionDTO studySessionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update StudySession : {}, {}", id, studySessionDTO);
        if (studySessionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studySessionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studySessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        studySessionDTO = studySessionService.update(studySessionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studySessionDTO.getId().toString()))
            .body(studySessionDTO);
    }

    /**
     * {@code PATCH  /study-sessions/:id} : Partial updates given fields of an existing studySession, field will ignore if it is null
     *
     * @param id the id of the studySessionDTO to save.
     * @param studySessionDTO the studySessionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studySessionDTO,
     * or with status {@code 400 (Bad Request)} if the studySessionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the studySessionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the studySessionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudySessionDTO> partialUpdateStudySession(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudySessionDTO studySessionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update StudySession partially : {}, {}", id, studySessionDTO);
        if (studySessionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studySessionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studySessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudySessionDTO> result = studySessionService.partialUpdate(studySessionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studySessionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /study-sessions} : get all the studySessions for current user.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studySessions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<StudySessionDTO>> getAllStudySessions(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of StudySessions for current user");
        try {
            Page<StudySessionDTO> page = studySessionService.findByCurrentUser(pageable);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page.getContent());
        } catch (Exception e) {
            LOG.error("Error getting study sessions: {}", e.getMessage(), e);
            // Return empty list instead of throwing error
            return ResponseEntity.ok().body(java.util.Collections.emptyList());
        }
    }

    /**
     * {@code GET  /study-sessions/:id} : get the "id" studySession.
     *
     * @param id the id of the studySessionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studySessionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StudySessionDTO> getStudySession(@PathVariable("id") Long id) {
        LOG.debug("REST request to get StudySession : {}", id);
        Optional<StudySessionDTO> studySessionDTO = studySessionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(studySessionDTO);
    }

    /**
     * {@code DELETE  /study-sessions/:id} : delete the "id" studySession.
     *
     * @param id the id of the studySessionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudySession(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete StudySession : {}", id);
        studySessionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
