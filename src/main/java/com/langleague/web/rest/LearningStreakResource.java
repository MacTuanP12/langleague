package com.langleague.web.rest;

import com.langleague.service.LearningStreakService;
import com.langleague.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link com.langleague.domain.LearningStreak}.
 */
@RestController
@RequestMapping("/api/learning-streaks")
public class LearningStreakResource {

    private static final Logger LOG = LoggerFactory.getLogger(LearningStreakResource.class);

    private static final String ENTITY_NAME = "learningStreak";

    private final LearningStreakService learningStreakService;

    public LearningStreakResource(LearningStreakService learningStreakService) {
        this.learningStreakService = learningStreakService;
    }

    /**
     * {@code GET  /learning-streaks/current} : Get current learning streak for the logged-in user.
     * Use case 39: Track learning streak
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the current streak count in body.
     */
    @GetMapping("/current")
    public ResponseEntity<Integer> getCurrentStreak() {
        LOG.debug("REST request to get current learning streak");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        Integer currentStreak = learningStreakService.getCurrentStreak(userLogin);
        return ResponseEntity.ok().body(currentStreak);
    }

    /**
     * {@code GET  /learning-streaks/longest} : Get longest learning streak for the logged-in user.
     * Use case 39: Track learning streak
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the longest streak count in body.
     */
    @GetMapping("/longest")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getLongestStreak() {
        LOG.debug("REST request to get longest learning streak");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        Integer longestStreak = learningStreakService.getLongestStreak(userLogin);
        return ResponseEntity.ok().body(longestStreak);
    }

    /**
     * {@code POST  /learning-streaks/record} : Record a study activity for the logged-in user.
     * Use case 39: Track learning streak
     * OPTIMIZED: Accepts timezone from client via header X-Timezone
     *
     * @param timezone Optional timezone (e.g., "Asia/Ho_Chi_Minh"). Defaults to UTC if not provided.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PostMapping("/record")
    public ResponseEntity<Void> recordStudyActivity(
        @RequestHeader(value = "X-Timezone", required = false, defaultValue = "UTC") String timezone
    ) {
        LOG.debug("REST request to record study activity with timezone: {}", timezone);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        try {
            java.time.ZoneId zoneId = java.time.ZoneId.of(timezone);
            learningStreakService.recordStudyActivity(userLogin, zoneId);
        } catch (java.time.DateTimeException e) {
            LOG.warn("Invalid timezone provided: {}, falling back to UTC", timezone);
            learningStreakService.recordStudyActivity(userLogin, java.time.ZoneId.of("UTC"));
        }

        return ResponseEntity.ok().build();
    }
}
