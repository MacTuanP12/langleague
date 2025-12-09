package com.langleague.repository;

import com.langleague.domain.StreakIcon;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StreakIcon entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StreakIconRepository extends JpaRepository<StreakIcon, Long> {
    /**
     * Find all icons ordered by minDays ascending.
     */
    List<StreakIcon> findAllByOrderByMinDaysAsc();

    /**
     * Find icons by level.
     */
    List<StreakIcon> findByLevel(String level);

    /**
     * Find icon for specific streak days (minDays <= currentStreak, highest tier).
     */
    @Query("SELECT si FROM StreakIcon si " + "WHERE si.minDays <= :currentStreak " + "ORDER BY si.minDays DESC")
    List<StreakIcon> findIconsForStreak(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Find the highest tier icon user has unlocked.
     */
    @Query("SELECT si FROM StreakIcon si " + "WHERE si.minDays <= :currentStreak " + "ORDER BY si.minDays DESC")
    Optional<StreakIcon> findCurrentIconForStreak(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Find next icon to unlock (minDays > currentStreak, closest one).
     */
    @Query("SELECT si FROM StreakIcon si " + "WHERE si.minDays > :currentStreak " + "ORDER BY si.minDays ASC")
    Optional<StreakIcon> findNextIcon(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Find all unlocked icons for user (minDays <= currentStreak).
     */
    @Query("SELECT si FROM StreakIcon si " + "WHERE si.minDays <= :currentStreak " + "ORDER BY si.minDays ASC")
    List<StreakIcon> findUnlockedIcons(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Find all locked icons (minDays > currentStreak).
     */
    @Query("SELECT si FROM StreakIcon si " + "WHERE si.minDays > :currentStreak " + "ORDER BY si.minDays ASC")
    List<StreakIcon> findLockedIcons(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Check if icon exists for level.
     */
    boolean existsByLevel(String level);

    /**
     * Find icon by exact minDays requirement.
     */
    Optional<StreakIcon> findByMinDays(Integer minDays);
}
