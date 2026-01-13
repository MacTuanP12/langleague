package com.langleague.app.repository;

import com.langleague.app.domain.ExerciseOption;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExerciseOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExerciseOptionRepository extends JpaRepository<ExerciseOption, Long> {
    List<ExerciseOption> findByExerciseId(Long exerciseId);
}
