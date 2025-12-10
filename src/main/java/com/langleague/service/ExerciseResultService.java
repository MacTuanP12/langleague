package com.langleague.service;

import com.langleague.domain.*;
import com.langleague.domain.enumeration.ExerciseType;
import com.langleague.repository.*;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.ChapterStatisticsDTO;
import com.langleague.service.dto.ExerciseResultDTO;
import com.langleague.service.dto.ExerciseStatisticsDTO;
import com.langleague.service.dto.SubmitExerciseDTO;
import com.langleague.service.event.ExerciseCompletedEvent;
import com.langleague.service.mapper.ExerciseResultMapper;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.ExerciseResult}.
 */
@Service
@Transactional
public class ExerciseResultService {

    private static final Logger LOG = LoggerFactory.getLogger(ExerciseResultService.class);

    private final ExerciseResultRepository exerciseResultRepository;

    private final ExerciseResultMapper exerciseResultMapper;

    private final AppUserRepository appUserRepository;

    private final ListeningExerciseRepository listeningExerciseRepository;

    private final SpeakingExerciseRepository speakingExerciseRepository;

    private final ReadingExerciseRepository readingExerciseRepository;

    private final WritingExerciseRepository writingExerciseRepository;

    private final ApplicationEventPublisher eventPublisher;

    public ExerciseResultService(
        ExerciseResultRepository exerciseResultRepository,
        ExerciseResultMapper exerciseResultMapper,
        AppUserRepository appUserRepository,
        ListeningExerciseRepository listeningExerciseRepository,
        SpeakingExerciseRepository speakingExerciseRepository,
        ReadingExerciseRepository readingExerciseRepository,
        WritingExerciseRepository writingExerciseRepository,
        ApplicationEventPublisher eventPublisher
    ) {
        this.exerciseResultRepository = exerciseResultRepository;
        this.exerciseResultMapper = exerciseResultMapper;
        this.appUserRepository = appUserRepository;
        this.listeningExerciseRepository = listeningExerciseRepository;
        this.speakingExerciseRepository = speakingExerciseRepository;
        this.readingExerciseRepository = readingExerciseRepository;
        this.writingExerciseRepository = writingExerciseRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Save a exerciseResult.
     *
     * @param exerciseResultDTO the entity to save.
     * @return the persisted entity.
     */
    @Retryable(retryFor = { ObjectOptimisticLockingFailureException.class }, maxAttempts = 3, backoff = @Backoff(delay = 100))
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ExerciseResultDTO save(ExerciseResultDTO exerciseResultDTO) {
        LOG.debug("Request to save ExerciseResult : {}", exerciseResultDTO);
        ExerciseResult exerciseResult = exerciseResultMapper.toEntity(exerciseResultDTO);
        exerciseResult = exerciseResultRepository.save(exerciseResult);

        // Publish event for async processing of achievements and book progress
        if (exerciseResult.getAppUser() != null && exerciseResult.getAppUser().getId() != null) {
            try {
                Long bookId = getBookIdFromExerciseResult(exerciseResult);
                ExerciseCompletedEvent event = new ExerciseCompletedEvent(
                    this,
                    exerciseResult.getAppUser().getId(),
                    exerciseResult.getId(),
                    exerciseResult.getExerciseType(),
                    exerciseResult.getScore(),
                    bookId
                );
                eventPublisher.publishEvent(event);
                LOG.debug("Published ExerciseCompletedEvent for user {}", exerciseResult.getAppUser().getId());
            } catch (Exception e) {
                LOG.error("Error publishing ExerciseCompletedEvent for user {}: {}", exerciseResult.getAppUser().getId(), e.getMessage());
            }
        }

        return exerciseResultMapper.toDto(exerciseResult);
    }

    /**
     * Update a exerciseResult.
     *
     * @param exerciseResultDTO the entity to save.
     * @return the persisted entity.
     */
    public ExerciseResultDTO update(ExerciseResultDTO exerciseResultDTO) {
        LOG.debug("Request to update ExerciseResult : {}", exerciseResultDTO);
        ExerciseResult exerciseResult = exerciseResultMapper.toEntity(exerciseResultDTO);
        exerciseResult = exerciseResultRepository.save(exerciseResult);
        return exerciseResultMapper.toDto(exerciseResult);
    }

    /**
     * Partially update a exerciseResult.
     *
     * @param exerciseResultDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ExerciseResultDTO> partialUpdate(ExerciseResultDTO exerciseResultDTO) {
        LOG.debug("Request to partially update ExerciseResult : {}", exerciseResultDTO);

        return exerciseResultRepository
            .findById(exerciseResultDTO.getId())
            .map(existingExerciseResult -> {
                exerciseResultMapper.partialUpdate(existingExerciseResult, exerciseResultDTO);

                return existingExerciseResult;
            })
            .map(exerciseResultRepository::save)
            .map(exerciseResultMapper::toDto);
    }

    /**
     * Get all the exerciseResults.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ExerciseResultDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ExerciseResults");
        return exerciseResultRepository.findAll(pageable).map(exerciseResultMapper::toDto);
    }

    /**
     * Get one exerciseResult by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ExerciseResultDTO> findOne(Long id) {
        LOG.debug("Request to get ExerciseResult : {}", id);
        return exerciseResultRepository.findById(id).map(exerciseResultMapper::toDto);
    }

    /**
     * Delete the exerciseResult by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ExerciseResult : {}", id);
        exerciseResultRepository.deleteById(id);
    }

    /**
     * Submit exercise result from frontend.
     *
     * @param submitExerciseDTO the submission data from frontend.
     * @return the persisted entity.
     */
    public ExerciseResultDTO submitExercise(SubmitExerciseDTO submitExerciseDTO) {
        LOG.debug("Request to submit exercise : {}", submitExerciseDTO);

        // Get current user
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        // Create exercise result
        ExerciseResult exerciseResult = new ExerciseResult();
        exerciseResult.setAppUser(appUser);
        exerciseResult.setExerciseType(submitExerciseDTO.getExerciseType());
        exerciseResult.setScore(submitExerciseDTO.getScore());
        exerciseResult.setUserAnswer(submitExerciseDTO.getUserAnswer());
        exerciseResult.setSubmittedAt(Instant.now());

        // Set exercise reference based on type
        switch (submitExerciseDTO.getExerciseType()) {
            case LISTENING:
                ListeningExercise listeningExercise = listeningExerciseRepository
                    .findById(submitExerciseDTO.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Listening exercise not found"));
                exerciseResult.setListeningExercise(listeningExercise);
                break;
            case SPEAKING:
                SpeakingExercise speakingExercise = speakingExerciseRepository
                    .findById(submitExerciseDTO.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Speaking exercise not found"));
                exerciseResult.setSpeakingExercise(speakingExercise);
                break;
            case READING:
                ReadingExercise readingExercise = readingExerciseRepository
                    .findById(submitExerciseDTO.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Reading exercise not found"));
                exerciseResult.setReadingExercise(readingExercise);
                break;
            case WRITING:
                WritingExercise writingExercise = writingExerciseRepository
                    .findById(submitExerciseDTO.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Writing exercise not found"));
                exerciseResult.setWritingExercise(writingExercise);
                break;
        }

        exerciseResult = exerciseResultRepository.save(exerciseResult);

        // Publish event for async processing of achievements, streaks, and book progress
        try {
            Long bookId = getBookIdFromExerciseResult(exerciseResult);
            ExerciseCompletedEvent event = new ExerciseCompletedEvent(
                this,
                appUser.getId(),
                exerciseResult.getId(),
                exerciseResult.getExerciseType(),
                exerciseResult.getScore(),
                bookId
            );
            eventPublisher.publishEvent(event);
            LOG.debug("Published ExerciseCompletedEvent for user {}", appUser.getId());
        } catch (Exception e) {
            LOG.error("Error publishing ExerciseCompletedEvent for user {}: {}", appUser.getId(), e.getMessage());
        }

        return exerciseResultMapper.toDto(exerciseResult);
    }

    /**
     * Get book ID from exercise result based on exercise type
     */
    private Long getBookIdFromExerciseResult(ExerciseResult exerciseResult) {
        switch (exerciseResult.getExerciseType()) {
            case LISTENING:
                return (
                        exerciseResult.getListeningExercise() != null &&
                        exerciseResult.getListeningExercise().getChapter() != null &&
                        exerciseResult.getListeningExercise().getChapter().getBook() != null
                    )
                    ? exerciseResult.getListeningExercise().getChapter().getBook().getId()
                    : null;
            case SPEAKING:
                return (
                        exerciseResult.getSpeakingExercise() != null &&
                        exerciseResult.getSpeakingExercise().getChapter() != null &&
                        exerciseResult.getSpeakingExercise().getChapter().getBook() != null
                    )
                    ? exerciseResult.getSpeakingExercise().getChapter().getBook().getId()
                    : null;
            case READING:
                return (
                        exerciseResult.getReadingExercise() != null &&
                        exerciseResult.getReadingExercise().getChapter() != null &&
                        exerciseResult.getReadingExercise().getChapter().getBook() != null
                    )
                    ? exerciseResult.getReadingExercise().getChapter().getBook().getId()
                    : null;
            case WRITING:
                return (
                        exerciseResult.getWritingExercise() != null &&
                        exerciseResult.getWritingExercise().getChapter() != null &&
                        exerciseResult.getWritingExercise().getChapter().getBook() != null
                    )
                    ? exerciseResult.getWritingExercise().getChapter().getBook().getId()
                    : null;
            default:
                return null;
        }
    }

    /**
     * Get all exercise results for current user.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseResultDTO> findByCurrentUser() {
        LOG.debug("Request to get exercise results for current user");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        return exerciseResultRepository
            .findByAppUserId(appUser.getId())
            .stream()
            .map(exerciseResultMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get exercise results for current user by exercise type.
     *
     * @param exerciseType the exercise type.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseResultDTO> findByCurrentUserAndExerciseType(ExerciseType exerciseType) {
        LOG.debug("Request to get exercise results for current user and type: {}", exerciseType);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        return exerciseResultRepository
            .findByAppUserIdAndExerciseType(appUser.getId(), exerciseType)
            .stream()
            .map(exerciseResultMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get recent exercise results for current user.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseResultDTO> findRecentByCurrentUser() {
        LOG.debug("Request to get recent exercise results for current user");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        return exerciseResultRepository
            .findTop10ByAppUserIdOrderBySubmittedAtDesc(appUser.getId())
            .stream()
            .map(exerciseResultMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get statistics for current user.
     *
     * @return the statistics.
     */
    @Transactional(readOnly = true)
    public ExerciseStatisticsDTO getStatisticsForCurrentUser() {
        LOG.debug("Request to get exercise statistics for current user");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        ExerciseStatisticsDTO stats = new ExerciseStatisticsDTO();
        stats.setTotalExercises(exerciseResultRepository.countByAppUserId(appUser.getId()));
        stats.setPerfectScores(exerciseResultRepository.countByAppUserIdAndScore(appUser.getId(), 100));
        stats.setAverageScore(exerciseResultRepository.getAverageScoreByAppUserId(appUser.getId()));

        // Statistics by exercise type
        stats.setListeningCount(exerciseResultRepository.countByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.LISTENING));
        stats.setSpeakingCount(exerciseResultRepository.countByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.SPEAKING));
        stats.setReadingCount(exerciseResultRepository.countByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.READING));
        stats.setWritingCount(exerciseResultRepository.countByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.WRITING));

        stats.setListeningAverage(
            exerciseResultRepository.getAverageScoreByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.LISTENING)
        );
        stats.setSpeakingAverage(
            exerciseResultRepository.getAverageScoreByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.SPEAKING)
        );
        stats.setReadingAverage(exerciseResultRepository.getAverageScoreByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.READING));
        stats.setWritingAverage(exerciseResultRepository.getAverageScoreByAppUserIdAndExerciseType(appUser.getId(), ExerciseType.WRITING));

        return stats;
    }

    /**
     * Get all exercise results for current user by chapter.
     *
     * @param chapterId the chapter ID
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseResultDTO> findByCurrentUserAndChapter(Long chapterId) {
        LOG.debug("Request to get exercise results for current user and chapter: {}", chapterId);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        return exerciseResultRepository
            .findByAppUserIdAndChapterId(appUser.getId(), chapterId)
            .stream()
            .map(exerciseResultMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get exercise results for current user by chapter and exercise type.
     *
     * @param chapterId the chapter ID
     * @param exerciseType the exercise type
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseResultDTO> findByCurrentUserAndChapterAndType(Long chapterId, ExerciseType exerciseType) {
        LOG.debug("Request to get exercise results for current user, chapter: {} and type: {}", chapterId, exerciseType);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        return exerciseResultRepository
            .findByAppUserIdAndChapterIdAndExerciseType(appUser.getId(), chapterId, exerciseType)
            .stream()
            .map(exerciseResultMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get statistics for current user by chapter.
     *
     * @param chapterId the chapter ID
     * @return the statistics.
     */
    @Transactional(readOnly = true)
    public ChapterStatisticsDTO getStatisticsForChapter(Long chapterId) {
        LOG.debug("Request to get exercise statistics for current user and chapter: {}", chapterId);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user login not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        List<ExerciseResult> results = exerciseResultRepository.findByAppUserIdAndChapterId(appUser.getId(), chapterId);

        ChapterStatisticsDTO stats = new ChapterStatisticsDTO();
        stats.setChapterId(chapterId);
        stats.setTotalExercises((long) results.size());
        stats.setAverageScore(exerciseResultRepository.getAverageScoreByAppUserIdAndChapterId(appUser.getId(), chapterId));

        // Count and average by type
        Map<ExerciseType, Long> countByType = new HashMap<>();
        Map<ExerciseType, Double> avgByType = new HashMap<>();

        for (ExerciseType type : ExerciseType.values()) {
            List<ExerciseResult> typeResults = results
                .stream()
                .filter(r -> r.getExerciseType() == type)
                .collect(Collectors.toList());

            countByType.put(type, (long) typeResults.size());

            if (!typeResults.isEmpty()) {
                double avg = typeResults.stream().mapToInt(ExerciseResult::getScore).average().orElse(0.0);
                avgByType.put(type, avg);
            } else {
                avgByType.put(type, 0.0);
            }
        }

        stats.setCountByType(countByType);
        stats.setAverageScoreByType(avgByType);

        return stats;
    }

    /**
     * Count completed exercises for a user.
     * Use case: Dashboard statistics
     *
     * @param userLogin the user login
     * @return count of completed exercises
     */
    @Transactional(readOnly = true)
    public Long countByUserLogin(String userLogin) {
        LOG.debug("Request to count exercises for user: {}", userLogin);
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));
        return exerciseResultRepository.countByAppUserId(appUser.getId());
    }
}
