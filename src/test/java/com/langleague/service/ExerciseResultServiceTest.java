package com.langleague.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.langleague.domain.AppUser;
import com.langleague.domain.ExerciseResult;
import com.langleague.domain.enumeration.ExerciseType;
import com.langleague.repository.ExerciseResultRepository;
import com.langleague.service.dto.ExerciseResultDTO;
import com.langleague.service.mapper.ExerciseResultMapper;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * Unit tests for {@link ExerciseResultService}.
 */
@ExtendWith(MockitoExtension.class)
class ExerciseResultServiceTest {

    @Mock
    private ExerciseResultRepository exerciseResultRepository;

    @Mock
    private ExerciseResultMapper exerciseResultMapper;

    @InjectMocks
    private ExerciseResultService exerciseResultService;

    private ExerciseResult exerciseResult;
    private ExerciseResultDTO exerciseResultDTO;
    private AppUser appUser;

    @BeforeEach
    void setUp() {
        // Setup test data
        appUser = new AppUser();
        appUser.setId(1L);

        exerciseResult = new ExerciseResult();
        exerciseResult.setId(1L);
        exerciseResult.setExerciseType(ExerciseType.LISTENING);
        exerciseResult.setScore(85);
        exerciseResult.setUserAnswer("User's answer text");
        exerciseResult.setSubmittedAt(Instant.now());
        exerciseResult.setAppUser(appUser);

        exerciseResultDTO = new ExerciseResultDTO();
        exerciseResultDTO.setId(1L);
        exerciseResultDTO.setExerciseType(ExerciseType.LISTENING);
        exerciseResultDTO.setScore(85);
        exerciseResultDTO.setUserAnswer("User's answer text");
        exerciseResultDTO.setSubmittedAt(Instant.now());
    }

    @Test
    void testSaveExerciseResult() {
        // Given
        when(exerciseResultMapper.toEntity(exerciseResultDTO)).thenReturn(exerciseResult);
        when(exerciseResultRepository.save(exerciseResult)).thenReturn(exerciseResult);
        when(exerciseResultMapper.toDto(exerciseResult)).thenReturn(exerciseResultDTO);

        // When
        ExerciseResultDTO savedResult = exerciseResultService.save(exerciseResultDTO);

        // Then
        assertThat(savedResult).isNotNull();
        assertThat(savedResult.getId()).isEqualTo(1L);
        assertThat(savedResult.getScore()).isEqualTo(85);
        assertThat(savedResult.getUserAnswer()).isEqualTo("User's answer text");
        verify(exerciseResultRepository, times(1)).save(exerciseResult);
    }

    @Test
    void testUpdateExerciseResult() {
        // Given
        exerciseResultDTO.setScore(90);

        when(exerciseResultMapper.toEntity(exerciseResultDTO)).thenReturn(exerciseResult);
        when(exerciseResultRepository.save(exerciseResult)).thenReturn(exerciseResult);
        when(exerciseResultMapper.toDto(exerciseResult)).thenReturn(exerciseResultDTO);

        // When
        ExerciseResultDTO updatedResult = exerciseResultService.update(exerciseResultDTO);

        // Then
        assertThat(updatedResult).isNotNull();
        assertThat(updatedResult.getId()).isEqualTo(1L);
        verify(exerciseResultRepository, times(1)).save(exerciseResult);
    }

    @Test
    void testPartialUpdateExerciseResult() {
        // Given
        ExerciseResultDTO partialDTO = new ExerciseResultDTO();
        partialDTO.setId(1L);
        partialDTO.setScore(95);

        when(exerciseResultRepository.findById(1L)).thenReturn(Optional.of(exerciseResult));
        when(exerciseResultRepository.save(exerciseResult)).thenReturn(exerciseResult);
        when(exerciseResultMapper.toDto(exerciseResult)).thenReturn(exerciseResultDTO);

        // When
        Optional<ExerciseResultDTO> result = exerciseResultService.partialUpdate(partialDTO);

        // Then
        assertThat(result).isPresent();
        verify(exerciseResultRepository, times(1)).findById(1L);
        verify(exerciseResultMapper, times(1)).partialUpdate(exerciseResult, partialDTO);
        verify(exerciseResultRepository, times(1)).save(exerciseResult);
    }

    @Test
    void testFindAllExerciseResults() {
        // Given
        List<ExerciseResult> results = List.of(exerciseResult);
        Page<ExerciseResult> resultPage = new PageImpl<>(results);
        Pageable pageable = PageRequest.of(0, 10);

        when(exerciseResultRepository.findAll(pageable)).thenReturn(resultPage);
        when(exerciseResultMapper.toDto(exerciseResult)).thenReturn(exerciseResultDTO);

        // When
        Page<ExerciseResultDTO> resultDTOS = exerciseResultService.findAll(pageable);

        // Then
        assertThat(resultDTOS).isNotNull();
        assertThat(resultDTOS.getContent()).hasSize(1);
        assertThat(resultDTOS.getContent().getFirst().getScore()).isEqualTo(85);
        verify(exerciseResultRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindOneExerciseResult() {
        // Given
        when(exerciseResultRepository.findById(1L)).thenReturn(Optional.of(exerciseResult));
        when(exerciseResultMapper.toDto(exerciseResult)).thenReturn(exerciseResultDTO);

        // When
        Optional<ExerciseResultDTO> result = exerciseResultService.findOne(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.orElseThrow().getId()).isEqualTo(1L);
        assertThat(result.orElseThrow().getScore()).isEqualTo(85);
        verify(exerciseResultRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteExerciseResult() {
        // Given
        Long resultId = 1L;

        // When
        exerciseResultService.delete(resultId);

        // Then
        verify(exerciseResultRepository, times(1)).deleteById(resultId);
    }

    @Test
    void testCalculateScorePercentage() {
        // Given
        int correctAnswers = 8;
        int totalQuestions = 10;

        // When
        int score = (correctAnswers * 100) / totalQuestions;

        // Then
        assertThat(score).isEqualTo(80);
    }

    @Test
    void testCalculateAverageScore() {
        // Given - Multiple exercise results
        ExerciseResult result1 = new ExerciseResult();
        result1.setScore(80);
        ExerciseResult result2 = new ExerciseResult();
        result2.setScore(90);
        ExerciseResult result3 = new ExerciseResult();
        result3.setScore(70);

        List<ExerciseResult> results = List.of(result1, result2, result3);

        // When
        double averageScore = results.stream().mapToInt(ExerciseResult::getScore).average().orElse(0.0);

        // Then
        assertThat(averageScore).isEqualTo(80.0);
    }

    @Test
    void testIsPassingScore() {
        // Given
        int passingThreshold = 70;

        // When
        boolean isPassing = exerciseResult.getScore() >= passingThreshold;

        // Then
        assertThat(isPassing).isTrue();
    }

    @Test
    void testIsFailingScore() {
        // Given
        exerciseResult.setScore(50);
        int passingThreshold = 70;

        // When
        boolean isPassing = exerciseResult.getScore() >= passingThreshold;

        // Then
        assertThat(isPassing).isFalse();
    }

    @Test
    void testPerfectScore() {
        // Given
        exerciseResult.setScore(100);

        // When
        boolean isPerfect = exerciseResult.getScore() == 100;

        // Then
        assertThat(isPerfect).isTrue();
    }
}
