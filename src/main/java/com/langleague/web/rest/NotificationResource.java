package com.langleague.web.rest;

import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.NotificationService;
import com.langleague.service.dto.NotificationDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;

/**
 * REST controller for managing Notifications.
 * Use case 40: Daily reminder notification
 * Use case 57: Send announcement/notification (Admin only)
 */
@Tag(name = "Notifications", description = "User notifications and announcements")
@RestController
@RequestMapping("/api/notifications")
public class NotificationResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationResource.class);
    private static final String ENTITY_NAME = "notification";

    private final NotificationService notificationService;

    public NotificationResource(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * {@code GET  /notifications} : get all notifications for current user.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notifications in body.
     */
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getUserNotifications(@RequestParam(required = false) String userLogin, Pageable pageable) {
        LOG.debug("REST request to get Notifications for user: {}", userLogin);
        Page<NotificationDTO> page = notificationService.getUserNotifications(userLogin, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /notifications/unread} : get unread notifications.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of unread notifications in body.
     */
    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationDTO>> getUnreadNotifications(
        @RequestParam(required = false) String userLogin,
        Pageable pageable
    ) {
        LOG.debug("REST request to get unread Notifications for user: {}", userLogin);
        Page<NotificationDTO> page = notificationService.getUnreadNotifications(userLogin, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /notifications/count-unread} : count unread notifications.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count-unread")
    public ResponseEntity<Long> countUnread(@RequestParam(required = false) String userLogin) {
        LOG.debug("REST request to count unread Notifications for user: {}", userLogin);
        long count = notificationService.countUnread(userLogin);
        return ResponseEntity.ok().body(count);
    }

    /**
     * {@code POST  /notifications} : Create a new notification (Admin only).
     * Use case 57: Send announcement/notification
     *
     * @param notificationDTO the notification to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new notification.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@Valid @RequestBody NotificationDTO notificationDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save Notification : {}", notificationDTO);
        if (notificationDTO.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        NotificationDTO result = notificationService.sendNotification(notificationDTO);
        return ResponseEntity.created(new URI("/api/notifications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("langleagueApp", true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /notifications/:id/read} : Mark a notification as read.
     *
     * @param id the id of the notification to mark as read.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        LOG.debug("REST request to mark Notification as read : {}", id);
        notificationService.markAsRead(id);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("langleagueApp", "Notification marked as read", id.toString())).build();
    }

    /**
     * {@code PUT  /notifications/mark-all-read} : Mark all notifications as read.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<Integer> markAllAsRead(@RequestParam(required = false) String userLogin) {
        LOG.debug("REST request to mark all Notifications as read for user: {}", userLogin);
        int count = notificationService.markAllAsRead(userLogin);
        return ResponseEntity.ok().body(count);
    }

    /**
     * {@code POST  /notifications/broadcast} : Broadcast notification to all users.
     *
     * @param title   the notification title.
     * @param message the notification message.
     * @param type    the notification type.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PostMapping("/broadcast")
    public ResponseEntity<Void> broadcastNotification(
        @RequestParam String title,
        @RequestParam String message,
        @RequestParam(required = false) String type
    ) {
        LOG.debug("REST request to broadcast Notification: {}", title);
        notificationService.broadcastNotification(title, message, type);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("langleagueApp", "Broadcast notification sent", null)).build();
    }
}
