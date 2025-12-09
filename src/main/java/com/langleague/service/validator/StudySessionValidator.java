package com.langleague.service.validator;

import com.langleague.domain.AppUser;
import com.langleague.repository.AppUserRepository;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.StudySessionDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Component;

/**
 * Validator for StudySession business rules.
 */
@Component
public class StudySessionValidator {

    private static final String ENTITY_NAME = "studySession";
    private static final int MAX_SESSION_HOURS = 24; // Maximum session duration in hours
    private static final int MIN_SESSION_MINUTES = 1; // Minimum session duration in minutes
    private static final int MAX_PAST_DAYS = 30; // Maximum days in the past for CREATE operations

    private final AppUserRepository appUserRepository;

    public StudySessionValidator(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    /**
     * Validate for CREATE operation (strict mode - rejects old sessions).
     *
     * @param studySessionDTO the DTO to validate
     * @throws BadRequestAlertException if validation fails
     */
    public void validateCreate(StudySessionDTO studySessionDTO) {
        validateStartAt(studySessionDTO.getStartAt(), true); // strict mode
        validateEndAt(studySessionDTO.getStartAt(), studySessionDTO.getEndAt());
        validateDurationMinutes(studySessionDTO.getStartAt(), studySessionDTO.getEndAt(), studySessionDTO.getDurationMinutes());
        validateAppUserExists(studySessionDTO.getAppUser());
    }

    /**
     * Validate for UPDATE operation (relaxed mode - allows editing old sessions).
     *
     * @param studySessionDTO the DTO to validate
     * @throws BadRequestAlertException if validation fails
     */
    public void validateUpdate(StudySessionDTO studySessionDTO) {
        validateStartAt(studySessionDTO.getStartAt(), false); // relaxed mode
        validateEndAt(studySessionDTO.getStartAt(), studySessionDTO.getEndAt());
        validateDurationMinutes(studySessionDTO.getStartAt(), studySessionDTO.getEndAt(), studySessionDTO.getDurationMinutes());
        validateAppUserExists(studySessionDTO.getAppUser());
    }

    /**
     * Validate a study session DTO (backward compatibility - uses strict mode).
     *
     * @param studySessionDTO the DTO to validate
     * @throws BadRequestAlertException if validation fails
     * @deprecated Use {@link #validateCreate(StudySessionDTO)} or {@link #validateUpdate(StudySessionDTO)} instead
     */
    @Deprecated
    public void validate(StudySessionDTO studySessionDTO) {
        validateCreate(studySessionDTO);
    }

    /**
     * Validate startAt with optional strictness.
     *
     * @param startAt the start time to validate
     * @param strictPastCheck if true, reject sessions older than MAX_PAST_DAYS (CREATE only)
     * @throws BadRequestAlertException if validation fails
     */
    private void validateStartAt(Instant startAt, boolean strictPastCheck) {
        if (startAt == null) {
            throw new BadRequestAlertException("Start time is required", ENTITY_NAME, "startatnull");
        }

        Instant now = Instant.now();

        // Check future (always strict)
        if (startAt.isAfter(now.plusSeconds(60))) {
            // Allow 60 seconds tolerance for clock skew
            throw new BadRequestAlertException("Start time cannot be in the future", ENTITY_NAME, "startatfuture");
        }

        // Check too old in past (only for CREATE)
        if (strictPastCheck) {
            Instant maxPastDate = now.minus(MAX_PAST_DAYS, ChronoUnit.DAYS);
            if (startAt.isBefore(maxPastDate)) {
                throw new BadRequestAlertException(
                    String.format("Start time cannot be more than %d days in the past", MAX_PAST_DAYS),
                    ENTITY_NAME,
                    "startattooold"
                );
            }
        }
    }

    /**
     * Validate endAt is not null, is after startAt, and not in the future.
     *
     * @param startAt the start time
     * @param endAt the end time to validate
     * @throws BadRequestAlertException if validation fails
     */
    private void validateEndAt(Instant startAt, Instant endAt) {
        if (endAt == null) {
            throw new BadRequestAlertException("End time is required", ENTITY_NAME, "endatnull");
        }

        Instant now = Instant.now();

        // Check if endAt is in the future
        if (endAt.isAfter(now.plusSeconds(60))) {
            // Allow 60 seconds tolerance
            throw new BadRequestAlertException("End time cannot be in the future", ENTITY_NAME, "endatfuture");
        }

        if (startAt != null && !endAt.isAfter(startAt)) {
            throw new BadRequestAlertException("End time must be after start time", ENTITY_NAME, "endatbeforestart");
        }

        // Validate maximum session duration
        if (startAt != null) {
            Duration duration = Duration.between(startAt, endAt);
            long hours = duration.toHours();
            if (hours > MAX_SESSION_HOURS) {
                throw new BadRequestAlertException(
                    String.format("Session duration cannot exceed %d hours", MAX_SESSION_HOURS),
                    ENTITY_NAME,
                    "durationtoolong"
                );
            }
        }
    }

    /**
     * Validate durationMinutes matches the time range and is within acceptable bounds.
     */
    private void validateDurationMinutes(Instant startAt, Instant endAt, Integer durationMinutes) {
        if (durationMinutes == null) {
            return; // Will be auto-calculated
        }

        if (durationMinutes < MIN_SESSION_MINUTES) {
            throw new BadRequestAlertException(
                String.format("Session duration must be at least %d minute(s)", MIN_SESSION_MINUTES),
                ENTITY_NAME,
                "durationtooshort"
            );
        }

        if (startAt != null && endAt != null) {
            long calculatedMinutes = Duration.between(startAt, endAt).toMinutes();
            long difference = Math.abs(calculatedMinutes - durationMinutes);

            // Allow small difference due to rounding
            if (difference > 1) {
                throw new BadRequestAlertException(
                    String.format("Duration minutes (%d) does not match the time range (%d minutes)", durationMinutes, calculatedMinutes),
                    ENTITY_NAME,
                    "durationmismatch"
                );
            }
        }
    }

    /**
     * Validate appUser exists in database.
     *
     * @param appUserObj the app user object (can be AppUserDTO or AppUser entity)
     * @throws BadRequestAlertException if user is null, has no ID, or doesn't exist in DB
     */
    private void validateAppUserExists(Object appUserObj) {
        if (appUserObj == null) {
            throw new BadRequestAlertException("User is required", ENTITY_NAME, "appusernull");
        }

        // Extract user ID
        Long userId = null;
        if (appUserObj instanceof AppUserDTO) {
            userId = ((AppUserDTO) appUserObj).getId();
        } else if (appUserObj instanceof AppUser) {
            userId = ((AppUser) appUserObj).getId();
        }

        if (userId == null) {
            throw new BadRequestAlertException("User ID is required", ENTITY_NAME, "useridnull");
        }

        // Check user exists in database
        if (!appUserRepository.existsById(userId)) {
            throw new BadRequestAlertException(String.format("User with ID %d does not exist", userId), ENTITY_NAME, "usernotfound");
        }
    }

    /**
     * Calculate duration in minutes from start and end time.
     *
     * @param startAt the start time
     * @param endAt the end time
     * @return duration in minutes
     * @throws IllegalArgumentException if times are null or endAt is before startAt
     */
    public int calculateDurationMinutes(Instant startAt, Instant endAt) {
        if (startAt == null || endAt == null) {
            throw new IllegalArgumentException("Start time and end time must not be null");
        }

        if (endAt.isBefore(startAt)) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        return (int) Duration.between(startAt, endAt).toMinutes();
    }
}
