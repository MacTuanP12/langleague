package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.StudySession;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.StudySessionRepository;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.StudySessionDTO;
import com.langleague.service.mapper.StudySessionMapper;
import com.langleague.service.validator.StudySessionValidator;
import com.langleague.web.rest.errors.BadRequestAlertException;
import com.langleague.web.rest.errors.UnauthorizedAccessException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.StudySession}.
 */
@Service
@Transactional
public class StudySessionService {

    private static final Logger LOG = LoggerFactory.getLogger(StudySessionService.class);
    private static final String ENTITY_NAME = "studySession";

    private final StudySessionRepository studySessionRepository;
    private final StudySessionMapper studySessionMapper;
    private final StudySessionValidator studySessionValidator;
    private final AppUserRepository appUserRepository;

    public StudySessionService(
        StudySessionRepository studySessionRepository,
        StudySessionMapper studySessionMapper,
        StudySessionValidator studySessionValidator,
        AppUserRepository appUserRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.studySessionMapper = studySessionMapper;
        this.studySessionValidator = studySessionValidator;
        this.appUserRepository = appUserRepository;
    }

    /**
     * Save a studySession.
     *
     * RACE CONDITION PREVENTION:
     * - Uses SERIALIZABLE isolation to prevent concurrent double-submission
     * - If two requests try to create overlapping sessions simultaneously,
     *   database will serialize them, ensuring overlap check works correctly
     * - Trade-off: Slightly slower, but prevents data corruption
     *
     * Additional safeguards:
     * 1. Frontend should disable submit button after click
     * 2. Database has index on (app_user_id, start_at, end_at)
     * 3. Optional: Add database trigger (see docs/database/prevent_race_condition_study_session.sql)
     *
     * @param studySessionDTO the entity to save.
     * @return the persisted entity.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public StudySessionDTO save(StudySessionDTO studySessionDTO) {
        LOG.debug("Request to save StudySession : {}", studySessionDTO);

        // Determine if this is CREATE or UPDATE
        boolean isUpdate = studySessionDTO.getId() != null;

        // Get current user
        Long currentUserId = SecurityUtils.getCurrentUserId().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "usernotauthenticated")
        );

        // === SECURITY: "TRUST NO ONE" - Always get current user from DB ===
        // Get current user's AppUser profile (app_user table)
        AppUser currentAppUser = appUserRepository
            .findByInternalUserId(currentUserId) // currentUserId = jhi_user.id
            .orElseThrow(() -> new BadRequestAlertException("User profile not found", ENTITY_NAME, "usernotfound"));

        if (isUpdate) {
            // For UPDATE: Verify ownership from database (not from DTO!)
            StudySession existingSession = studySessionRepository
                .findById(studySessionDTO.getId())
                .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

            // Check ownership: Compare app_user.id from DB
            if (!existingSession.getAppUser().getId().equals(currentAppUser.getId())) {
                throw new UnauthorizedAccessException(ENTITY_NAME, "update");
            }

            // ALWAYS override appUser with current user (ignore DTO)
            // This prevents any attempt to change owner
            AppUserDTO appUserDTO = new AppUserDTO();
            appUserDTO.setId(currentAppUser.getId());
            studySessionDTO.setAppUser(appUserDTO);
        } else {
            // For CREATE: ALWAYS assign current user (ignore DTO completely)
            // This is the "Trust No One" principle - never trust client input for user
            AppUserDTO appUserDTO = new AppUserDTO();
            appUserDTO.setId(currentAppUser.getId());
            studySessionDTO.setAppUser(appUserDTO);
        }

        // === STEP 1: Calculate duration BEFORE validation ===
        // (In case validator has @NotNull constraint on durationMinutes)
        if (studySessionDTO.getDurationMinutes() == null || studySessionDTO.getDurationMinutes() == 0) {
            int calculatedDuration = studySessionValidator.calculateDurationMinutes(
                studySessionDTO.getStartAt(),
                studySessionDTO.getEndAt()
            );
            studySessionDTO.setDurationMinutes(calculatedDuration);
        }

        // === STEP 2: Validate AFTER user assignment and duration calculation ===
        // Use different validation strategies for CREATE vs UPDATE
        if (isUpdate) {
            studySessionValidator.validateUpdate(studySessionDTO);
        } else {
            studySessionValidator.validateCreate(studySessionDTO);
        }

        // === STEP 3: Check for overlapping sessions ===
        // Pass session ID for UPDATE to exclude current session from overlap check
        Long excludeSessionId = isUpdate ? studySessionDTO.getId() : null;
        checkForOverlappingSessions(currentUserId, studySessionDTO.getStartAt(), studySessionDTO.getEndAt(), excludeSessionId);

        // === STEP 4: Save to database ===
        StudySession studySession = studySessionMapper.toEntity(studySessionDTO);
        studySession = studySessionRepository.save(studySession);
        return studySessionMapper.toDto(studySession);
    }

    /**
     * Update a studySession.
     * Delegates to save() which handles both CREATE and UPDATE with proper security checks.
     *
     * @param studySessionDTO the entity to save.
     * @return the persisted entity.
     */
    public StudySessionDTO update(StudySessionDTO studySessionDTO) {
        LOG.debug("Request to update StudySession : {}", studySessionDTO);

        if (studySessionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        // Reuse save() method which now handles UPDATE with proper security
        return save(studySessionDTO);
    }

    /**
     * Partially update a studySession.
     *
     * @param studySessionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StudySessionDTO> partialUpdate(StudySessionDTO studySessionDTO) {
        LOG.debug("Request to partially update StudySession : {}", studySessionDTO);

        return studySessionRepository
            .findById(studySessionDTO.getId())
            .map(existingStudySession -> {
                // Security check: User can only update their own sessions
                checkOwnership(existingStudySession);

                // Prevent changing the appUser
                if (
                    studySessionDTO.getAppUser() != null &&
                    !existingStudySession.getAppUser().getId().equals(studySessionDTO.getAppUser().getId())
                ) {
                    throw new BadRequestAlertException("Cannot change the owner of a study session", ENTITY_NAME, "ownerchange");
                }

                // Store original values for validation
                Instant originalStartAt = existingStudySession.getStartAt();
                Instant originalEndAt = existingStudySession.getEndAt();

                // Apply partial update
                studySessionMapper.partialUpdate(existingStudySession, studySessionDTO);

                // Get the updated values
                Instant newStartAt = existingStudySession.getStartAt();
                Instant newEndAt = existingStudySession.getEndAt();

                // Validate if time fields were updated
                if (!newStartAt.equals(originalStartAt) || !newEndAt.equals(originalEndAt)) {
                    studySessionValidator.validateUpdate(studySessionMapper.toDto(existingStudySession));

                    // Check for overlapping sessions
                    checkForOverlappingSessions(
                        existingStudySession.getAppUser().getInternalUser().getId(),
                        newStartAt,
                        newEndAt,
                        existingStudySession.getId()
                    );
                }

                // Recalculate duration if time fields changed
                if (!newStartAt.equals(originalStartAt) || !newEndAt.equals(originalEndAt)) {
                    int calculatedDuration = studySessionValidator.calculateDurationMinutes(newStartAt, newEndAt);
                    existingStudySession.setDurationMinutes(calculatedDuration);
                }

                return existingStudySession;
            })
            .map(studySessionRepository::save)
            .map(studySessionMapper::toDto);
    }

    /**
     * Get all the studySessions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudySessionDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StudySessions");
        return studySessionRepository.findAll(pageable).map(studySessionMapper::toDto);
    }

    /**
     * Get all the studySessions for current user.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudySessionDTO> findByCurrentUser(Pageable pageable) {
        LOG.debug("Request to get all StudySessions for current user");

        try {
            // Check if user is authenticated
            Optional<Long> currentUserIdOpt = SecurityUtils.getCurrentUserId();
            if (currentUserIdOpt.isEmpty()) {
                LOG.warn("User not authenticated, returning empty page");
                return Page.empty(pageable);
            }

            // Check if AppUser exists
            Long currentUserId = currentUserIdOpt.get();
            Optional<AppUser> appUserOpt = appUserRepository.findByInternalUserId(currentUserId);
            if (appUserOpt.isEmpty()) {
                LOG.warn("AppUser not found for user ID {}, returning empty page", currentUserId);
                return Page.empty(pageable);
            }

            return studySessionRepository.findByUserIsCurrentUser(pageable).map(studySessionMapper::toDto);
        } catch (Exception e) {
            LOG.error("Error fetching study sessions for current user", e);
            // Return empty page instead of throwing exception
            return Page.empty(pageable);
        }
    }

    /**
     * Get one studySession by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StudySessionDTO> findOne(Long id) {
        LOG.debug("Request to get StudySession : {}", id);
        return studySessionRepository
            .findById(id)
            .map(studySession -> {
                // Security check: User can only view their own sessions
                checkOwnership(studySession);
                return studySession;
            })
            .map(studySessionMapper::toDto);
    }

    /**
     * Delete the studySession by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete StudySession : {}", id);

        // Get the session and check ownership
        StudySession studySession = studySessionRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

        // Security check: User can only delete their own sessions
        checkOwnership(studySession);

        studySessionRepository.deleteById(id);
    }

    /**
     * Check if the current user owns the study session.
     *
     * @param studySession the study session to check
     * @throws UnauthorizedAccessException if user doesn't own the session
     */
    private void checkOwnership(StudySession studySession) {
        Long currentUserId = SecurityUtils.getCurrentUserId().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "usernotauthenticated")
        );

        Long sessionOwnerId = studySession.getAppUser().getInternalUser().getId();

        if (!currentUserId.equals(sessionOwnerId)) {
            throw new UnauthorizedAccessException(ENTITY_NAME, "access");
        }
    }

    /**
     * Check for overlapping study sessions.
     *
     * @param userId the user ID
     * @param startAt the start time
     * @param endAt the end time
     * @param excludeSessionId the session ID to exclude from check (for updates)
     * @throws BadRequestAlertException if overlapping sessions found
     */
    private void checkForOverlappingSessions(Long userId, Instant startAt, Instant endAt, Long excludeSessionId) {
        // Use optimized query that correctly detects overlaps
        // Two sessions overlap if: session1.start < session2.end AND session1.end > session2.start
        List<StudySession> overlappingSessions = studySessionRepository.findOverlappingSessions(userId, startAt, endAt);

        // Filter out the current session if updating
        if (excludeSessionId != null) {
            overlappingSessions = overlappingSessions
                .stream()
                .filter(session -> !session.getId().equals(excludeSessionId))
                .toList();
        }

        // If any overlapping sessions found, throw error
        if (!overlappingSessions.isEmpty()) {
            throw new BadRequestAlertException("A study session already exists during this time period", ENTITY_NAME, "sessionoverlap");
        }
    }
}
