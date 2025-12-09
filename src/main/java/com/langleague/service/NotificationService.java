package com.langleague.service;

import com.langleague.domain.Notification;
import com.langleague.domain.User;
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
    private final NotificationMapper notificationMapper;
    private final MailService mailService;

    public NotificationService(
        NotificationRepository notificationRepository,
        UserRepository userRepository,
        NotificationMapper notificationMapper,
        @Autowired(required = false) MailService mailService
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
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
     * Runs at 9 AM daily
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyReminders() {
        LOG.info("Sending daily learning reminders");

        // Find all users (in production, filter by those who haven't studied today)
        List<User> users = userRepository.findAll();

        List<Notification> reminders = users
            .stream()
            .map(user -> {
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setTitle("Daily Learning Reminder");
                notification.setMessage("Don't forget to practice today! Keep your streak going!");
                notification.setType("LEARNING_REMINDER");
                notification.setCreatedAt(Instant.now());
                notification.setIsRead(false);
                return notification;
            })
            .toList();

        notificationRepository.saveAll(reminders);
        LOG.info("Sent reminders to {} users", users.size());
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
