package com.langleague.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.langleague.domain.AppUser;
import com.langleague.domain.StudySession;
import com.langleague.domain.User;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.StudySessionRepository;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.StudySessionDTO;
import com.langleague.service.mapper.StudySessionMapper;
import com.langleague.service.validator.StudySessionValidator;
import com.langleague.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Test class for StudySessionService - Focus on overlap detection
 */
@ExtendWith(MockitoExtension.class)
class StudySessionOverlapDetectionTest {

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private StudySessionMapper studySessionMapper;

    @Mock
    private StudySessionValidator studySessionValidator;

    @Mock
    private AppUserRepository appUserRepository;

    private StudySessionService studySessionService;

    private AppUser testAppUser;
    private User testUser;
    private static final Long TEST_USER_ID = 1L;
    private static final Long TEST_APP_USER_ID = 100L;

    @BeforeEach
    void setUp() {
        studySessionService = new StudySessionService(studySessionRepository, studySessionMapper, studySessionValidator, appUserRepository);

        // Setup test user
        testUser = new User();
        testUser.setId(TEST_USER_ID);
        testUser.setLogin("testuser");

        testAppUser = new AppUser();
        testAppUser.setId(TEST_APP_USER_ID);
        testAppUser.setInternalUser(testUser);

        // Mock security context
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("testuser", "password"));
    }

    /**
     * Test Case 1: No overlap - Sessions completely separate
     * Session 1: 10:00 - 11:00
     * Session 2: 12:00 - 13:00
     * Expected: No overlap, save succeeds
     */
    @Test
    void testNoOverlap_SessionsCompletelySeparate() {
        // Given
        Instant start1 = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant end1 = start1.plus(1, ChronoUnit.HOURS);

        Instant start2 = start1.plus(2, ChronoUnit.HOURS);
        Instant end2 = start2.plus(1, ChronoUnit.HOURS);

        StudySessionDTO newSessionDTO = createSessionDTO(start2, end2);

        // Mock: No overlapping sessions found
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            new ArrayList<>()
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(60);

        StudySession savedSession = createSession(1L, start2, end2);
        when(studySessionMapper.toEntity(any(StudySessionDTO.class))).thenReturn(savedSession);
        when(studySessionRepository.save(any(StudySession.class))).thenReturn(savedSession);
        when(studySessionMapper.toDto(any(StudySession.class))).thenReturn(newSessionDTO);

        // When
        StudySessionDTO result = studySessionService.save(newSessionDTO);

        // Then
        assertThat(result).isNotNull();
        verify(studySessionRepository).save(any(StudySession.class));
    }

    /**
     * Test Case 2: Overlap - New session starts during existing session
     * Existing: 10:00 - 11:00
     * New:      10:30 - 11:30
     * Expected: Overlap detected, throws exception
     */
    @Test
    void testOverlap_NewSessionStartsDuringExisting() {
        // Given
        Instant existingStart = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant existingEnd = existingStart.plus(1, ChronoUnit.HOURS);

        Instant newStart = existingStart.plus(30, ChronoUnit.MINUTES);
        Instant newEnd = existingEnd.plus(30, ChronoUnit.MINUTES);

        StudySessionDTO newSessionDTO = createSessionDTO(newStart, newEnd);

        // Mock: Overlapping session found
        StudySession existingSession = createSession(1L, existingStart, existingEnd);
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            List.of(existingSession)
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(60);

        // When & Then
        assertThatThrownBy(() -> studySessionService.save(newSessionDTO))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("sessionoverlap");
    }

    /**
     * Test Case 3: Overlap - Existing session starts during new session
     * Existing: 10:30 - 11:30
     * New:      10:00 - 11:00
     * Expected: Overlap detected, throws exception
     */
    @Test
    void testOverlap_ExistingSessionStartsDuringNew() {
        // Given
        Instant newStart = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant newEnd = newStart.plus(1, ChronoUnit.HOURS);

        Instant existingStart = newStart.plus(30, ChronoUnit.MINUTES);
        Instant existingEnd = newEnd.plus(30, ChronoUnit.MINUTES);

        StudySessionDTO newSessionDTO = createSessionDTO(newStart, newEnd);

        // Mock: Overlapping session found
        StudySession existingSession = createSession(1L, existingStart, existingEnd);
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            List.of(existingSession)
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(60);

        // When & Then
        assertThatThrownBy(() -> studySessionService.save(newSessionDTO))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("sessionoverlap");
    }

    /**
     * Test Case 4: Overlap - New session completely covers existing
     * Existing: 10:30 - 11:30
     * New:      10:00 - 12:00
     * Expected: Overlap detected, throws exception
     */
    @Test
    void testOverlap_NewSessionCoversExisting() {
        // Given
        Instant existingStart = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES);
        Instant existingEnd = existingStart.plus(1, ChronoUnit.HOURS);

        Instant newStart = existingStart.minus(30, ChronoUnit.MINUTES);
        Instant newEnd = existingEnd.plus(30, ChronoUnit.MINUTES);

        StudySessionDTO newSessionDTO = createSessionDTO(newStart, newEnd);

        // Mock: Overlapping session found
        StudySession existingSession = createSession(1L, existingStart, existingEnd);
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            List.of(existingSession)
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(90);

        // When & Then
        assertThatThrownBy(() -> studySessionService.save(newSessionDTO))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("sessionoverlap");
    }

    /**
     * Test Case 5: Overlap - Existing session completely covers new
     * Existing: 10:00 - 12:00
     * New:      10:30 - 11:30
     * Expected: Overlap detected, throws exception
     */
    @Test
    void testOverlap_ExistingSessionCoversNew() {
        // Given
        Instant newStart = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES);
        Instant newEnd = newStart.plus(1, ChronoUnit.HOURS);

        Instant existingStart = newStart.minus(30, ChronoUnit.MINUTES);
        Instant existingEnd = newEnd.plus(30, ChronoUnit.MINUTES);

        StudySessionDTO newSessionDTO = createSessionDTO(newStart, newEnd);

        // Mock: Overlapping session found
        StudySession existingSession = createSession(1L, existingStart, existingEnd);
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            List.of(existingSession)
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(60);

        // When & Then
        assertThatThrownBy(() -> studySessionService.save(newSessionDTO))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("sessionoverlap");
    }

    /**
     * Test Case 6: Edge case - Sessions touch at boundaries (no overlap)
     * Session 1: 10:00 - 11:00
     * Session 2: 11:00 - 12:00
     * Expected: No overlap (end of S1 == start of S2), save succeeds
     */
    @Test
    void testNoOverlap_SessionsTouchAtBoundaries() {
        // Given
        Instant start1 = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant end1 = start1.plus(1, ChronoUnit.HOURS);

        Instant start2 = end1; // Touch at boundary
        Instant end2 = start2.plus(1, ChronoUnit.HOURS);

        StudySessionDTO newSessionDTO = createSessionDTO(start2, end2);

        // Mock: No overlapping sessions (query should not return sessions that just touch)
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            new ArrayList<>()
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(60);

        StudySession savedSession = createSession(2L, start2, end2);
        when(studySessionMapper.toEntity(any(StudySessionDTO.class))).thenReturn(savedSession);
        when(studySessionRepository.save(any(StudySession.class))).thenReturn(savedSession);
        when(studySessionMapper.toDto(any(StudySession.class))).thenReturn(newSessionDTO);

        // When
        StudySessionDTO result = studySessionService.save(newSessionDTO);

        // Then
        assertThat(result).isNotNull();
        verify(studySessionRepository).save(any(StudySession.class));
    }

    /**
     * Test Case 7: Edge case - Zero duration session (startAt == endAt)
     * Session: 10:00 - 10:00 (0 minutes)
     * Expected: Validation error (MIN_SESSION_MINUTES = 1)
     */
    @Test
    void testEdgeCase_ZeroDurationSession() {
        // Given
        Instant start = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant end = start; // Same time = 0 duration

        StudySessionDTO newSessionDTO = createSessionDTO(start, end);

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(start, end)).thenReturn(0);

        // Mock validator to throw error for duration < 1
        doThrow(new BadRequestAlertException("Session duration must be at least 1 minute(s)", "studySession", "durationtooshort"))
            .when(studySessionValidator)
            .validate(any());

        // When & Then
        assertThatThrownBy(() -> studySessionService.save(newSessionDTO))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("durationtooshort");

        verify(studySessionValidator).validate(any());
    }

    /**
     * Test Case 8: Edge case - Sessions touch at boundaries (no overlap)
     * Session 1: 10:00 - 11:00
     * Session 2: 11:00 - 12:00
     * Expected: No overlap (strict inequality: start < end AND end > start)
     * Note: At boundary (11:00), Session1.end == Session2.start, so:
     *       Session2.start (11:00) is NOT < Session1.end (11:00) → No overlap ✓
     */
    @Test
    void testEdgeCase_SessionsTouchAtBoundaries_Allowed() {
        // Given
        Instant start1 = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant end1 = start1.plus(1, ChronoUnit.HOURS);

        Instant start2 = end1; // Touch at boundary: Session1.end == Session2.start
        Instant end2 = start2.plus(1, ChronoUnit.HOURS);

        StudySessionDTO newSessionDTO = createSessionDTO(start2, end2);

        // Mock: No overlapping sessions
        // Query: s.startAt < :endAt AND s.endAt > :startAt
        // For Session1 vs Session2:
        //   Session1.startAt (10:00) < Session2.endAt (12:00) ✓
        //   Session1.endAt (11:00) > Session2.startAt (11:00) ✗ (11:00 is NOT > 11:00)
        // Result: No overlap
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            new ArrayList<>()
        );

        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(60);

        StudySession savedSession = createSession(2L, start2, end2);
        when(studySessionMapper.toEntity(any(StudySessionDTO.class))).thenReturn(savedSession);
        when(studySessionRepository.save(any(StudySession.class))).thenReturn(savedSession);
        when(studySessionMapper.toDto(any(StudySession.class))).thenReturn(newSessionDTO);

        // When
        StudySessionDTO result = studySessionService.save(newSessionDTO);

        // Then
        assertThat(result).isNotNull();
        verify(studySessionRepository).save(any(StudySession.class));
    }

    /**
     * Test Case 9: Update session
     * Test Case 9: Update session - Should exclude itself from overlap check
     * Existing: Session ID=1, 10:00 - 11:00
     * Update:   Session ID=1, 10:00 - 11:30 (extend by 30 min)
     * Expected: No overlap (ignores itself), update succeeds
     */
    @Test
    void testNoOverlap_UpdateSession_ExcludesSelf() {
        // Given
        Long sessionId = 1L;
        Instant start = Instant.now().truncatedTo(ChronoUnit.HOURS);
        Instant originalEnd = start.plus(1, ChronoUnit.HOURS);
        Instant newEnd = start.plus(90, ChronoUnit.MINUTES);

        StudySessionDTO updateDTO = createSessionDTO(sessionId, start, newEnd);
        StudySession existingSession = createSession(sessionId, start, originalEnd);

        // Mock: findOverlappingSessions returns the session itself
        when(studySessionRepository.findOverlappingSessions(eq(TEST_USER_ID), any(Instant.class), any(Instant.class))).thenReturn(
            List.of(existingSession)
        );

        when(studySessionRepository.findById(sessionId)).thenReturn(Optional.of(existingSession));
        when(appUserRepository.findByInternalUserId(TEST_USER_ID)).thenReturn(Optional.of(testAppUser));
        when(studySessionValidator.calculateDurationMinutes(any(), any())).thenReturn(90);

        StudySession updatedSession = createSession(sessionId, start, newEnd);
        when(studySessionMapper.toEntity(any(StudySessionDTO.class))).thenReturn(updatedSession);
        when(studySessionRepository.save(any(StudySession.class))).thenReturn(updatedSession);
        when(studySessionMapper.toDto(any(StudySession.class))).thenReturn(updateDTO);

        // When
        StudySessionDTO result = studySessionService.update(updateDTO);

        // Then
        assertThat(result).isNotNull();
        verify(studySessionRepository).save(any(StudySession.class));
    }

    // Helper methods

    private StudySessionDTO createSessionDTO(Instant startAt, Instant endAt) {
        return createSessionDTO(null, startAt, endAt);
    }

    private StudySessionDTO createSessionDTO(Long id, Instant startAt, Instant endAt) {
        StudySessionDTO dto = new StudySessionDTO();
        dto.setId(id);
        dto.setStartAt(startAt);
        dto.setEndAt(endAt);

        AppUserDTO appUserDTO = new AppUserDTO();
        appUserDTO.setId(TEST_APP_USER_ID);
        dto.setAppUser(appUserDTO);

        return dto;
    }

    private StudySession createSession(Long id, Instant startAt, Instant endAt) {
        StudySession session = new StudySession();
        session.setId(id);
        session.setStartAt(startAt);
        session.setEndAt(endAt);
        session.setDurationMinutes(60);
        session.setAppUser(testAppUser);
        return session;
    }
}
