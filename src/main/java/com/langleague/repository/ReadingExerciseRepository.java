package com.langleague.repository;

import com.langleague.domain.ReadingExercise;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ReadingExercise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReadingExerciseRepository extends JpaRepository<ReadingExercise, Long> {
    /**
     * Find all reading exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of reading exercises
     */
    List<ReadingExercise> findByChapterId(Long chapterId);

    /**
     * Count all reading exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return count of reading exercises
     */
    long countByChapter_Id(Long chapterId);
}
