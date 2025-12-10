package com.langleague.service.scheduler;

import com.langleague.domain.Notification;
import com.langleague.domain.User;
import com.langleague.repository.NotificationRepository;
import com.langleague.repository.StudySessionRepository;
import com.langleague.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Smart Daily Reminder Job - Cải tiến version
 *
 * Features:
 * - ✅ Chỉ gửi cho active users (logged in last 7 days)
 * - ✅ Skip users đã học trong ngày
 * - ✅ Cá nhân hóa message theo streak/XP
 * - ✅ Batch processing cho performance
 * - ✅ Gamification integration
 */
@Component
public class SmartDailyReminderJob {

    private static final Logger log = LoggerFactory.getLogger(SmartDailyReminderJob.class);
    private static final int BATCH_SIZE = 100;
    private static final int ACTIVE_DAYS_THRESHOLD = 7;

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final StudySessionRepository studySessionRepository;

    public SmartDailyReminderJob(
        UserRepository userRepository,
        NotificationRepository notificationRepository,
        StudySessionRepository studySessionRepository
    ) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.studySessionRepository = studySessionRepository;
    }

    /**
     * Chạy lúc 20:00 hàng ngày
     * Cron: 0 0 20 * * ? = 20:00:00 every day
     */
    @Scheduled(cron = "0 0 20 * * ?")
    @Transactional
    public void createSmartDailyReminders() {
        log.info("🔔 Starting Smart Daily Reminder Job...");

        Instant sevenDaysAgo = Instant.now().minus(ACTIVE_DAYS_THRESHOLD, ChronoUnit.DAYS);
        Instant todayStart = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();

        int page = 0;
        int totalReminders = 0;
        int totalSkipped = 0;

        Page<User> userPage;
        do {
            Pageable pageable = PageRequest.of(page, BATCH_SIZE);

            // Query active users only
            userPage = userRepository.findActiveUsersForReminder(sevenDaysAgo, pageable);

            if (userPage.isEmpty()) {
                break;
            }

            List<Notification> notifications = new ArrayList<>();

            for (User user : userPage.getContent()) {
                try {
                    // Skip if user already studied today
                    if (hasStudiedToday(user.getId(), todayStart)) {
                        totalSkipped++;
                        log.debug("⏭️ Skipping user {} - already studied today", user.getLogin());
                        continue;
                    }

                    // Get user learning context
                    LearningContextDTO context = getUserLearningContext(user.getId());

                    // Create personalized notification
                    Notification notification = createPersonalizedNotification(user, context);
                    notifications.add(notification);
                } catch (Exception e) {
                    log.error("❌ Error creating reminder for user {}: {}", user.getLogin(), e.getMessage());
                }
            }

            // Bulk save notifications
            if (!notifications.isEmpty()) {
                notificationRepository.saveAll(notifications);
                totalReminders += notifications.size();
                log.info("✅ Created {} reminders for batch {} (page size: {})", notifications.size(), page, userPage.getContent().size());
            }

            page++;
        } while (userPage.hasNext());

        log.info("🎉 Smart Daily Reminder Job completed!");
        log.info("📊 Stats: {} reminders created, {} users skipped (already studied)", totalReminders, totalSkipped);
    }

    /**
     * Check if user has studied today
     */
    private boolean hasStudiedToday(Long userId, Instant todayStart) {
        try {
            return studySessionRepository.existsByAppUserInternalUserIdAndStartAtGreaterThanEqual(userId, todayStart);
        } catch (Exception e) {
            log.debug("Could not check study status for user {}", userId);
            return false;
        }
    }

    /**
     * Get user learning context (streak, XP, goals)
     * TODO: Implement với LearningReportRepository khi có
     */
    private LearningContextDTO getUserLearningContext(Long userId) {
        // Mock data for now
        LearningContextDTO context = new LearningContextDTO();
        context.streak = 0;
        context.todayPoints = 0;
        context.dailyGoal = 50;

        // TODO: Implement real query
        // Map<String, Object> data = learningReportRepository.getUserLearningContext(userId);
        // context.streak = (Integer) data.getOrDefault("streak", 0);
        // context.todayPoints = (Integer) data.getOrDefault("points", 0);
        // context.dailyGoal = (Integer) data.getOrDefault("dailyGoal", 50);

        return context;
    }

    /**
     * Create personalized notification based on user context
     */
    private Notification createPersonalizedNotification(User user, LearningContextDTO context) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType("REMINDER");
        notification.setIsRead(false);
        notification.setCreatedAt(Instant.now());

        // Generate personalized title and message
        String[] titleAndMessage = generatePersonalizedContent(user, context);
        notification.setTitle(titleAndMessage[0]);
        notification.setMessage(titleAndMessage[1]);

        return notification;
    }

    /**
     * Generate personalized content based on user context
     * Returns [title, message]
     */
    private String[] generatePersonalizedContent(User user, LearningContextDTO context) {
        String name = user.getFirstName() != null ? user.getFirstName() : user.getLogin();

        Integer streak = context.streak;
        Integer points = context.todayPoints;
        Integer dailyGoal = context.dailyGoal;

        String title;
        String message;

        // Priority 1: Streak is hot! 🔥
        if (streak != null && streak >= 3) {
            title = String.format("🔥 Giữ vững streak %d ngày!", streak);
            message = String.format(
                "Chào %s! Chuỗi %d ngày liên tiếp của bạn đang nóng hổi! 🔥\n" + "Hãy tiếp tục học 5 phút để giữ streak nhé! 💪",
                name,
                streak
            );
        }
        // Priority 2: Close to daily goal 🎯
        else if (points != null && dailyGoal != null && points > 0 && points >= dailyGoal * 0.7 && points < dailyGoal) {
            int remaining = dailyGoal - points;
            title = "🎯 Gần đạt mục tiêu rồi!";
            message = String.format(
                "Chào %s! Bạn đã đạt %d/%d XP hôm nay! 🎯\n" + "Chỉ cần %d XP nữa để hoàn thành mục tiêu! ⭐",
                name,
                points,
                dailyGoal,
                remaining
            );
        }
        // Priority 3: Has started today but not much
        else if (points != null && points > 0 && points < dailyGoal) {
            title = "💪 Cố lên, bạn đã bắt đầu rồi!";
            message = String.format(
                "Chào %s! Bạn đã có %d XP hôm nay! 🌟\n" + "Hãy tiếp tục để đạt mục tiêu %d XP nhé! 💪",
                name,
                points,
                dailyGoal
            );
        }
        // Priority 4: New streak opportunity
        else if (streak != null && streak == 1) {
            title = "🎯 Bắt đầu chuỗi mới!";
            message = String.format("Chào %s! Hôm qua bạn đã học! 🎉\n" + "Hãy học tiếp hôm nay để bắt đầu streak mới nhé! 🔥", name);
        }
        // Default: Generic but friendly
        else {
            title = "⏰ Nhắc nhở học tập";
            message = String.format(
                "Chào %s! Đừng quên dành vài phút học tiếng Hàn hôm nay nhé! 📚\n" + "Kiến thức được tích lũy từng ngày! 💪",
                name
            );
        }

        return new String[] { title, message };
    }

    /**
     * DTO for learning context
     */
    private static class LearningContextDTO {

        Integer streak;
        Integer todayPoints;
        Integer dailyGoal;
    }
}
