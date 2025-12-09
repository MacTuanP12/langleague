package com.langleague.repository;

import com.langleague.domain.Chapter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Chapter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    /**
     * Find all chapters by book ID, ordered by order index
     */
    List<Chapter> findByBookIdOrderByOrderIndex(Long bookId);

    List<Chapter> findByBookIdOrderByOrderIndexAsc(Long bookId);

    /**
     * Search chapters by title (case-insensitive)
     * Use case 18: Search lessons
     */
    @Query("select c from Chapter c where lower(c.title) like lower(concat('%', :keyword, '%'))")
    Page<Chapter> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Count chapters by book ID
     */
    long countByBookId(Long bookId);

    /**
     * Check if chapter exists by book ID and order index
     */
    boolean existsByBookIdAndOrderIndex(Long bookId, Integer orderIndex);

    /**
     * Check if chapter exists by ID and belongs to book
     */
    boolean existsByIdAndBook_Id(Long chapterId, Long bookId);

    /**
     * Find the next chapter in sequence for a book
     */
    @Query("select c from Chapter c where c.book.id = :bookId and c.orderIndex > :currentIndex order by c.orderIndex asc")
    Optional<Chapter> findNextChapter(@Param("bookId") Long bookId, @Param("currentIndex") Integer currentIndex);

    /**
     * Find the previous chapter in sequence for a book
     */
    @Query("select c from Chapter c where c.book.id = :bookId and c.orderIndex < :currentIndex order by c.orderIndex desc")
    Optional<Chapter> findPreviousChapter(@Param("bookId") Long bookId, @Param("currentIndex") Integer currentIndex);

    /**
     * OPTIMIZED: Fetch chapter with words only (avoid Cartesian product)
     */
    @Query("select chapter from Chapter chapter left join fetch chapter.words where chapter.id = :id")
    Optional<Chapter> findOneWithWords(@Param("id") Long id);

    /**
     * OPTIMIZED: Fetch chapter with grammars only
     */
    @Query("select chapter from Chapter chapter left join fetch chapter.grammars where chapter.id = :id")
    Optional<Chapter> findOneWithGrammars(@Param("id") Long id);

    /**
     * OPTIMIZED: Fetch chapter with listening exercises only
     */
    @Query("select chapter from Chapter chapter left join fetch chapter.listeningExercises where chapter.id = :id")
    Optional<Chapter> findOneWithListeningExercises(@Param("id") Long id);

    /**
     * OPTIMIZED: Fetch chapter with reading exercises only
     */
    @Query("select chapter from Chapter chapter left join fetch chapter.readingExercises where chapter.id = :id")
    Optional<Chapter> findOneWithReadingExercises(@Param("id") Long id);

    /**
     * OPTIMIZED: Fetch chapter with writing exercises only
     */
    @Query("select chapter from Chapter chapter left join fetch chapter.writingExercises where chapter.id = :id")
    Optional<Chapter> findOneWithWritingExercises(@Param("id") Long id);

    /**
     * OPTIMIZED: Fetch chapter with speaking exercises only
     */
    @Query("select chapter from Chapter chapter left join fetch chapter.speakingExercises where chapter.id = :id")
    Optional<Chapter> findOneWithSpeakingExercises(@Param("id") Long id);

    /**
     * DEPRECATED: This causes Cartesian product. Use separate queries instead.
     * @deprecated Use findOneWithWords, findOneWithGrammars, etc. separately
     */
    @Deprecated
    @Query(
        "select chapter from Chapter chapter " +
            "left join fetch chapter.words " +
            "left join fetch chapter.grammars " +
            "left join fetch chapter.listeningExercises " +
            "left join fetch chapter.readingExercises " +
            "left join fetch chapter.writingExercises " +
            "left join fetch chapter.speakingExercises " +
            "where chapter.id = :id"
    )
    Optional<Chapter> findOneWithEagerRelationships(@Param("id") Long id);
}
