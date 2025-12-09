package com.langleague.service.validator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.langleague.repository.AppUserRepository;
import com.langleague.service.dto.AppUserDTO;
import com.langleague.service.dto.StudySessionDTO;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Performance tests for StudySessionValidator.
 */
@ExtendWith(MockitoExtension.class)
class StudySessionValidatorPerformanceTest {

    @Mock
    private AppUserRepository appUserRepository;

    private StudySessionValidator validator;

    @BeforeEach
    void setUp() {
        validator = new StudySessionValidator(appUserRepository);

        // Mock user existence
        when(appUserRepository.existsById(anyLong())).thenReturn(true);
    }

    @Test
    void testConcurrentValidation() throws InterruptedException, ExecutionException {
        int numberOfThreads = 100;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);

        List<Future<Boolean>> futures = new ArrayList<>();

        for (int i = 0; i < numberOfThreads; i++) {
            final long userId = i + 1;
            futures.add(
                executor.submit(() -> {
                    try {
                        Instant now = Instant.now();
                        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now, userId);
                        validator.validateCreate(dto);
                        return true;
                    } catch (Exception e) {
                        e.printStackTrace();
                        return false;
                    }
                })
            );
        }

        executor.shutdown();
        boolean terminated = executor.awaitTermination(10, TimeUnit.SECONDS);

        assertTrue(terminated, "Executor should finish within timeout");

        // Verify all validations succeeded
        for (Future<Boolean> future : futures) {
            assertTrue(future.get(), "Validation should succeed");
        }
    }

    @Test
    void testValidationPerformance() {
        int iterations = 10000;

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < iterations; i++) {
            Instant now = Instant.now();
            StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now, 1L);
            validator.validateCreate(dto);
        }

        long duration = System.currentTimeMillis() - startTime;

        System.out.println(
            String.format("Validated %d sessions in %dms (%.2f ops/sec)", iterations, duration, ((iterations * 1000.0) / duration))
        );

        // Assert performance: should complete in under 2 seconds
        assertTrue(duration < 2000, String.format("Validation took %dms for %d iterations, expected < 2000ms", duration, iterations));
    }

    @Test
    void testConcurrentCreateAndUpdateValidation() throws InterruptedException, ExecutionException {
        int numberOfThreads = 50;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);

        List<Future<Boolean>> futures = new ArrayList<>();

        for (int i = 0; i < numberOfThreads; i++) {
            final long userId = i + 1;
            final boolean isCreate = i % 2 == 0;

            futures.add(
                executor.submit(() -> {
                    try {
                        Instant now = Instant.now();
                        StudySessionDTO dto = createValidSession(now.minus(1, ChronoUnit.HOURS), now, userId);

                        if (isCreate) {
                            validator.validateCreate(dto);
                        } else {
                            // UPDATE with old session
                            dto.setStartAt(now.minus(40, ChronoUnit.DAYS));
                            dto.setEndAt(now.minus(40, ChronoUnit.DAYS).plus(1, ChronoUnit.HOURS));
                            validator.validateUpdate(dto);
                        }
                        return true;
                    } catch (Exception e) {
                        e.printStackTrace();
                        return false;
                    }
                })
            );
        }

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        // Verify all validations succeeded
        for (Future<Boolean> future : futures) {
            assertTrue(future.get(), "Validation should succeed");
        }
    }

    @Test
    void testDurationCalculationPerformance() {
        int iterations = 100000;

        Instant start = Instant.parse("2025-11-29T10:00:00Z");
        Instant end = Instant.parse("2025-11-29T11:30:00Z");

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < iterations; i++) {
            validator.calculateDurationMinutes(start, end);
        }

        long duration = System.currentTimeMillis() - startTime;

        System.out.println(
            String.format("Calculated duration %d times in %dms (%.2f ops/sec)", iterations, duration, ((iterations * 1000.0) / duration))
        );

        // Should be very fast
        assertTrue(
            duration < 500,
            String.format("Duration calculation took %dms for %d iterations, expected < 500ms", duration, iterations)
        );
    }

    private StudySessionDTO createValidSession(Instant startAt, Instant endAt, Long userId) {
        StudySessionDTO dto = new StudySessionDTO();
        dto.setStartAt(startAt);
        dto.setEndAt(endAt);

        AppUserDTO appUserDTO = new AppUserDTO();
        appUserDTO.setId(userId);
        dto.setAppUser(appUserDTO);

        return dto;
    }
}
