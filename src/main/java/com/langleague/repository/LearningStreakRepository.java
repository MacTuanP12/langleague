package com.langleague.repository;

import com.langleague.domain.LearningStreak;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LearningStreak entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LearningStreakRepository extends JpaRepository<LearningStreak, Long> {
    /**
     * Find the most recent streak record for a user
     */
    Optional<LearningStreak> findTopByAppUser_InternalUser_LoginOrderByLastStudyDateDesc(String userLogin);

    /**
     * Find the record with longest streak for a user
     */
    Optional<LearningStreak> findTopByAppUser_InternalUser_LoginOrderByLongestStreakDesc(String userLogin);

    /**
     * Find streak record for a specific date and user
     */
    Optional<LearningStreak> findByAppUser_InternalUser_LoginAndLastStudyDate(String userLogin, Instant lastStudyDate);

    /**
     * Find streak by AppUser ID (optimized)
     */
    Optional<LearningStreak> findByAppUserId(Long appUserId);
}
