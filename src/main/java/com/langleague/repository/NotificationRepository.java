package com.langleague.repository;

import com.langleague.domain.Notification;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Notification entity.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    /**
     * Find user's notifications with pagination
     */
    @Query("SELECT n FROM Notification n WHERE n.user.login = :login ORDER BY n.createdAt DESC")
    Page<Notification> findByUserLogin(@Param("login") String login, Pageable pageable);

    /**
     * Find unread notifications
     */
    @Query("SELECT n FROM Notification n WHERE n.user.login = :login AND n.isRead = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByUserLogin(@Param("login") String login, Pageable pageable);

    /**
     * Find by type
     */
    @Query("SELECT n FROM Notification n WHERE n.user.login = :login AND n.type = :type ORDER BY n.createdAt DESC")
    Page<Notification> findByUserLoginAndType(@Param("login") String login, @Param("type") String type, Pageable pageable);

    /**
     * Count unread
     */
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.login = :login AND n.isRead = false")
    long countUnreadByUserLogin(@Param("login") String login);

    /**
     * Mark all as read (batch update)
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.user.login = :login AND n.isRead = false")
    int markAllAsReadByUserLogin(@Param("login") String login, @Param("readAt") Instant readAt);

    /**
     * Delete old notifications (cleanup)
     */
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :cutoffDate")
    int deleteOldReadNotifications(@Param("cutoffDate") Instant cutoffDate);

    /**
     * Find recent notifications for multiple users (for broadcast)
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id IN :userIds AND n.createdAt > :since ORDER BY n.createdAt DESC")
    List<Notification> findRecentForUsers(@Param("userIds") List<Long> userIds, @Param("since") Instant since);
}
