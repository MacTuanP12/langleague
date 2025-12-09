package com.langleague.web.rest;

import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.BulkOperationService;
import com.langleague.service.dto.*;
import com.langleague.web.rest.vm.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for bulk operations on entities.
 * Allows batch creation, update, and deletion for efficiency.
 * Use cases: UC 62 (Bulk upload content), Admin management
 */
@Tag(name = "Bulk Operations", description = "Batch operations for efficient data management")
@RestController
@RequestMapping("/api/bulk")
@PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
public class BulkOperationResource {

    private static final Logger LOG = LoggerFactory.getLogger(BulkOperationResource.class);

    private final BulkOperationService bulkOperationService;

    public BulkOperationResource(BulkOperationService bulkOperationService) {
        this.bulkOperationService = bulkOperationService;
    }

    /**
     * {@code POST  /bulk/words} : Create multiple words at once.
     *
     * @param words the list of words to create.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PostMapping("/words")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkCreateWords(@Valid @RequestBody List<WordDTO> words) {
        LOG.debug("REST request to bulk create {} words", words.size());

        Map<String, Object> result = bulkOperationService.bulkCreateWords(words);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk word creation completed"));
    }

    /**
     * {@code POST  /bulk/grammars} : Create multiple grammar rules at once.
     *
     * @param grammars the list of grammars to create.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PostMapping("/grammars")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkCreateGrammars(@Valid @RequestBody List<GrammarDTO> grammars) {
        LOG.debug("REST request to bulk create {} grammars", grammars.size());

        Map<String, Object> result = bulkOperationService.bulkCreateGrammars(grammars);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk grammar creation completed"));
    }

    /**
     * {@code POST  /bulk/exercises/listening} : Create multiple listening exercises at once.
     *
     * @param exercises the list of exercises to create.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PostMapping("/exercises/listening")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkCreateListeningExercises(
        @Valid @RequestBody List<ListeningExerciseDTO> exercises
    ) {
        LOG.debug("REST request to bulk create {} listening exercises", exercises.size());

        Map<String, Object> result = bulkOperationService.bulkCreateListeningExercises(exercises);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk listening exercise creation completed"));
    }

    /**
     * {@code POST  /bulk/exercises/reading} : Create multiple reading exercises at once.
     *
     * @param exercises the list of exercises to create.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PostMapping("/exercises/reading")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkCreateReadingExercises(
        @Valid @RequestBody List<ReadingExerciseDTO> exercises
    ) {
        LOG.debug("REST request to bulk create {} reading exercises", exercises.size());

        Map<String, Object> result = bulkOperationService.bulkCreateReadingExercises(exercises);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk reading exercise creation completed"));
    }

    /**
     * {@code DELETE  /bulk/words} : Delete multiple words at once.
     *
     * @param wordIds the list of word IDs to delete.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @DeleteMapping("/words")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkDeleteWords(@RequestBody List<Long> wordIds) {
        LOG.debug("REST request to bulk delete {} words", wordIds.size());

        Map<String, Object> result = bulkOperationService.bulkDeleteWords(wordIds);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk word deletion completed"));
    }

    /**
     * {@code DELETE  /bulk/chapters} : Delete multiple chapters at once.
     *
     * @param chapterIds the list of chapter IDs to delete.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @DeleteMapping("/chapters")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkDeleteChapters(@RequestBody List<Long> chapterIds) {
        LOG.debug("REST request to bulk delete {} chapters", chapterIds.size());

        Map<String, Object> result = bulkOperationService.bulkDeleteChapters(chapterIds);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk chapter deletion completed"));
    }

    /**
     * {@code PUT  /bulk/words} : Update multiple words at once.
     *
     * @param words the list of words to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PutMapping("/words")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpdateWords(@Valid @RequestBody List<WordDTO> words) {
        LOG.debug("REST request to bulk update {} words", words.size());

        Map<String, Object> result = bulkOperationService.bulkUpdateWords(words);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk word update completed"));
    }

    /**
     * {@code POST  /bulk/achievements/assign} : Assign achievement to multiple users.
     *
     * @param achievementId the achievement ID to assign.
     * @param userIds the list of user IDs.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PostMapping("/achievements/assign")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkAssignAchievement(
        @RequestParam Long achievementId,
        @RequestBody List<Long> userIds
    ) {
        LOG.debug("REST request to assign achievement {} to {} users", achievementId, userIds.size());

        Map<String, Object> result = bulkOperationService.bulkAssignAchievement(achievementId, userIds);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk achievement assignment completed"));
    }

    /**
     * {@code POST  /bulk/notifications/send} : Send notification to multiple users.
     *
     * @param notificationDTO the notification to send.
     * @param userLogins the list of user logins (empty for all users).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and result summary.
     */
    @PostMapping("/notifications/send")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkSendNotification(
        @RequestBody NotificationDTO notificationDTO,
        @RequestParam(required = false) List<String> userLogins
    ) {
        LOG.debug("REST request to send notification to {} users", userLogins == null ? "all" : userLogins.size());

        Map<String, Object> result = bulkOperationService.bulkSendNotification(notificationDTO, userLogins);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk notification sent"));
    }

    /**
     * {@code POST  /bulk/import/csv} : Import data from CSV file.
     *
     * @param entityType the type of entity to import (word, grammar, exercise).
     * @param csvData the CSV data as string.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and import summary.
     */
    @PostMapping("/import/csv")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importFromCsv(@RequestParam String entityType, @RequestBody String csvData) {
        LOG.debug("REST request to import {} from CSV", entityType);

        Map<String, Object> result = bulkOperationService.importFromCsv(entityType, csvData);
        return ResponseEntity.ok(ApiResponse.success(result, "CSV import completed"));
    }
}
