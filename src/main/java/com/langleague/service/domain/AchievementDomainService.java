package com.langleague.service.domain;

import com.langleague.domain.Achievement;
import com.langleague.domain.AppUser;
import com.langleague.domain.UserAchievement;
import com.langleague.repository.AchievementRepository;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.UserAchievementRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Domain Service for Achievement unlocking logic.
 *
 * SIMPLIFIED with Rich Domain Model:
 * - Service: Query data from DB + orchestrate
 * - Entity: Business logic (UserAchievement.updateProgress)
 *
 * RESPONSIBILITIES:
 * 1. Query current user stats from database
 * 2. Load achievement rules
 * 3. Call entity.updateProgress() - logic in entity!
 * 4. Save and publish events
 *
 * WHY Domain Service (not in CRUD Service):
 * - Crosses multiple aggregates (User, Achievement, ExerciseResult)
 * - Complex orchestration logic
 *
 * For Fresher team: "Service lấy dữ liệu, Entity quyết định logic"
 */
@Service
@Transactional
public class AchievementDomainService {

    private static final Logger LOG = LoggerFactory.getLogger(AchievementDomainService.class);

    private final UserAchievementRepository userAchievementRepository;
    private final AchievementRepository achievementRepository;
    private final AppUserRepository appUserRepository;

    public AchievementDomainService(
        UserAchievementRepository userAchievementRepository,
        AchievementRepository achievementRepository,
        AppUserRepository appUserRepository
    ) {
        this.userAchievementRepository = userAchievementRepository;
        this.achievementRepository = achievementRepository;
        this.appUserRepository = appUserRepository;
    }

    /**
     * Check and unlock achievements based on user activity.
     *
     * SIMPLIFIED FLOW (Rich Domain Model):
     * 1. Query current stats from DB (Service responsibility)
     * 2. Load achievement rules
     * 3. Call entity.updateProgress() (Entity responsibility)
     * 4. Save if unlocked
     *
     * @param userLogin the user login
     * @param criteriaType type of criteria (STREAK, EXERCISES, CHAPTERS)
     * @param currentValue current value to check against
     * @return list of newly unlocked achievements
     */
    @Transactional
    public List<UserAchievement> checkAndUnlockAchievements(String userLogin, String criteriaType, Long currentValue) {
        LOG.debug("Checking achievements for user: {} | Type: {} | Value: {}", userLogin, criteriaType, currentValue);

        // 1. Load user
        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new IllegalArgumentException("AppUser not found: " + userLogin));

        // 2. Get all achievement rules for this criteria type
        List<Achievement> achievements = achievementRepository.findByCriteriaType(criteriaType);

        List<UserAchievement> newlyUnlocked = new java.util.ArrayList<>();

        for (Achievement achievement : achievements) {
            // 3. Find or create UserAchievement
            UserAchievement userAch = userAchievementRepository
                .findByAppUserIdAndAchievementId(appUser.getId(), achievement.getId())
                .orElseGet(() -> UserAchievement.createNew(appUser, achievement)); // Static factory

            // 4. Business logic ở Entity! (Rich Domain Model)
            boolean justUnlocked = userAch.updateProgress(currentValue, achievement);

            if (justUnlocked) {
                userAchievementRepository.save(userAch);
                newlyUnlocked.add(userAch);

                LOG.info(
                    "🎉 Achievement unlocked! User: {} | Achievement: {} | Progress: {}/{}",
                    userLogin,
                    achievement.getTitle(), // Use getTitle() instead of getName()
                    currentValue,
                    achievement.getTargetValue()
                );

                // TODO: Publish event for celebration
                // eventPublisher.publish(new AchievementUnlockedEvent(appUser.getId(), achievement));
            } else if (userAch.isLocked()) {
                // Save progress even if not unlocked yet
                userAchievementRepository.save(userAch);
                LOG.debug("Progress updated: {} | {}% complete", achievement.getTitle(), userAch.getProgressPercent());
            }
        }

        return newlyUnlocked;
    }

    /**
     * Get achievement progress for all achievements of a user.
     * Shows progress toward each achievement.
     *
     * @param userLogin the user login
     * @return list of achievements with progress
     */
    @Transactional(readOnly = true)
    public List<UserAchievement> getAchievementProgress(String userLogin) {
        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new IllegalArgumentException("AppUser not found: " + userLogin));

        // Get all user achievements (includes locked and unlocked)
        List<UserAchievement> userAchievements = userAchievementRepository.findByAppUserId(appUser.getId());

        // If user has no achievements yet, create placeholder entries
        if (userAchievements.isEmpty()) {
            List<Achievement> allAchievements = achievementRepository.findAll();
            userAchievements = allAchievements
                .stream()
                .map(achievement -> UserAchievement.createNew(appUser, achievement))
                .toList();
        }

        return userAchievements;
    }
}
