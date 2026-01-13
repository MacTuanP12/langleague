package com.langleague.app.repository;

import com.langleague.app.domain.Exercise;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Exercise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findAllByUnitIdOrderByOrderIndexAsc(Long unitId);

    /**
     * Find all exercises by unit ID with options eagerly loaded to avoid N+1 problem
     * This method is used for self-study mode where the frontend needs all questions and answers
     */
    @EntityGraph(attributePaths = { "options" })
    @Query("SELECT e FROM Exercise e WHERE e.unit.id = :unitId ORDER BY e.orderIndex ASC")
    List<Exercise> findAllByUnitIdWithOptions(@Param("unitId") Long unitId);
}
