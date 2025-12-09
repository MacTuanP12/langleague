package com.langleague.service.validator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.langleague.repository.AppUserRepository;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.StudySessionDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Test class for StudySessionValidator.
 */
@ExtendWith(MockitoExtension.class)
class StudySessionValidatorTest {

    @Mock
    private AppUserRepository appUserRepository;

    private StudySessionValidator validator;

    @BeforeEach
    void setUp() {
        validator = new StudySessionValidator(appUserRepository);

        // Mock user existence by default
        when(appUserRepository.existsById(1L)).thenReturn(true);
    }

    @Test
    void testValidateValidSession() {
        // Given
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now);

        // When & Then - should not throw
        assertDoesNotThrow(() -> validator.validate(dto));
    }

    @Test
    void testValidateStartAtNull() {
        // Given
        StudySessionDTO dto = createValidSession(null, Instant.now());

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("Start time is required"));
    }

    @Test
    void testValidateStartAtInFuture() {
        // Given
        Instant future = Instant.now().plus(2, ChronoUnit.HOURS);
        StudySessionDTO dto = createValidSession(future, future.plus(1, ChronoUnit.HOURS));

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("cannot be in the future"));
    }

    @Test
    void testValidateEndAtNull() {
        // Given
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), null);

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("End time is required"));
    }

    @Test
    void testValidateEndAtBeforeStartAt() {
        // Given
        Instant now = Instant.now();
        Instant earlier = now.minus(1, ChronoUnit.HOURS);
        StudySessionDTO dto = createValidSession(now, earlier); // end before start

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("End time must be after start time"));
    }

    @Test
    void testValidateDurationTooLong() {
        // Given
        Instant start = Instant.now().minus(25, ChronoUnit.HOURS);
        Instant end = Instant.now();
        StudySessionDTO dto = createValidSession(start, end);

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("cannot exceed"));
    }

    @Test
    void testValidateDurationTooShort() {
        // Given
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now);
        dto.setDurationMinutes(0); // too short

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("must be at least"));
    }

    @Test
    void testValidateDurationMismatch() {
        // Given
        Instant start = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant end = Instant.now();
        StudySessionDTO dto = createValidSession(start, end);
        dto.setDurationMinutes(30); // should be ~60

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("does not match"));
    }

    @Test
    void testValidateAppUserNull() {
        // Given
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now);
        dto.setAppUser(null);

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validate(dto));
        assertTrue(exception.getMessage().contains("User is required"));
    }

    @Test
    void testCalculateDurationMinutes() {
        // Given
        Instant start = Instant.parse("2025-11-29T10:00:00Z");
        Instant end = Instant.parse("2025-11-29T11:30:00Z");

        // When
        int duration = validator.calculateDurationMinutes(start, end);

        // Then
        assertEquals(90, duration);
    }

    @Test
    void testCalculateDurationMinutesWithNullValues() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> validator.calculateDurationMinutes(null, Instant.now()));
        assertThrows(IllegalArgumentException.class, () -> validator.calculateDurationMinutes(Instant.now(), null));
        assertThrows(IllegalArgumentException.class, () -> validator.calculateDurationMinutes(null, null));
    }

    @Test
    void testCalculateDurationWithEndBeforeStart() {
        // Given
        Instant start = Instant.now();
        Instant end = start.minus(1, ChronoUnit.HOURS);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            validator.calculateDurationMinutes(start, end)
        );
        assertTrue(exception.getMessage().contains("End time must be after start time"));
    }

    // ========== NEW TESTS FOR CREATE/UPDATE VALIDATION ==========

    @Test
    void testValidateCreateOldSession() {
        // Given: Trying to CREATE session 40 days ago (exceeds MAX_PAST_DAYS = 30)
        Instant oldStart = Instant.now().minus(40, ChronoUnit.DAYS);
        Instant oldEnd = oldStart.plus(1, ChronoUnit.HOURS);
        StudySessionDTO dto = createValidSession(oldStart, oldEnd);

        // When & Then: Should throw for CREATE
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validateCreate(dto));
        assertTrue(exception.getMessage().contains("days in the past"));
    }

    @Test
    void testValidateUpdateOldSession() {
        // Given: Session created 40 days ago (exceeds MAX_PAST_DAYS = 30)
        Instant oldStart = Instant.now().minus(40, ChronoUnit.DAYS);
        Instant oldEnd = oldStart.plus(1, ChronoUnit.HOURS);
        StudySessionDTO dto = createValidSession(oldStart, oldEnd);

        // When & Then: Should NOT throw for UPDATE (relaxed mode)
        assertDoesNotThrow(() -> validator.validateUpdate(dto));
    }

    @Test
    void testValidateCreateRecentSession() {
        // Given: Session within 30 days
        Instant recentStart = Instant.now().minus(20, ChronoUnit.DAYS);
        Instant recentEnd = recentStart.plus(1, ChronoUnit.HOURS);
        StudySessionDTO dto = createValidSession(recentStart, recentEnd);

        // When & Then: Should be valid for CREATE
        assertDoesNotThrow(() -> validator.validateCreate(dto));
    }

    @Test
    void testValidateUserNotExists() {
        // Given: Non-existent user
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now);

        AppUserDTO appUserDTO = new AppUserDTO();
        appUserDTO.setId(99999L); // Non-existent user
        dto.setAppUser(appUserDTO);

        when(appUserRepository.existsById(99999L)).thenReturn(false);

        // When & Then: Should throw
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validateCreate(dto));
        assertTrue(exception.getMessage().contains("does not exist"));
    }

    @Test
    void testValidateUserIdNull() {
        // Given: User with null ID
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now);

        AppUserDTO appUserDTO = new AppUserDTO();
        appUserDTO.setId(null);
        dto.setAppUser(appUserDTO);

        // When & Then: Should throw
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validateCreate(dto));
        assertTrue(exception.getMessage().contains("User ID is required"));
    }

    @Test
    void testValidateEndAtInFuture() {
        // Given: endAt in the future
        Instant now = Instant.now();
        Instant future = now.plus(1, ChronoUnit.HOURS);
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), future);

        // When & Then
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validateCreate(dto));
        assertTrue(exception.getMessage().contains("End time cannot be in the future"));
    }

    @Test
    void testValidateWithClockSkew() {
        // Given: Session with startAt 30 seconds in future (within tolerance)
        Instant almostFuture = Instant.now().plusSeconds(30);
        StudySessionDTO dto = createValidSession(almostFuture, almostFuture.plus(1, ChronoUnit.HOURS));

        // When & Then: Should throw because endAt is too far in future
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validateCreate(dto));
        assertTrue(exception.getMessage().contains("cannot be in the future"));
    }

    @Test
    void testValidateExceedsClockSkewTolerance() {
        // Given: Session with startAt 120 seconds in future (exceeds tolerance)
        Instant future = Instant.now().plusSeconds(120);
        StudySessionDTO dto = createValidSession(future, future.plus(1, ChronoUnit.HOURS));

        // When & Then: Should throw
        BadRequestAlertException exception = assertThrows(BadRequestAlertException.class, () -> validator.validateCreate(dto));
        assertTrue(exception.getMessage().contains("cannot be in the future"));
    }

    @Test
    void testValidateExactly24Hours() {
        // Given: Session exactly 24 hours (boundary)
        Instant start = Instant.now().minus(24, ChronoUnit.HOURS);
        Instant end = Instant.now();
        StudySessionDTO dto = createValidSession(start, end);

        // When & Then: Should be valid
        assertDoesNotThrow(() -> validator.validateCreate(dto));
    }

    @Test
    void testValidateOneMinuteSession() {
        // Given: Session of exactly 1 minute (minimum)
        Instant start = Instant.now().minus(1, ChronoUnit.MINUTES);
        Instant end = Instant.now();
        StudySessionDTO dto = createValidSession(start, end);
        dto.setDurationMinutes(1);

        // When & Then: Should be valid
        assertDoesNotThrow(() -> validator.validateCreate(dto));
    }

    @Test
    void testDeprecatedValidateMethod() {
        // Given
        Instant now = Instant.now();
        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now);

        // When & Then: Should still work (backward compatibility)
        assertDoesNotThrow(() -> validator.validate(dto));
    }

    private StudySessionDTO createValidSession(Instant startAt, Instant endAt) {
        StudySessionDTO dto = new StudySessionDTO();
        dto.setStartAt(startAt);
        dto.setEndAt(endAt);

        AppUserDTO appUserDTO = new AppUserDTO();
        appUserDTO.setId(1L);
        dto.setAppUser(appUserDTO);

        return dto;
    }
}
