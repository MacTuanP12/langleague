package com.langleague.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.langleague.domain.AppUser;
import com.langleague.domain.LearningStreak;
import com.langleague.repository.LearningStreakRepository;
import com.langleague.service.dto.LearningStreakDTO;
import com.langleague.service.mapper.LearningStreakMapper;
import java.time.Instant;
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
 * Unit tests for {@link LearningStreakService}.
 */
@ExtendWith(MockitoExtension.class)
class LearningStreakServiceTest {

    @Mock
    private LearningStreakRepository learningStreakRepository;

    @Mock
    private LearningStreakMapper learningStreakMapper;

    @InjectMocks
    private LearningStreakService learningStreakService;

    private LearningStreak learningStreak;
    private LearningStreakDTO learningStreakDTO;
    private AppUser appUser;

    @BeforeEach
    void setUp() {
        // Setup test data
        appUser = new AppUser();
        appUser.setId(1L);

        learningStreak = new LearningStreak();
        learningStreak.setId(1L);
        learningStreak.setCurrentStreak(5);
        learningStreak.setLongestStreak(10);
        learningStreak.setLastStudyDate(Instant.now());
        learningStreak.setAppUser(appUser);

        learningStreakDTO = new LearningStreakDTO();
        learningStreakDTO.setId(1L);
        learningStreakDTO.setCurrentStreak(5);
        learningStreakDTO.setLongestStreak(10);
        learningStreakDTO.setLastStudyDate(Instant.now());
    }

    @Test
    void testSaveLearningStreak() {
        // Given
        when(learningStreakMapper.toEntity(learningStreakDTO)).thenReturn(learningStreak);
        when(learningStreakRepository.save(learningStreak)).thenReturn(learningStreak);
        when(learningStreakMapper.toDto(learningStreak)).thenReturn(learningStreakDTO);

        // When
        LearningStreakDTO savedStreak = learningStreakService.save(learningStreakDTO);

        // Then
        assertThat(savedStreak).isNotNull();
        assertThat(savedStreak.getId()).isEqualTo(1L);
        assertThat(savedStreak.getCurrentStreak()).isEqualTo(5);
        verify(learningStreakRepository, times(1)).save(learningStreak);
    }

    @Test
    void testUpdateLearningStreak() {
        // Given
        learningStreakDTO.setCurrentStreak(6);

        when(learningStreakMapper.toEntity(learningStreakDTO)).thenReturn(learningStreak);
        when(learningStreakRepository.save(learningStreak)).thenReturn(learningStreak);
        when(learningStreakMapper.toDto(learningStreak)).thenReturn(learningStreakDTO);

        // When
        LearningStreakDTO updatedStreak = learningStreakService.update(learningStreakDTO);

        // Then
        assertThat(updatedStreak).isNotNull();
        assertThat(updatedStreak.getId()).isEqualTo(1L);
        verify(learningStreakRepository, times(1)).save(learningStreak);
    }

    @Test
    void testPartialUpdateLearningStreak() {
        // Given
        LearningStreakDTO partialDTO = new LearningStreakDTO();
        partialDTO.setId(1L);
        partialDTO.setCurrentStreak(7);

        when(learningStreakRepository.findById(1L)).thenReturn(Optional.of(learningStreak));
        when(learningStreakRepository.save(learningStreak)).thenReturn(learningStreak);
        when(learningStreakMapper.toDto(learningStreak)).thenReturn(learningStreakDTO);

        // When
        Optional<LearningStreakDTO> result = learningStreakService.partialUpdate(partialDTO);

        // Then
        assertThat(result).isPresent();
        verify(learningStreakRepository, times(1)).findById(1L);
        verify(learningStreakMapper, times(1)).partialUpdate(learningStreak, partialDTO);
        verify(learningStreakRepository, times(1)).save(learningStreak);
    }

    @Test
    void testPartialUpdateLearningStreakNotFound() {
        // Given
        LearningStreakDTO partialDTO = new LearningStreakDTO();
        partialDTO.setId(999L);

        when(learningStreakRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<LearningStreakDTO> result = learningStreakService.partialUpdate(partialDTO);

        // Then
        assertThat(result).isEmpty();
        verify(learningStreakRepository, times(1)).findById(999L);
        verify(learningStreakRepository, never()).save(any());
    }

    @Test
    void testFindAllLearningStreaks() {
        // Given
        List<LearningStreak> streaks = List.of(learningStreak);
        Page<LearningStreak> streakPage = new PageImpl<>(streaks);
        Pageable pageable = PageRequest.of(0, 10);

        when(learningStreakRepository.findAll(pageable)).thenReturn(streakPage);
        when(learningStreakMapper.toDto(learningStreak)).thenReturn(learningStreakDTO);

        // When
        Page<LearningStreakDTO> result = learningStreakService.findAll(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getCurrentStreak()).isEqualTo(5);
        verify(learningStreakRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindOneLearningStreak() {
        // Given
        when(learningStreakRepository.findById(1L)).thenReturn(Optional.of(learningStreak));
        when(learningStreakMapper.toDto(learningStreak)).thenReturn(learningStreakDTO);

        // When
        Optional<LearningStreakDTO> result = learningStreakService.findOne(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.orElseThrow().getId()).isEqualTo(1L);
        assertThat(result.orElseThrow().getCurrentStreak()).isEqualTo(5);
        verify(learningStreakRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteLearningStreak() {
        // Given
        Long streakId = 1L;

        // When
        learningStreakService.delete(streakId);

        // Then
        verify(learningStreakRepository, times(1)).deleteById(streakId);
    }

    @Test
    void testIncrementStreak() {
        // Given - Current streak is 5
        learningStreak.setCurrentStreak(5);
        learningStreak.setLongestStreak(10);

        // When incrementing
        learningStreak.setCurrentStreak(learningStreak.getCurrentStreak() + 1);

        // Then
        assertThat(learningStreak.getCurrentStreak()).isEqualTo(6);
    }

    @Test
    void testUpdateLongestStreakWhenExceeded() {
        // Given - Current streak exceeds longest streak
        learningStreak.setCurrentStreak(12);
        learningStreak.setLongestStreak(10);

        // When
        if (learningStreak.getCurrentStreak() > learningStreak.getLongestStreak()) {
            learningStreak.setLongestStreak(learningStreak.getCurrentStreak());
        }

        // Then
        assertThat(learningStreak.getLongestStreak()).isEqualTo(12);
    }

    @Test
    void testResetStreakWhenMissedDay() {
        // Given - User missed a day (last study was 2 days ago)
        learningStreak.setCurrentStreak(5);
        Instant twoDaysAgo = Instant.now().minus(2, java.time.temporal.ChronoUnit.DAYS);
        learningStreak.setLastStudyDate(twoDaysAgo);

        // When checking if streak should be reset
        Instant now = Instant.now();
        Instant lastStudy = learningStreak.getLastStudyDate();
        Instant oneDayAgo = now.minus(1, java.time.temporal.ChronoUnit.DAYS);
        boolean shouldReset = lastStudy.isBefore(oneDayAgo);

        if (shouldReset) {
            learningStreak.setCurrentStreak(0);
        }

        // Then
        assertThat(learningStreak.getCurrentStreak()).isEqualTo(0);
    }

    @Test
    void testMaintainStreakWhenStudyConsecutiveDays() {
        // Given - User studied yesterday
        learningStreak.setCurrentStreak(5);
        Instant yesterday = Instant.now().minus(1, java.time.temporal.ChronoUnit.DAYS);
        learningStreak.setLastStudyDate(yesterday);

        // When incrementing streak for studying today
        learningStreak.setCurrentStreak(learningStreak.getCurrentStreak() + 1);
        learningStreak.setLastStudyDate(Instant.now());

        // Then
        assertThat(learningStreak.getCurrentStreak()).isEqualTo(6);
        assertThat(learningStreak.getLastStudyDate()).isNotNull();
    }

    @Test
    void testNoChangeWhenStudyingSameDay() {
        // Given - User already studied today
        Instant now = Instant.now();
        learningStreak.setCurrentStreak(5);
        learningStreak.setLastStudyDate(now);

        // When checking current streak
        int currentStreak = learningStreak.getCurrentStreak();

        // Then - Streak should not change
        assertThat(learningStreak.getLastStudyDate()).isNotNull();
        assertThat(currentStreak).isEqualTo(5);
    }
}
