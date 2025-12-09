package com.langleague.service;

import com.langleague.domain.enumeration.LearningStatus;
import com.langleague.repository.ChapterProgressRepository;
import com.langleague.repository.StudySessionRepository;
import com.langleague.repository.UserBookRepository;
import com.langleague.repository.UserRepository;
import com.langleague.service.dto.LearningReportDTO;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for generating learning reports and statistics.
 * Use cases: UC 26, 33, 41, 51-53
 */
@Service
@Transactional
public class LearningReportService {

    private static final Logger LOG = LoggerFactory.getLogger(LearningReportService.class);

    private final UserBookRepository userBookRepository;
    private final ChapterProgressRepository chapterProgressRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    public LearningReportService(
        UserBookRepository userBookRepository,
        ChapterProgressRepository chapterProgressRepository,
        StudySessionRepository studySessionRepository,
        UserRepository userRepository
    ) {
        this.userBookRepository = userBookRepository;
        this.chapterProgressRepository = chapterProgressRepository;
        this.studySessionRepository = studySessionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get comprehensive learning report for a user.
     * Use case 26: View learning progress
     * OPTIMIZED: Uses aggregation queries instead of fetching all entities
     */
    @Transactional(readOnly = true)
    public LearningReportDTO getUserLearningReport(String userLogin) {
        LOG.debug("Request to get learning report for user : {}", userLogin);

        return userRepository
            .findOneByLogin(userLogin)
            .map(user -> {
                LearningReportDTO report = new LearningReportDTO();
                report.setUserLogin(userLogin);
                report.setGeneratedAt(Instant.now());

                Long userId = user.getId();

                // OPTIMIZED: Use count queries with UserBook instead of BookProgress
                Long booksStarted = userBookRepository.countByAppUserId(userId);
                report.setTotalBooksStarted(booksStarted != null ? booksStarted.intValue() : 0);
                Long booksCompleted = userBookRepository.countByAppUserIdAndLearningStatus(userId, LearningStatus.COMPLETED);
                report.setTotalBooksCompleted(booksCompleted != null ? booksCompleted.intValue() : 0);

                report.setTotalChaptersStarted((int) chapterProgressRepository.countByUserId(userId));
                report.setTotalChaptersCompleted((int) chapterProgressRepository.countCompletedByUserId(userId));

                // Calculate average completion percentage
                Double avgPercent = chapterProgressRepository.getAverageProgressByUserId(userId);
                report.setAverageProgress(avgPercent != null ? avgPercent : 0.0);

                // Get study time statistics
                report.setTotalStudyMinutes((int) studySessionRepository.sumDurationMinutesByUserId(userId));
                report.setTotalStudySessions((int) studySessionRepository.countByUserId(userId));

                return report;
            })
            .orElse(new LearningReportDTO());
    }

    /**
     * Generate PDF report of user's learning progress.
     * Use case 33: Generate learning report
     */
    public byte[] generatePdfReport(String userLogin) {
        LOG.debug("Request to generate PDF report for user : {}", userLogin);

        LearningReportDTO report = getUserLearningReport(userLogin);

        // Simple PDF generation - in production, use iText or similar library
        String content = String.format(
            "Learning Report for %s\n\n" +
                "Books Started: %d\n" +
                "Books Completed: %d\n" +
                "Chapters Started: %d\n" +
                "Chapters Completed: %d\n" +
                "Average Progress: %.2f%%\n" +
                "Total Study Time: %d minutes\n" +
                "Total Sessions: %d\n",
            userLogin,
            report.getTotalBooksStarted(),
            report.getTotalBooksCompleted(),
            report.getTotalChaptersStarted(),
            report.getTotalChaptersCompleted(),
            report.getAverageProgress(),
            report.getTotalStudyMinutes(),
            report.getTotalStudySessions()
        );

        return content.getBytes();
    }

    /**
     * Get user's learning history timeline.
     * Use case 41: Learning history view
     */
    @Transactional(readOnly = true)
    public LearningReportDTO getUserLearningHistory(String userLogin) {
        LOG.debug("Request to get learning history for user : {}", userLogin);

        return userRepository
            .findOneByLogin(userLogin)
            .map(user -> {
                LearningReportDTO history = new LearningReportDTO();
                history.setUserLogin(userLogin);
                history.setGeneratedAt(Instant.now());

                // Get recent study sessions (last 30 days)
                Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
                List<com.langleague.domain.StudySession> recentSessions = studySessionRepository.findByUserIdAndStartAtAfter(
                    user.getId(),
                    thirtyDaysAgo
                );

                Map<String, Integer> dailyActivity = new HashMap<>();
                for (com.langleague.domain.StudySession session : recentSessions) {
                    String date = session.getStartAt().toString().substring(0, 10);
                    dailyActivity.merge(date, session.getDurationMinutes() != null ? session.getDurationMinutes() : 0, Integer::sum);
                }

                history.setDailyActivityMap(dailyActivity);
                history.setTotalStudySessions(recentSessions.size());

                return history;
            })
            .orElse(new LearningReportDTO());
    }

    /**
     * Get user visit statistics for admin.
     * Use case 51: View user visit reports
     * OPTIMIZED: Uses aggregation queries instead of loading all entities
     * TIMEZONE-AWARE: Uses Asia/Ho_Chi_Minh timezone for accurate "today" calculation
     */
    @Transactional(readOnly = true)
    public LearningReportDTO getUserVisitStatistics() {
        LOG.debug("Request to get user visit statistics");

        LearningReportDTO stats = new LearningReportDTO();
        stats.setGeneratedAt(Instant.now());

        // OPTIMIZED: Use count queries instead of fetching all
        stats.setTotalVisits((int) studySessionRepository.count());
        stats.setUniqueUsers((int) studySessionRepository.countDistinctUsers());

        // TIMEZONE FIX: Calculate start of day in Vietnam timezone (Asia/Ho_Chi_Minh)
        // Why: Instant.now().truncatedTo(DAYS) gives UTC 00:00, which is wrong for VN users
        // At 06:00 AM VN time (01/12), UTC is still 23:00 (30/11) - would count wrong day!
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        Instant startOfDay = LocalDate.now(vietnamZone).atStartOfDay(vietnamZone).toInstant();

        stats.setTodayVisits((int) studySessionRepository.countByStartAtAfter(startOfDay));

        return stats;
    }

    /**
     * Get completion statistics for admin.
     * Use case 52: View completion statistics
     */
    @Transactional(readOnly = true)
    public LearningReportDTO getCompletionStatistics() {
        LOG.debug("Request to get completion statistics");

        LearningReportDTO stats = new LearningReportDTO();
        stats.setGeneratedAt(Instant.now());

        // Book completion stats - using UserBook
        List<com.langleague.domain.UserBook> allUserBooks = userBookRepository.findAll();
        stats.setTotalBooksStarted(allUserBooks.size());
        stats.setTotalBooksCompleted(
            (int) allUserBooks
                .stream()
                .filter(ub -> ub.getLearningStatus() == LearningStatus.COMPLETED)
                .count()
        );

        // Chapter completion stats
        List<com.langleague.domain.ChapterProgress> allChapterProgress = chapterProgressRepository.findAll();
        stats.setTotalChaptersStarted(allChapterProgress.size());
        stats.setTotalChaptersCompleted(
            (int) allChapterProgress.stream().filter(com.langleague.domain.ChapterProgress::getCompleted).count()
        );

        // Calculate completion rate
        if (!allChapterProgress.isEmpty()) {
            double completionRate = (stats.getTotalChaptersCompleted() * 100.0) / allChapterProgress.size();
            stats.setAverageProgress(completionRate);
        }

        return stats;
    }

    /**
     * Get engagement statistics for admin.
     * Use case 53: View engagement statistics
     */
    @Transactional(readOnly = true)
    public LearningReportDTO getEngagementStatistics() {
        LOG.debug("Request to get engagement statistics");

        LearningReportDTO stats = new LearningReportDTO();
        stats.setGeneratedAt(Instant.now());

        // Study session stats
        List<com.langleague.domain.StudySession> allSessions = studySessionRepository.findAll();
        stats.setTotalStudySessions(allSessions.size());

        int totalMinutes = allSessions
            .stream()
            .mapToInt(s -> s.getDurationMinutes() != null ? s.getDurationMinutes() : 0)
            .sum();
        stats.setTotalStudyMinutes(totalMinutes);

        // Average session length
        if (!allSessions.isEmpty()) {
            stats.setAverageSessionMinutes(totalMinutes / allSessions.size());
        }

        // Get active users (studied in last 7 days)
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        long activeUsers = allSessions
            .stream()
            .filter(s -> s.getStartAt() != null && s.getStartAt().isAfter(sevenDaysAgo))
            .map(com.langleague.domain.StudySession::getAppUser)
            .filter(java.util.Objects::nonNull)
            .map(com.langleague.domain.AppUser::getId)
            .distinct()
            .count();
        stats.setActiveUsers((int) activeUsers);

        return stats;
    }

    /**
     * Get aggregated admin statistics for dashboard overview.
     * Combines user, completion, and engagement statistics.
     */
    @Transactional(readOnly = true)
    public LearningReportDTO getAdminStatistics() {
        LOG.debug("Request to get admin overview statistics");

        LearningReportDTO stats = new LearningReportDTO();
        stats.setGeneratedAt(Instant.now());

        // Get user statistics
        List<com.langleague.domain.User> allUsers = userRepository.findAll();
        stats.setTotalUsers(allUsers.size());

        // Fetch all sessions ONCE for reuse
        List<com.langleague.domain.StudySession> allSessions = studySessionRepository.findAll();

        // Active users (studied in last 7 days)
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        long activeUsers = allSessions
            .stream()
            .filter(s -> s.getStartAt() != null && s.getStartAt().isAfter(sevenDaysAgo))
            .map(com.langleague.domain.StudySession::getAppUser)
            .filter(java.util.Objects::nonNull)
            .map(com.langleague.domain.AppUser::getId)
            .distinct()
            .count();
        stats.setActiveUsers((int) activeUsers);

        // New users (registered in last 30 days)
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        long newUsers = allUsers
            .stream()
            .filter(u -> u.getCreatedDate() != null && u.getCreatedDate().isAfter(thirtyDaysAgo))
            .count();
        stats.setNewUsers((int) newUsers);

        // Total books and chapters - using UserBook
        List<com.langleague.domain.UserBook> allUserBooks = userBookRepository.findAll();
        List<com.langleague.domain.ChapterProgress> allChapterProgress = chapterProgressRepository.findAll();

        // Null-safe counting for books and chapters
        stats.setTotalBooksStarted(
            (int) allUserBooks
                .stream()
                .filter(ub -> ub.getBook() != null)
                .map(ub -> ub.getBook().getId())
                .distinct()
                .count()
        );
        stats.setTotalChaptersStarted(
            (int) allChapterProgress
                .stream()
                .filter(cp -> cp.getChapter() != null)
                .map(cp -> cp.getChapter().getId())
                .distinct()
                .count()
        );

        long completedBooks = allUserBooks
            .stream()
            .filter(ub -> ub.getLearningStatus() == LearningStatus.COMPLETED)
            .count();
        stats.setTotalBooksCompleted((int) completedBooks);

        long completedChapters = allChapterProgress
            .stream()
            .filter(cp -> cp.getCompleted() != null && cp.getCompleted())
            .count();
        stats.setTotalChaptersCompleted((int) completedChapters);

        // Study time stats (reuse allSessions)
        int totalMinutes = allSessions
            .stream()
            .mapToInt(s -> s.getDurationMinutes() != null ? s.getDurationMinutes() : 0)
            .sum();
        stats.setTotalStudyMinutes(totalMinutes);
        stats.setTotalStudySessions(allSessions.size());

        return stats;
    }
}
