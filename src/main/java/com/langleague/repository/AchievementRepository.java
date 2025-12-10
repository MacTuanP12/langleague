package com.langleague.repository;

import com.langleague.domain.Achievement;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Achievement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    /**
     * Find all achievements by criteria type (e.g., "STREAK", "EXERCISES", "CHAPTERS").
     * Used by AchievementDomainService to check which achievements to evaluate.
     */
    List<Achievement> findByCriteriaType(String criteriaType);

    /**
     * Find achievements by type where target value is less than or equal to current value.
     * Useful for bulk checking which achievements user has reached.
     */
    @Query("SELECT a FROM Achievement a WHERE a.criteriaType = :type AND a.targetValue <= :value")
    List<Achievement> findByCriteriaTypeAndTargetValueLessThanEqual(
        @org.springframework.data.repository.query.Param("type") String criteriaType,
        @org.springframework.data.repository.query.Param("value") Long currentValue
    );
}
