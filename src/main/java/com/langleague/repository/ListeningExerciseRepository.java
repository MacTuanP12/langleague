package com.langleague.repository;

import com.langleague.domain.ListeningExercise;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ListeningExercise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListeningExerciseRepository extends JpaRepository<ListeningExercise, Long> {
    /**
     * Find all listening exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of listening exercises
     */
    List<ListeningExercise> findByChapterId(Long chapterId);

    /**
     * Count all listening exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return count of listening exercises
     */
    long countByChapter_Id(Long chapterId);
}
