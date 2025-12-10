package com.langleague.service;

import com.langleague.repository.*;
import com.langleague.service.dto.BusinessAnalyticsDTO;
import com.langleague.service.dto.ChapterPerformanceDTO;
import com.langleague.service.dto.UserEngagementDTO;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Business Analytics and KPI tracking.
 * Provides DAU/MAU, Retention Rate, Completion Rate, and other business metrics.
 */
@Service
@Transactional(readOnly = true)
public class BusinessAnalyticsService {

    private static final Logger LOG = LoggerFactory.getLogger(BusinessAnalyticsService.class);

    private final StudySessionRepository studySessionRepository;
    private final AppUserRepository appUserRepository;
    private final ChapterProgressRepository chapterProgressRepository;
    private final ExerciseResultRepository exerciseResultRepository;
    private final BookRepository bookRepository;

    public BusinessAnalyticsService(
        StudySessionRepository studySessionRepository,
        AppUserRepository appUserRepository,
        ChapterProgressRepository chapterProgressRepository,
        ExerciseResultRepository exerciseResultRepository,
        BookRepository bookRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.appUserRepository = appUserRepository;
        this.chapterProgressRepository = chapterProgressRepository;
        this.exerciseResultRepository = exerciseResultRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Get comprehensive business analytics for admin dashboard.
     * PERFORMANCE: Cached for 1 hour to avoid expensive DB scans on every admin refresh.
     *
     * @param startDate start date for analysis period
     * @param endDate end date for analysis period
     * @return BusinessAnalyticsDTO with all key metrics
     */
    @Cacheable(value = "businessAnalytics", key = "#startDate + '_' + #endDate", unless = "#result == null")
    public BusinessAnalyticsDTO getBusinessAnalytics(Instant startDate, Instant endDate) {
        LOG.debug("Calculating business analytics from {} to {}", startDate, endDate);

        BusinessAnalyticsDTO analytics = new BusinessAnalyticsDTO();

        // Calculate DAU/WAU/MAU
        analytics.setDau(calculateDAU());
        analytics.setWau(calculateWAU());
        analytics.setMau(calculateMAU());

        // Calculate Retention Rates
        analytics.setRetentionDay1(calculateRetentionRate(1));
        analytics.setRetentionDay7(calculateRetentionRate(7));
        analytics.setRetentionDay30(calculateRetentionRate(30));

        // Calculate Engagement Metrics
        analytics.setAvgSessionDuration(calculateAvgSessionDuration(startDate, endDate));
        analytics.setCompletionRate(calculateCompletionRate());
        analytics.setChurnRate(calculateChurnRate());

        // Get User Engagement Trend
        analytics.setUserEngagementData(getUserEngagementTrend(startDate, endDate));

        // Get Chapter Performance
        analytics.setChapterPerformance(getChapterPerformance());

        return analytics;
    }

    /**
     * Calculate Daily Active Users (users active in last 24 hours).
     */
    private Integer calculateDAU() {
        Instant yesterday = Instant.now().minus(1, ChronoUnit.DAYS);
        return studySessionRepository.countDistinctUsersBySessionDateAfter(yesterday);
    }

    /**
     * Calculate Weekly Active Users (users active in last 7 days).
     */
    private Integer calculateWAU() {
        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        return studySessionRepository.countDistinctUsersBySessionDateAfter(weekAgo);
    }

    /**
     * Calculate Monthly Active Users (users active in last 30 days).
     */
    private Integer calculateMAU() {
        Instant monthAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        return studySessionRepository.countDistinctUsersBySessionDateAfter(monthAgo);
    }

    /**
     * Calculate Retention Rate for specific day (e.g., Day 1, Day 7, Day 30).
     * Definition: % of users who return on Day N after registration.
     *
     * @param dayN the day to check (1, 7, or 30)
     * @return retention rate as percentage
     */
    private Double calculateRetentionRate(int dayN) {
        // Get users registered N days ago
        LocalDate targetDate = LocalDate.now().minusDays(dayN);
        Instant startOfDay = targetDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = targetDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        Long usersRegistered = appUserRepository.countByCreatedDateBetween(startOfDay, endOfDay);

        if (usersRegistered == 0) {
            return 0.0;
        }

        // Count how many of those users were active today
        Instant today = Instant.now();
        Long usersActiveToday = studySessionRepository.countDistinctUsersRegisteredBetweenAndActiveAfter(
            startOfDay,
            endOfDay,
            today.minus(1, ChronoUnit.DAYS)
        );

        return (usersActiveToday.doubleValue() / usersRegistered.doubleValue()) * 100;
    }

    /**
     * Calculate average session duration in minutes.
     * PERFORMANCE: Uses native SQL aggregation in database, not Java loops.
     */
    private Double calculateAvgSessionDuration(Instant startDate, Instant endDate) {
        Double avgSeconds = studySessionRepository.findAvgDurationByDateRangeNative(startDate, endDate);
        return avgSeconds != null ? avgSeconds / 60.0 : 0.0; // Convert to minutes
    }

    /**
     * Calculate course completion rate.
     * Definition: % of users who completed at least one book.
     */
    private Double calculateCompletionRate() {
        Long totalUsers = appUserRepository.count();
        if (totalUsers == 0) {
            return 0.0;
        }

        Long usersWithCompletions = chapterProgressRepository.countDistinctUsersWithCompletedChapters();
        return (usersWithCompletions.doubleValue() / totalUsers.doubleValue()) * 100;
    }

    /**
     * Calculate churn rate.
     * Definition: % of users who haven't been active in the last 30 days.
     */
    private Double calculateChurnRate() {
        Long totalUsers = appUserRepository.count();
        if (totalUsers == 0) {
            return 0.0;
        }

        Integer mau = calculateMAU();
        Long churnedUsers = totalUsers - mau;

        return (churnedUsers.doubleValue() / totalUsers.doubleValue()) * 100;
    }

    /**
     * Get user engagement trend for the specified period.
     */
    private List<UserEngagementDTO> getUserEngagementTrend(Instant startDate, Instant endDate) {
        List<UserEngagementDTO> trend = new ArrayList<>();

        LocalDate start = startDate.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate end = endDate.atZone(ZoneId.systemDefault()).toLocalDate();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            Instant dayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant dayEnd = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            Integer activeUsers = studySessionRepository.countDistinctUsersBySessionDateBetween(dayStart, dayEnd);
            Integer newUsers = appUserRepository.countByCreatedDateBetween(dayStart, dayEnd).intValue();

            UserEngagementDTO engagement = new UserEngagementDTO();
            engagement.setDate(date.toString());
            engagement.setActiveUsers(activeUsers);
            engagement.setNewUsers(newUsers);
            engagement.setReturningUsers(activeUsers - newUsers);

            trend.add(engagement);
        }

        return trend;
    }

    /**
     * Get performance metrics for each chapter.
     */
    private List<ChapterPerformanceDTO> getChapterPerformance() {
        List<Object[]> results = chapterProgressRepository.findChapterPerformanceStats();
        List<ChapterPerformanceDTO> performance = new ArrayList<>();

        for (Object[] row : results) {
            ChapterPerformanceDTO dto = new ChapterPerformanceDTO();
            dto.setChapterId((Long) row[0]);
            dto.setChapterName((String) row[1]);
            dto.setCompletions(((Number) row[2]).intValue());
            dto.setAvgScore(((Number) row[3]).doubleValue());
            dto.setDropoffRate(((Number) row[4]).doubleValue());

            performance.add(dto);
        }

        return performance;
    }
}
