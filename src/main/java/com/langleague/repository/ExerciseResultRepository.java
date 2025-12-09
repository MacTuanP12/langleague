package com.langleague.repository;

import com.langleague.domain.ExerciseResult;
import com.langleague.domain.enumeration.ExerciseType;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExerciseResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExerciseResultRepository extends JpaRepository<ExerciseResult, Long> {
    // Count all exercises by user
    long countByAppUserId(Long appUserId);

    // Count exercises by user and type
    long countByAppUserIdAndExerciseType(Long appUserId, ExerciseType exerciseType);

    // Count perfect scores (score = 100) by user
    long countByAppUserIdAndScore(Long appUserId, Integer score);

    // Count perfect scores by user and exercise type
    long countByAppUserIdAndExerciseTypeAndScore(Long appUserId, ExerciseType exerciseType, Integer score);

    // Get all exercise results by user
    List<ExerciseResult> findByAppUserId(Long appUserId);

    // Get exercise results by user and type
    List<ExerciseResult> findByAppUserIdAndExerciseType(Long appUserId, ExerciseType exerciseType);

    // Calculate average score for user
    @Query("SELECT AVG(e.score) FROM ExerciseResult e WHERE e.appUser.id = :appUserId")
    Double getAverageScoreByAppUserId(@Param("appUserId") Long appUserId);

    // Calculate average score by exercise type
    @Query("SELECT AVG(e.score) FROM ExerciseResult e WHERE e.appUser.id = :appUserId AND e.exerciseType = :exerciseType")
    Double getAverageScoreByAppUserIdAndExerciseType(@Param("appUserId") Long appUserId, @Param("exerciseType") ExerciseType exerciseType);

    // Get recent exercise results
    List<ExerciseResult> findTop10ByAppUserIdOrderBySubmittedAtDesc(Long appUserId);

    // Find by chapter (join through different exercise types)
    @Query(
        "SELECT er FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.id = :chapterId)" +
            ")"
    )
    List<ExerciseResult> findByAppUserIdAndChapterId(@Param("appUserId") Long appUserId, @Param("chapterId") Long chapterId);

    // Find by chapter and exercise type
    @Query(
        "SELECT er FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND er.exerciseType = :exerciseType " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.id = :chapterId)" +
            ")"
    )
    List<ExerciseResult> findByAppUserIdAndChapterIdAndExerciseType(
        @Param("appUserId") Long appUserId,
        @Param("chapterId") Long chapterId,
        @Param("exerciseType") ExerciseType exerciseType
    );

    // Count by chapter
    @Query(
        "SELECT COUNT(er) FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.id = :chapterId)" +
            ")"
    )
    long countByAppUserIdAndChapterId(@Param("appUserId") Long appUserId, @Param("chapterId") Long chapterId);

    // Get average score by chapter
    @Query(
        "SELECT AVG(er.score) FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.id = :chapterId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.id = :chapterId)" +
            ")"
    )
    Double getAverageScoreByAppUserIdAndChapterId(@Param("appUserId") Long appUserId, @Param("chapterId") Long chapterId);

    // Find by book (join through chapter)
    @Query(
        "SELECT er FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.book.id = :bookId)" +
            ")"
    )
    List<ExerciseResult> findByAppUserIdAndBookId(@Param("appUserId") Long appUserId, @Param("bookId") Long bookId);

    // Count completed exercises by book
    @Query(
        "SELECT COUNT(er) FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND er.score >= :minScore " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.book.id = :bookId)" +
            ")"
    )
    long countCompletedExercisesByBookId(
        @Param("appUserId") Long appUserId,
        @Param("bookId") Long bookId,
        @Param("minScore") Integer minScore
    );

    // Get average score by book
    @Query(
        "SELECT AVG(er.score) FROM ExerciseResult er " +
            "WHERE er.appUser.id = :appUserId " +
            "AND (" +
            "   (er.exerciseType = 'LISTENING' AND er.listeningExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'SPEAKING' AND er.speakingExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'READING' AND er.readingExercise.chapter.book.id = :bookId) OR " +
            "   (er.exerciseType = 'WRITING' AND er.writingExercise.chapter.book.id = :bookId)" +
            ")"
    )
    Double getAverageScoreByAppUserIdAndBookId(@Param("appUserId") Long appUserId, @Param("bookId") Long bookId);

    /**
     * DATA ARCHIVING: Count old records for archival.
     * Used by DataArchivingService to prevent table bloat.
     *
     * @param cutoffDate records older than this date
     * @return count of old records
     */
    long countBySubmittedAtBefore(java.time.Instant cutoffDate);
}
