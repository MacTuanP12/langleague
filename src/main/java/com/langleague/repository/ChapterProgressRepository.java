package com.langleague.repository;

import com.langleague.domain.ChapterProgress;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ChapterProgress entity.
 */
@Repository
public interface ChapterProgressRepository extends JpaRepository<ChapterProgress, Long> {
    /**
     * Find progress by chapter ID and user login
     */
    Optional<ChapterProgress> findByChapterIdAndAppUser_InternalUser_Login(Long chapterId, String userLogin);

    /**
     * Find all progress records for a book and user
     */
    List<ChapterProgress> findByChapter_BookIdAndAppUser_InternalUser_Login(Long bookId, String userLogin);

    /**
     * Find all progress records for a user
     */
    List<ChapterProgress> findByAppUser_InternalUser_Login(String userLogin);

    /**
     * Find all progress records for a user by user ID
     */
    @org.springframework.data.jpa.repository.Query("select cp from ChapterProgress cp where cp.appUser.internalUser.id = ?1")
    List<ChapterProgress> findByUserId(Long userId);

    /**
     * Find progress by chapter ID and user ID
     */
    @org.springframework.data.jpa.repository.Query(
        "select cp from ChapterProgress cp where cp.chapter.id = ?1 and cp.appUser.internalUser.id = ?2"
    )
    Optional<ChapterProgress> findByChapterIdAndUserId(Long chapterId, Long userId);

    /**
     * Count total chapters started by user - optimized query
     */
    @Query("SELECT COUNT(cp) FROM ChapterProgress cp WHERE cp.appUser.internalUser.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    /**
     * Count completed chapters by user - optimized query
     */
    @Query("SELECT COUNT(cp) FROM ChapterProgress cp WHERE cp.appUser.internalUser.id = :userId AND cp.completed = true")
    long countCompletedByUserId(@Param("userId") Long userId);

    /**
     * Calculate average progress percentage for user - optimized query
     */
    @Query("SELECT AVG(COALESCE(cp.percent, 0.0)) FROM ChapterProgress cp WHERE cp.appUser.internalUser.id = :userId")
    Double getAverageProgressByUserId(@Param("userId") Long userId);

    /**
     * Business Analytics Queries
     */

    @Query("SELECT COUNT(DISTINCT cp.appUser.id) FROM ChapterProgress cp WHERE cp.completed = true")
    Long countDistinctUsersWithCompletedChapters();

    /**
     * PERFORMANCE OPTIMIZED: Native query with aggregations to calculate chapter performance metrics.
     * This query runs entirely in database, preventing RAM overflow with large datasets.
     * Returns: [chapter_id, chapter_title, completion_count, avg_score, dropoff_rate]
     */
    @Query(
        value = "SELECT " +
            "c.id, " +
            "c.title, " +
            "COUNT(DISTINCT CASE WHEN cp.completed = true THEN cp.app_user_id END) as completions, " +
            "COALESCE(AVG(CASE WHEN cp.completed = true THEN cp.percent END), 0) as avg_score, " +
            "ROUND(COUNT(DISTINCT CASE WHEN cp.completed = false THEN cp.app_user_id END) * 100.0 / " +
            "NULLIF(COUNT(DISTINCT cp.app_user_id), 0), 2) as dropoff_rate " +
            "FROM chapter c " +
            "LEFT JOIN chapter_progress cp ON c.id = cp.chapter_id " +
            "GROUP BY c.id, c.title " +
            "ORDER BY completions DESC " +
            "LIMIT 10",
        nativeQuery = true
    )
    List<Object[]> findChapterPerformanceStats();

    // Fallback JPQL version (less performant but more portable)
    @Query(
        "SELECT c.id, c.title, COUNT(cp), AVG(COALESCE(cp.percent, 0)), " +
            "(SELECT COUNT(cp2) * 100.0 / COUNT(cp) FROM ChapterProgress cp2 WHERE cp2.chapter.id = c.id AND cp2.completed = false) " +
            "FROM Chapter c LEFT JOIN c.chapterProgresses cp " +
            "GROUP BY c.id, c.title " +
            "ORDER BY COUNT(cp) DESC"
    )
    List<Object[]> findChapterPerformanceStatsJPQL();
}
