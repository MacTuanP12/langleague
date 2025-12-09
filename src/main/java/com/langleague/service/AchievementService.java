package com.langleague.service;

import com.langleague.domain.Achievement;
import com.langleague.domain.UserAchievement;
import com.langleague.domain.enumeration.ExerciseType;
import com.langleague.repository.AchievementRepository;
import com.langleague.repository.ExerciseResultRepository;
import com.langleague.repository.LearningStreakRepository;
import com.langleague.repository.UserAchievementRepository;
import com.langleague.service.dto.AchievementDTO;
import com.langleague.service.mapper.AchievementMapper;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.Achievement}.
 */
@Service
@Transactional
public class AchievementService {

    private static final Logger LOG = LoggerFactory.getLogger(AchievementService.class);

    private final AchievementRepository achievementRepository;

    private final AchievementMapper achievementMapper;

    private final ExerciseResultRepository exerciseResultRepository;

    private final UserAchievementRepository userAchievementRepository;

    private final LearningStreakRepository learningStreakRepository;

    public AchievementService(
        AchievementRepository achievementRepository,
        AchievementMapper achievementMapper,
        ExerciseResultRepository exerciseResultRepository,
        UserAchievementRepository userAchievementRepository,
        LearningStreakRepository learningStreakRepository
    ) {
        this.achievementRepository = achievementRepository;
        this.achievementMapper = achievementMapper;
        this.exerciseResultRepository = exerciseResultRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.learningStreakRepository = learningStreakRepository;
    }

    /**
     * Save a achievement.
     *
     * @param achievementDTO the entity to save.
     * @return the persisted entity.
     */
    public AchievementDTO save(AchievementDTO achievementDTO) {
        LOG.debug("Request to save Achievement : {}", achievementDTO);
        Achievement achievement = achievementMapper.toEntity(achievementDTO);
        achievement = achievementRepository.save(achievement);
        return achievementMapper.toDto(achievement);
    }

    /**
     * Update a achievement.
     *
     * @param achievementDTO the entity to save.
     * @return the persisted entity.
     */
    public AchievementDTO update(AchievementDTO achievementDTO) {
        LOG.debug("Request to update Achievement : {}", achievementDTO);
        Achievement achievement = achievementMapper.toEntity(achievementDTO);
        achievement = achievementRepository.save(achievement);
        return achievementMapper.toDto(achievement);
    }

    /**
     * Partially update a achievement.
     *
     * @param achievementDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AchievementDTO> partialUpdate(AchievementDTO achievementDTO) {
        LOG.debug("Request to partially update Achievement : {}", achievementDTO);

        return achievementRepository
            .findById(achievementDTO.getId())
            .map(existingAchievement -> {
                achievementMapper.partialUpdate(existingAchievement, achievementDTO);

                return existingAchievement;
            })
            .map(achievementRepository::save)
            .map(achievementMapper::toDto);
    }

    /**
     * Get all the achievements.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<AchievementDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Achievements");
        return achievementRepository.findAll(pageable).map(achievementMapper::toDto);
    }

    /**
     * Get one achievement by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<AchievementDTO> findOne(Long id) {
        LOG.debug("Request to get Achievement : {}", id);
        return achievementRepository.findById(id).map(achievementMapper::toDto);
    }

    /**
     * Delete the achievement by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Achievement : {}", id);
        achievementRepository.deleteById(id);
    }

    /**
     * Check and award achievements for a user after completing an exercise
     *
     * @param userId the user ID
     * @param exerciseType the type of exercise completed
     * @param score the score achieved
     * @return list of newly awarded achievements
     */
    public List<Achievement> checkAndAwardAchievements(Long userId, ExerciseType exerciseType, Integer score) {
        LOG.debug("Checking achievements for user: {}, exerciseType: {}, score: {}", userId, exerciseType, score);

        List<Achievement> newlyAwardedAchievements = new ArrayList<>();

        // Check total exercises milestone
        newlyAwardedAchievements.addAll(checkTotalExercisesMilestones(userId));

        // Check exercise type specific milestones
        if (exerciseType != null) {
            newlyAwardedAchievements.addAll(checkExerciseTypeMilestones(userId, exerciseType));
        }

        // Check perfect score achievements
        if (score != null && score == 100) {
            newlyAwardedAchievements.addAll(checkPerfectScoreAchievements(userId, exerciseType));
        }

        // Check average score achievements
        newlyAwardedAchievements.addAll(checkAverageScoreAchievements(userId));

        // Check learning streak achievements
        newlyAwardedAchievements.addAll(checkStreakAchievements(userId));

        return newlyAwardedAchievements;
    }

    /**
     * Check milestones for total exercises completed (10, 50, 100, 500, 1000)
     */
    private List<Achievement> checkTotalExercisesMilestones(Long userId) {
        List<Achievement> awarded = new ArrayList<>();
        long totalExercises = exerciseResultRepository.countByAppUserId(userId);

        int[] milestones = { 10, 50, 100, 500, 1000 };
        for (int milestone : milestones) {
            if (totalExercises == milestone) {
                Achievement achievement = findOrCreateAchievement(
                    "Hoàn thành " + milestone + " bài tập",
                    "Chúc mừng! Bạn đã hoàn thành " + milestone + " bài tập."
                );
                if (awardAchievementToUser(userId, achievement)) {
                    awarded.add(achievement);
                }
            }
        }

        return awarded;
    }

    /**
     * Check milestones for specific exercise type (10, 25, 50, 100)
     */
    private List<Achievement> checkExerciseTypeMilestones(Long userId, ExerciseType exerciseType) {
        List<Achievement> awarded = new ArrayList<>();
        long count = exerciseResultRepository.countByAppUserIdAndExerciseType(userId, exerciseType);

        String typeName = getExerciseTypeName(exerciseType);
        int[] milestones = { 10, 25, 50, 100 };

        for (int milestone : milestones) {
            if (count == milestone) {
                Achievement achievement = findOrCreateAchievement(
                    typeName + " Master " + milestone,
                    "Hoàn thành " + milestone + " bài tập " + typeName + "."
                );
                if (awardAchievementToUser(userId, achievement)) {
                    awarded.add(achievement);
                }
            }
        }

        return awarded;
    }

    /**
     * Check perfect score achievements
     */
    private List<Achievement> checkPerfectScoreAchievements(Long userId, ExerciseType exerciseType) {
        List<Achievement> awarded = new ArrayList<>();

        // First perfect score overall
        long totalPerfectScores = exerciseResultRepository.countByAppUserIdAndScore(userId, 100);
        if (totalPerfectScores == 1) {
            Achievement achievement = findOrCreateAchievement("Điểm số hoàn hảo đầu tiên", "Đạt điểm tuyệt đối 100 lần đầu tiên!");
            if (awardAchievementToUser(userId, achievement)) {
                awarded.add(achievement);
            }
        }

        // Multiple perfect scores
        if (totalPerfectScores == 10 || totalPerfectScores == 50 || totalPerfectScores == 100) {
            Achievement achievement = findOrCreateAchievement(
                "Perfectionist " + totalPerfectScores,
                "Đạt điểm 100 được " + totalPerfectScores + " lần!"
            );
            if (awardAchievementToUser(userId, achievement)) {
                awarded.add(achievement);
            }
        }

        // First perfect score by type
        if (exerciseType != null) {
            long typePerfectScores = exerciseResultRepository.countByAppUserIdAndExerciseTypeAndScore(userId, exerciseType, 100);
            if (typePerfectScores == 1) {
                String typeName = getExerciseTypeName(exerciseType);
                Achievement achievement = findOrCreateAchievement(
                    typeName + " Perfectionist",
                    "Đạt điểm 100 đầu tiên trong bài tập " + typeName + "!"
                );
                if (awardAchievementToUser(userId, achievement)) {
                    awarded.add(achievement);
                }
            }
        }

        return awarded;
    }

    /**
     * Check average score achievements
     */
    private List<Achievement> checkAverageScoreAchievements(Long userId) {
        List<Achievement> awarded = new ArrayList<>();
        long totalExercises = exerciseResultRepository.countByAppUserId(userId);

        // Only check if user has completed at least 20 exercises
        if (totalExercises >= 20) {
            Double avgScore = exerciseResultRepository.getAverageScoreByAppUserId(userId);
            if (avgScore != null) {
                if (avgScore >= 90.0) {
                    Achievement achievement = findOrCreateAchievement("Học sinh xuất sắc", "Duy trì điểm trung bình trên 90 điểm!");
                    if (awardAchievementToUser(userId, achievement)) {
                        awarded.add(achievement);
                    }
                } else if (avgScore >= 80.0) {
                    Achievement achievement = findOrCreateAchievement("Học sinh giỏi", "Duy trì điểm trung bình trên 80 điểm!");
                    if (awardAchievementToUser(userId, achievement)) {
                        awarded.add(achievement);
                    }
                }
            }
        }

        return awarded;
    }

    /**
     * Check learning streak achievements (1, 7, 30, 60, 100, 300 days)
     */
    private List<Achievement> checkStreakAchievements(Long userId) {
        List<Achievement> awarded = new ArrayList<>();

        // Get user's learning streak
        var streakOpt = learningStreakRepository.findByAppUserId(userId);
        if (streakOpt.isEmpty()) {
            return awarded;
        }

        var streak = streakOpt.orElseThrow();
        Integer currentStreak = streak.getCurrentStreak();
        Integer longestStreak = streak.getLongestStreak();

        if (currentStreak == null && longestStreak == null) {
            return awarded;
        }

        // Use the higher of current or longest streak for checking milestones
        int streakToCheck = Math.max(currentStreak != null ? currentStreak : 0, longestStreak != null ? longestStreak : 0);

        // Check streak milestones: 1, 7, 30, 60, 100, 300 days
        int[] milestones = { 1, 7, 30, 60, 100, 300 };
        String[] milestoneNames = {
            "Khởi đầu hành trình",
            "Học viên kiên trì",
            "Tháng học tập xuất sắc",
            "Hai tháng bền bỉ",
            "Học viên 100 ngày",
            "Huyền thoại học tập",
        };
        String[] milestoneDescriptions = {
            "Chúc mừng! Bạn đã bắt đầu hành trình học tập của mình",
            "Học liên tục 7 ngày - Sự kiên trì của bạn thật tuyệt vời!",
            "Học liên tục 30 ngày - Bạn đang trên đà thành công!",
            "Học liên tục 60 ngày - Sự nỗ lực của bạn đáng ngưỡng mộ!",
            "Học liên tục 100 ngày - Bạn là một huyền thoại!",
            "Học liên tục 300 ngày - Bạn đã đạt đến đỉnh cao của sự kiên trì!",
        };

        for (int i = 0; i < milestones.length; i++) {
            int milestone = milestones[i];

            // Check if current streak just reached this milestone
            if (currentStreak != null && currentStreak == milestone) {
                Achievement achievement = findOrCreateAchievement(milestoneNames[i], milestoneDescriptions[i]);
                if (awardAchievementToUser(userId, achievement)) {
                    awarded.add(achievement);
                    LOG.info("Awarded streak achievement '{}' to user {} for {} day streak", milestoneNames[i], userId, milestone);
                }
            }
            // Also check longest streak in case current streak broke but longest was achieved
            else if (longestStreak != null && longestStreak == milestone) {
                Achievement achievement = findOrCreateAchievement(milestoneNames[i], milestoneDescriptions[i]);
                if (awardAchievementToUser(userId, achievement)) {
                    awarded.add(achievement);
                    LOG.info(
                        "Awarded streak achievement '{}' to user {} for longest streak of {} days",
                        milestoneNames[i],
                        userId,
                        milestone
                    );
                }
            }
        }

        return awarded;
    }

    /**
     * Award achievement to user if they don't already have it
     */
    private boolean awardAchievementToUser(Long userId, Achievement achievement) {
        // Check if user already has this achievement
        if (userAchievementRepository.findByAppUserIdAndAchievementId(userId, achievement.getId()).isPresent()) {
            return false;
        }

        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setAppUser(new com.langleague.domain.AppUser().id(userId));
        userAchievement.setAchievement(achievement);
        userAchievement.setAwardedTo(Instant.now());

        userAchievementRepository.save(userAchievement);
        LOG.info("Awarded achievement '{}' to user {}", achievement.getTitle(), userId);

        return true;
    }

    /**
     * Find or create achievement by title
     */
    private Achievement findOrCreateAchievement(String title, String description) {
        return achievementRepository
            .findAll()
            .stream()
            .filter(a -> a.getTitle().equals(title))
            .findFirst()
            .orElseGet(() -> {
                Achievement newAchievement = new Achievement();
                newAchievement.setTitle(title);
                newAchievement.setDescription(description);
                return achievementRepository.save(newAchievement);
            });
    }

    /**
     * Get Vietnamese name for exercise type
     */
    private String getExerciseTypeName(ExerciseType type) {
        return switch (type) {
            case LISTENING -> "Nghe";
            case SPEAKING -> "Nói";
            case READING -> "Đọc";
            case WRITING -> "Viết";
        };
    }

    /**
     * Get user's achievement statistics
     */
    @Transactional(readOnly = true)
    public AchievementStats getUserAchievementStats(Long userId) {
        AchievementStats stats = new AchievementStats();

        stats.totalExercises = exerciseResultRepository.countByAppUserId(userId);
        stats.listeningExercises = exerciseResultRepository.countByAppUserIdAndExerciseType(userId, ExerciseType.LISTENING);
        stats.speakingExercises = exerciseResultRepository.countByAppUserIdAndExerciseType(userId, ExerciseType.SPEAKING);
        stats.readingExercises = exerciseResultRepository.countByAppUserIdAndExerciseType(userId, ExerciseType.READING);
        stats.writingExercises = exerciseResultRepository.countByAppUserIdAndExerciseType(userId, ExerciseType.WRITING);

        stats.perfectScores = exerciseResultRepository.countByAppUserIdAndScore(userId, 100);
        stats.averageScore = exerciseResultRepository.getAverageScoreByAppUserId(userId);

        stats.totalAchievements = userAchievementRepository.findByAppUserId(userId).size();

        // Add streak information
        var streakOpt = learningStreakRepository.findByAppUserId(userId);
        if (streakOpt.isPresent()) {
            var streak = streakOpt.orElseThrow();
            stats.currentStreak = streak.getCurrentStreak() != null ? streak.getCurrentStreak() : 0;
            stats.longestStreak = streak.getLongestStreak() != null ? streak.getLongestStreak() : 0;
        } else {
            stats.currentStreak = 0;
            stats.longestStreak = 0;
        }

        return stats;
    }

    /**
     * Achievement statistics class
     */
    public static class AchievementStats {

        public long totalExercises;
        public long listeningExercises;
        public long speakingExercises;
        public long readingExercises;
        public long writingExercises;
        public long perfectScores;
        public Double averageScore;
        public int totalAchievements;
        public int currentStreak;
        public int longestStreak;
    }
}
