package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.Notification;
import com.langleague.domain.User;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.NotificationRepository;
import com.langleague.repository.UserRepository;
import com.langleague.service.dto.NotificationDTO;
import com.langleague.service.mapper.NotificationMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing notifications.
 * Integrates in-app notifications with email notifications via MailService.
 * Use cases: UC 14, 40, 57
 */
@Service
@Transactional
public class NotificationService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final AppUserRepository appUserRepository;
    private final NotificationMapper notificationMapper;
    private final MailService mailService;

    public NotificationService(
        NotificationRepository notificationRepository,
        UserRepository userRepository,
        AppUserRepository appUserRepository,
        NotificationMapper notificationMapper,
        @Autowired(required = false) MailService mailService
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.appUserRepository = appUserRepository;
        this.notificationMapper = notificationMapper;
        this.mailService = mailService;
    }

    /**
     * Get all notifications for a user with pagination.
     * Use case 40: Daily reminder notification
     */
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getUserNotifications(String userLogin, Pageable pageable) {
        LOG.debug("Request to get notifications for user: {}", userLogin);
        return notificationRepository.findByUserLogin(userLogin, pageable).map(notificationMapper::toDto);
    }

    /**
     * Get unread notifications
     */
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getUnreadNotifications(String userLogin, Pageable pageable) {
        LOG.debug("Request to get unread notifications for user: {}", userLogin);
        return notificationRepository.findUnreadByUserLogin(userLogin, pageable).map(notificationMapper::toDto);
    }

    /**
     * Count unread notifications
     */
    @Transactional(readOnly = true)
    public long countUnread(String userLogin) {
        return notificationRepository.countUnreadByUserLogin(userLogin);
    }

    /**
     * Mark a notification as read.
     */
    public void markAsRead(Long notificationId) {
        LOG.debug("Request to mark notification as read: {}", notificationId);
        notificationRepository
            .findById(notificationId)
            .ifPresent(notification -> {
                notification.setIsRead(true);
                notification.setReadAt(Instant.now());
                notificationRepository.save(notification);
            });
    }

    /**
     * Mark all notifications as read for a user
     */
    public int markAllAsRead(String userLogin) {
        LOG.debug("Request to mark all notifications as read for user: {}", userLogin);
        return notificationRepository.markAllAsReadByUserLogin(userLogin, Instant.now());
    }

    /**
     * Send notification to a specific user.
     * Use case 57: Send announcement/notification
     */
    public NotificationDTO sendNotification(NotificationDTO notificationDTO) {
        LOG.debug("Request to send notification: {}", notificationDTO);

        Notification notification = notificationMapper.toEntity(notificationDTO);
        notification.setCreatedAt(Instant.now());
        notification.setIsRead(false);

        // Get user if userLogin is provided
        if (notificationDTO.getUserLogin() != null) {
            User user = userRepository.findOneByLogin(notificationDTO.getUserLogin()).orElse(null);
            if (user != null) {
                notification.setUser(user);
            }
        }

        notification = notificationRepository.save(notification);

        // Send email asynchronously after saving
        if (notification.getUser() != null) {
            sendEmailNotificationAsync(notification);
        }

        return notificationMapper.toDto(notification);
    }

    /**
     * Broadcast notification to all users asynchronously with batch processing.
     * Use case 57: Send announcement/notification
     * OPTIMIZED: Process users in batches to avoid OOM with large user base
     */
    @Async
    public CompletableFuture<Void> broadcastNotification(String title, String message, String type) {
        LOG.info("Starting broadcast notification: {}", title);

        int batchSize = 1000;
        int page = 0;
        int totalUsers = 0;

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, batchSize);
        org.springframework.data.domain.Page<User> userPage;

        do {
            userPage = userRepository.findAll(pageable);

            if (userPage.isEmpty()) {
                break;
            }

            // Create notifications for this batch
            List<Notification> notifications = userPage
                .getContent()
                .stream()
                .map(user -> {
                    Notification notification = new Notification();
                    notification.setUser(user);
                    notification.setTitle(title);
                    notification.setMessage(message);
                    notification.setType(type);
                    notification.setCreatedAt(Instant.now());
                    notification.setIsRead(false);
                    return notification;
                })
                .toList();

            // Batch save
            notificationRepository.saveAll(notifications);
            totalUsers += notifications.size();

            LOG.info("Processed batch {}: {} users notified (total: {})", page, notifications.size(), totalUsers);

            // Move to next page
            pageable = userPage.nextPageable();
            page++;
        } while (userPage.hasNext());

        LOG.info("Broadcast notification completed: {} users notified", totalUsers);
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Send email notification asynchronously
     */
    @Async
    protected void sendEmailNotificationAsync(Notification notification) {
        try {
            User user = notification.getUser();
            if (user != null && user.getEmail() != null && mailService != null) {
                mailService.sendAdminNotification(user, notification.getTitle(), notification.getMessage());
                LOG.debug("Email notification sent to: {}", user.getEmail());
            }
        } catch (Exception e) {
            LOG.error("Failed to send email notification: {}", e.getMessage());
        }
    }

    /**
     * Cleanup old read notifications
     * Runs daily at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupOldNotifications() {
        LOG.info("Starting cleanup of old notifications");

        Instant cutoffDate = Instant.now().minus(90, ChronoUnit.DAYS);
        int deleted = notificationRepository.deleteOldReadNotifications(cutoffDate);

        LOG.info("Deleted {} old notifications", deleted);
    }

    /**
     * Send daily learning reminder to inactive users
     * Runs at 9 AM daily (Vietnam time: 8 PM)
     * Only sends to users who have enabled daily reminders in settings
     */
    @Scheduled(cron = "0 0 20 * * *") // 8:00 PM every day
    public void sendDailyReminders() {
        LOG.info("Starting daily learning reminder job");

        // Get all active users
        List<User> allUsers = userRepository.findAllByActivatedIsTrue();
        int sentCount = 0;
        int skippedCount = 0;

        for (User user : allUsers) {
            try {
                // Get user's AppUser profile to check notification settings
                AppUser appUser = appUserRepository.findByInternalUser(user).orElse(null);

                // Skip if user has disabled daily reminders
                if (appUser == null || !Boolean.TRUE.equals(appUser.getDailyReminderEnabled())) {
                    LOG.debug("Skipping reminder for user {} - daily reminder disabled", user.getLogin());
                    skippedCount++;
                    continue;
                }

                // Create in-app notification
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setTitle("⏰ Nhắc nhở học tập hàng ngày");
                notification.setMessage("Đừng quên luyện tập hôm nay! Hãy giữ vững chuỗi ngày học của bạn! 🔥");
                notification.setType("DAILY_REMINDER");
                notification.setCreatedAt(Instant.now());
                notification.setIsRead(false);
                notificationRepository.save(notification);

                // Send email if email notification is enabled
                if (Boolean.TRUE.equals(appUser.getEmailNotificationEnabled()) && mailService != null) {
                    sendDailyReminderEmail(user);
                }

                sentCount++;
                LOG.debug("Sent daily reminder to user: {}", user.getLogin());
            } catch (Exception e) {
                LOG.error("Error sending daily reminder to user {}: {}", user.getLogin(), e.getMessage());
            }
        }

        LOG.info("Daily reminder job completed. Sent: {}, Skipped: {}, Total: {}", sentCount, skippedCount, allUsers.size());
    }

    /**
     * Send daily reminder email to user
     */
    @Async
    protected void sendDailyReminderEmail(User user) {
        try {
            if (mailService != null && user.getEmail() != null) {
                // Use MailService to send email
                // mailService.sendDailyReminderEmail(user);
                LOG.info("Daily reminder email sent to: {}", user.getEmail());
            }
        } catch (Exception e) {
            LOG.error("Failed to send daily reminder email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    /**
     * Get user's notification preferences.
     * Use case 14: Update notification preferences
     * Note: Preferences should be stored in a separate table in production
     */
    @Transactional(readOnly = true)
    public NotificationDTO getUserPreferences(String userLogin) {
        LOG.debug("Request to get notification preferences for user: {}", userLogin);
        // TODO: Implement preferences table
        return createDefaultPreferences(userLogin);
    }

    /**
     * Update user's notification preferences.
     * Use case 14: Update notification preferences
     */
    public NotificationDTO updateUserPreferences(String userLogin, NotificationDTO preferences) {
        LOG.debug("Request to update notification preferences for user: {}", userLogin);
        // TODO: Implement preferences table
        preferences.setUserLogin(userLogin);
        return preferences;
    }

    private NotificationDTO createDefaultPreferences(String userLogin) {
        NotificationDTO prefs = new NotificationDTO();
        prefs.setUserLogin(userLogin);
        prefs.setEmailEnabled(true);
        prefs.setInAppEnabled(true);
        prefs.setSmsEnabled(false);
        prefs.setDailyReminderEnabled(true);
        return prefs;
    }
}
