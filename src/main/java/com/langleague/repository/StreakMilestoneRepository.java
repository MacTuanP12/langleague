package com.langleague.repository;

import com.langleague.domain.StreakMilestone;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StreakMilestone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StreakMilestoneRepository extends JpaRepository<StreakMilestone, Long> {
    /**
     * Find all milestones ordered by days ascending.
     */
    List<StreakMilestone> findAllByOrderByMilestoneDaysAsc();

    /**
     * Find milestone by exact days.
     */
    List<StreakMilestone> findByMilestoneDays(Integer milestoneDays);

    /**
     * Find milestones that user should have achieved (days <= currentStreak).
     */
    @Query("SELECT sm FROM StreakMilestone sm WHERE sm.milestoneDays <= :currentStreak ORDER BY sm.milestoneDays ASC")
    List<StreakMilestone> findAchievedMilestones(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Find next milestone to achieve (days > currentStreak, closest one).
     */
    @Query("SELECT sm FROM StreakMilestone sm " + "WHERE sm.milestoneDays > :currentStreak " + "ORDER BY sm.milestoneDays ASC")
    List<StreakMilestone> findNextMilestones(@org.springframework.data.repository.query.Param("currentStreak") Integer currentStreak);

    /**
     * Find milestones by study session.
     */
    List<StreakMilestone> findByStudySessionId(Long studySessionId);

    /**
     * Check if milestone exists for given days.
     */
    boolean existsByMilestoneDays(Integer milestoneDays);
}
