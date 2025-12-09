package com.langleague.web.rest;

import com.langleague.domain.enumeration.LearningStatus;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.UserChapterService;
import com.langleague.service.dto.UserChapterDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

/**
 * REST controller for user's saved chapters (My Chapters library)
 */
@Tag(name = "User Chapters", description = "User manages their chapter library")
@RestController
@RequestMapping("/api/user/saved-chapters")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.USER + "\")")
public class UserChapterResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserChapterResource.class);
    private static final String ENTITY_NAME = "userChapter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserChapterService userChapterService;

    public UserChapterResource(UserChapterService userChapterService) {
        this.userChapterService = userChapterService;
    }

    /**
     * GET /api/user/saved-chapters : Get all saved chapters
     *
     * @return the ResponseEntity with status 200 (OK) and list of chapters
     */
    @GetMapping
    public ResponseEntity<List<UserChapterDTO>> getMySavedChapters() {
        LOG.debug("REST request to get my saved chapters");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<UserChapterDTO> chapters = userChapterService.getMySavedChapters(userLogin);
        return ResponseEntity.ok(chapters);
    }

    /**
     * GET /api/user/saved-chapters/favorites : Get favorite chapters
     *
     * @return the ResponseEntity with status 200 (OK) and list of favorite chapters
     */
    @GetMapping("/favorites")
    public ResponseEntity<List<UserChapterDTO>> getFavoriteChapters() {
        LOG.debug("REST request to get favorite chapters");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<UserChapterDTO> chapters = userChapterService.getFavoriteChapters(userLogin);
        return ResponseEntity.ok(chapters);
    }

    /**
     * GET /api/user/saved-chapters/status/:status : Get chapters by status
     *
     * @param status the learning status
     * @return the ResponseEntity with status 200 (OK) and list of chapters
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserChapterDTO>> getChaptersByStatus(@PathVariable LearningStatus status) {
        LOG.debug("REST request to get chapters by status: {}", status);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<UserChapterDTO> chapters = userChapterService.getChaptersByStatus(userLogin, status);
        return ResponseEntity.ok(chapters);
    }

    /**
     * POST /api/user/saved-chapters/:chapterId : Save a chapter to library
     *
     * @param chapterId the ID of the chapter to save
     * @return the ResponseEntity with status 201 (Created)
     */
    @PostMapping("/{chapterId}")
    public ResponseEntity<UserChapterDTO> saveChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to save chapter: {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        try {
            // Check if already saved
            if (userChapterService.isChapterSaved(chapterId, userLogin)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "alreadysaved", "Chapter already saved"))
                    .build();
            }

            // Create new UserChapter
            UserChapterDTO dto = new UserChapterDTO();
            dto.setLearningStatus(LearningStatus.NOT_STARTED);
            dto.setIsFavorite(false);

            // Set chapter (simplified - you may need to fetch Chapter entity)
            com.langleague.service.dto.ChapterDTO chapterDTO = new com.langleague.service.dto.ChapterDTO();
            chapterDTO.setId(chapterId);
            dto.setChapter(chapterDTO);

            UserChapterDTO result = userChapterService.save(dto);

            return ResponseEntity.status(HttpStatus.CREATED)
                .headers(HeaderUtil.createAlert(applicationName, "Chapter saved to your library", ENTITY_NAME))
                .body(result);
        } catch (Exception e) {
            LOG.error("Error saving chapter: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "savefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * DELETE /api/user/saved-chapters/:chapterId : Remove a chapter from library
     *
     * @param chapterId the ID of the chapter to remove
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{chapterId}")
    public ResponseEntity<Void> removeChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to remove chapter: {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        try {
            userChapterService.removeChapter(chapterId, userLogin);
            return ResponseEntity.noContent()
                .headers(HeaderUtil.createAlert(applicationName, "Chapter removed from your library", ENTITY_NAME))
                .build();
        } catch (Exception e) {
            LOG.error("Error removing chapter: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "removefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/saved-chapters/:chapterId/favorite : Toggle favorite status
     *
     * @param chapterId the ID of the chapter
     * @return the ResponseEntity with status 200 (OK)
     */
    @PutMapping("/{chapterId}/favorite")
    public ResponseEntity<UserChapterDTO> toggleFavorite(@PathVariable Long chapterId) {
        LOG.debug("REST request to toggle favorite for chapter: {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        try {
            UserChapterDTO result = userChapterService.toggleFavorite(chapterId, userLogin);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error toggling favorite: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "togglefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/saved-chapters/:chapterId/notes : Update notes
     *
     * @param chapterId the ID of the chapter
     * @param request the notes request
     * @return the ResponseEntity with status 200 (OK)
     */
    @PutMapping("/{chapterId}/notes")
    public ResponseEntity<UserChapterDTO> updateNotes(@PathVariable Long chapterId, @Valid @RequestBody NotesRequest request) {
        LOG.debug("REST request to update notes for chapter: {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        try {
            UserChapterDTO result = userChapterService.updateNotes(chapterId, userLogin, request.getNotes());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error updating notes: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "updatefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/saved-chapters/:chapterId/tags : Update tags
     *
     * @param chapterId the ID of the chapter
     * @param request the tags request
     * @return the ResponseEntity with status 200 (OK)
     */
    @PutMapping("/{chapterId}/tags")
    public ResponseEntity<UserChapterDTO> updateTags(@PathVariable Long chapterId, @Valid @RequestBody TagsRequest request) {
        LOG.debug("REST request to update tags for chapter: {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        try {
            UserChapterDTO result = userChapterService.updateTags(chapterId, userLogin, request.getTags());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error updating tags: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "updatefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * GET /api/user/saved-chapters/:chapterId/is-saved : Check if chapter is saved
     *
     * @param chapterId the ID of the chapter
     * @return the ResponseEntity with status 200 (OK) and boolean
     */
    @GetMapping("/{chapterId}/is-saved")
    public ResponseEntity<Boolean> isChapterSaved(@PathVariable Long chapterId) {
        LOG.debug("REST request to check if chapter is saved: {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        boolean isSaved = userChapterService.isChapterSaved(chapterId, userLogin);
        return ResponseEntity.ok(isSaved);
    }

    // Request classes
    public static class NotesRequest {

        private String notes;

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    public static class TagsRequest {

        private String tags;

        public String getTags() {
            return tags;
        }

        public void setTags(String tags) {
            this.tags = tags;
        }
    }
}
