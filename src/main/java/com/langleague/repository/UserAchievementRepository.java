package com.langleague.repository;

import com.langleague.domain.UserAchievement;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserAchievement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    Optional<UserAchievement> findByAppUserIdAndAchievementId(Long appUserId, Long achievementId);

    List<UserAchievement> findByAppUserId(Long appUserId);

    // Alias methods for backward compatibility
    default Optional<UserAchievement> findByUserIdAndAchievementId(Long userId, Long achievementId) {
        return findByAppUserIdAndAchievementId(userId, achievementId);
    }

    default List<UserAchievement> findByUserId(Long userId) {
        return findByAppUserId(userId);
    }
}
