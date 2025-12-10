package com.langleague.repository;

import com.langleague.domain.StudySession;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudySession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    @Query("select s from StudySession s where s.appUser.internalUser.login = ?#{principal.username} order by s.startAt desc")
    Page<StudySession> findByUserIsCurrentUser(Pageable pageable);

    @Query("select s from StudySession s where s.appUser.internalUser.id = ?1 order by s.startAt desc")
    Page<StudySession> findByUserId(Long userId, Pageable pageable);

    @Query("select s from StudySession s where s.appUser.internalUser.id = ?1 order by s.startAt desc")
    List<StudySession> findByUserId(Long userId);

    @Query("select s from StudySession s where s.appUser.internalUser.id = ?1 and s.startAt > ?2")
    List<StudySession> findByUserIdAndStartAtAfter(Long userId, Instant startAt);

    List<StudySession> findByStartAtBetween(Instant startDate, Instant endDate);

    @Query("select s from StudySession s where s.appUser.internalUser.id = ?1 and s.startAt between ?2 and ?3")
    List<StudySession> findByUserIdAndStartAtBetween(Long userId, Instant startDate, Instant endDate);

    /**
     * Find overlapping sessions for a user - optimized overlap detection
     * Two sessions overlap if: session1.start < session2.end AND session1.end > session2.start
     */
    @Query("SELECT s FROM StudySession s WHERE s.appUser.internalUser.id = :userId " + "AND s.startAt < :endAt AND s.endAt > :startAt")
    List<StudySession> findOverlappingSessions(
        @Param("userId") Long userId,
        @Param("startAt") Instant startAt,
        @Param("endAt") Instant endAt
    );

    @Query("SELECT COUNT(DISTINCT s.appUser.internalUser.id) FROM StudySession s WHERE s.startAt BETWEEN ?1 AND ?2")
    Long countActiveUsersInPeriod(Instant startDate, Instant endDate);

    /**
     * Business Analytics Queries
     */

    @Query("SELECT COUNT(DISTINCT s.appUser.id) FROM StudySession s WHERE s.startAt > :afterDate")
    Integer countDistinctUsersBySessionDateAfter(@Param("afterDate") Instant afterDate);

    @Query("SELECT COUNT(DISTINCT s.appUser.id) FROM StudySession s WHERE s.startAt BETWEEN :startDate AND :endDate")
    Integer countDistinctUsersBySessionDateBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
        "SELECT COUNT(DISTINCT s.appUser.id) FROM StudySession s " +
            "WHERE s.appUser.internalUser.createdDate BETWEEN :regStart AND :regEnd " +
            "AND s.startAt > :activeAfter"
    )
    Long countDistinctUsersRegisteredBetweenAndActiveAfter(
        @Param("regStart") Instant regStart,
        @Param("regEnd") Instant regEnd,
        @Param("activeAfter") Instant activeAfter
    );

    /**
     * PERFORMANCE OPTIMIZED: Calculate average session duration using database aggregation.
     * Returns average duration in seconds. This query runs entirely in DB, not in Java.
     */
    @Query(
        value = "SELECT AVG(TIMESTAMPDIFF(SECOND, start_at, end_at)) as avg_duration " +
            "FROM study_session " +
            "WHERE start_at BETWEEN :startDate AND :endDate AND end_at IS NOT NULL",
        nativeQuery = true
    )
    Double findAvgDurationByDateRangeNative(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
        "SELECT AVG(TIMESTAMPDIFF(SECOND, s.startAt, s.endAt)) FROM StudySession s " +
            "WHERE s.startAt BETWEEN :startDate AND :endDate AND s.endAt IS NOT NULL"
    )
    List<Object[]> findAvgDurationByDateRange(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    /**
     * Check if user has studied today (for smart reminder)
     */
    boolean existsByAppUserInternalUserIdAndStartAtGreaterThanEqual(Long userId, Instant startTime);

    /**
     * Count study sessions today (for analytics)
     */
    @Query("SELECT COUNT(s) FROM StudySession s " + "WHERE s.appUser.internalUser.id = :userId " + "AND s.startAt >= :todayStart")
    long countTodayStudySessions(@Param("userId") Long userId, @Param("todayStart") Instant todayStart);

    /**
     * Count total study sessions for user - optimized query
     */
    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.appUser.internalUser.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    /**
     * Sum total study minutes for user - optimized query
     */
    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s WHERE s.appUser.internalUser.id = :userId")
    long sumDurationMinutesByUserId(@Param("userId") Long userId);

    /**
     * Count sessions in date range for user - optimized query
     */
    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.appUser.internalUser.id = :userId AND s.startAt BETWEEN :startDate AND :endDate")
    long countByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    /**
     * Count total distinct users who have study sessions
     */
    @Query("SELECT COUNT(DISTINCT s.appUser.internalUser.id) FROM StudySession s")
    long countDistinctUsers();

    /**
     * Count sessions after a specific date
     */
    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.startAt >= :startDate")
    long countByStartAtAfter(@Param("startDate") Instant startDate);
    // @Query("SELECT COUNT(DISTINCT s.lesson.id) FROM StudySession s WHERE
    // s.startAt BETWEEN ?1 AND ?2")
    // Long countActiveLessonsInPeriod(Instant startDate, Instant endDate);

    // @Query("SELECT AVG(CASE WHEN s.status = 'COMPLETED' THEN 1.0 ELSE 0.0 END)
    // FROM StudySession s WHERE s.startAt BETWEEN ?1 AND ?2")
    // Double calculateCompletionRate(Instant startDate, Instant endDate);
}
