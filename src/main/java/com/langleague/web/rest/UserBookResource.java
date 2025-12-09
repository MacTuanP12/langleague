package com.langleague.web.rest;

import com.langleague.domain.enumeration.LearningStatus;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.UserBookService;
import com.langleague.service.dto.BookProgressDTO;
import com.langleague.service.dto.UserBookDTO;
import com.langleague.service.dto.UserBookStatisticsDTO;
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
 * REST controller for user's book library
 */
@Tag(name = "My Books (User)", description = "User manages their book library")
@RestController
@RequestMapping("/api/user/my-books")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.USER + "\")")
public class UserBookResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserBookResource.class);
    private static final String ENTITY_NAME = "userBook";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserBookService userBookService;

    public UserBookResource(UserBookService userBookService) {
        this.userBookService = userBookService;
    }

    /**
     * GET /api/user/my-books : Get all saved books
     *
     * @return the ResponseEntity with status 200 (OK) and list of books
     */
    @GetMapping
    public ResponseEntity<List<UserBookDTO>> getMyBooks() {
        LOG.debug("REST request to get my books");
        List<UserBookDTO> books = userBookService.getMyBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * GET /api/user/my-books/favorites : Get favorite books
     *
     * @return the ResponseEntity with status 200 (OK) and list of favorite books
     */
    @GetMapping("/favorites")
    public ResponseEntity<List<UserBookDTO>> getFavoriteBooks() {
        LOG.debug("REST request to get favorite books");
        List<UserBookDTO> books = userBookService.getMyFavoriteBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * GET /api/user/my-books/status/:status : Get books by status
     *
     * @param status the learning status
     * @return the ResponseEntity with status 200 (OK) and list of books
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserBookDTO>> getBooksByStatus(@PathVariable LearningStatus status) {
        LOG.debug("REST request to get books by status: {}", status);
        List<UserBookDTO> books = userBookService.getBooksByStatus(status);
        return ResponseEntity.ok(books);
    }

    /**
     * GET /api/user/my-books/statistics : Get statistics
     *
     * @return the ResponseEntity with status 200 (OK) and statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<UserBookStatisticsDTO> getStatistics() {
        LOG.debug("REST request to get book statistics");
        UserBookStatisticsDTO stats = userBookService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * POST /api/user/my-books/:bookId : Save a book to library
     *
     * @param bookId the ID of the book to save
     * @return the ResponseEntity with status 201 (Created) and the saved book
     */
    @PostMapping("/{bookId}")
    public ResponseEntity<UserBookDTO> saveBook(@PathVariable Long bookId) {
        LOG.debug("REST request to save book: {}", bookId);

        try {
            UserBookDTO result = userBookService.saveBook(bookId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .headers(HeaderUtil.createAlert(applicationName, "Book added to your library", ENTITY_NAME))
                .body(result);
        } catch (Exception e) {
            LOG.error("Error saving book: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "savefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * DELETE /api/user/my-books/:bookId : Remove a book from library
     *
     * @param bookId the ID of the book to remove
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> removeBook(@PathVariable Long bookId) {
        LOG.debug("REST request to remove book: {}", bookId);

        try {
            userBookService.removeBook(bookId);
            return ResponseEntity.noContent()
                .headers(HeaderUtil.createAlert(applicationName, "Book removed from your library", ENTITY_NAME))
                .build();
        } catch (Exception e) {
            LOG.error("Error removing book: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "removefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/my-books/:bookId/status : Update learning status
     *
     * @param bookId the ID of the book
     * @param request the status update request
     * @return the ResponseEntity with status 200 (OK) and updated book
     */
    @PutMapping("/{bookId}/status")
    public ResponseEntity<UserBookDTO> updateStatus(@PathVariable Long bookId, @Valid @RequestBody StatusUpdateRequest request) {
        LOG.debug("REST request to update status for book: {} to {}", bookId, request.getStatus());

        try {
            UserBookDTO result = userBookService.updateLearningStatus(bookId, request.getStatus());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error updating status: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "updatefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/my-books/:bookId/chapter : Update current chapter
     *
     * @param bookId the ID of the book
     * @param request the chapter update request
     * @return the ResponseEntity with status 200 (OK) and updated book
     */
    @PutMapping("/{bookId}/chapter")
    public ResponseEntity<UserBookDTO> updateCurrentChapter(@PathVariable Long bookId, @Valid @RequestBody ChapterUpdateRequest request) {
        LOG.debug("REST request to update current chapter for book: {} to {}", bookId, request.getChapterId());

        try {
            UserBookDTO result = userBookService.updateCurrentChapter(bookId, request.getChapterId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error updating chapter: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "updatefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/my-books/:bookId/progress : Update progress
     *
     * @param bookId the ID of the book
     * @param request the progress update request
     * @return the ResponseEntity with status 200 (OK) and updated book
     */
    @PutMapping("/{bookId}/progress")
    public ResponseEntity<UserBookDTO> updateProgress(@PathVariable Long bookId, @Valid @RequestBody ProgressUpdateRequest request) {
        LOG.debug("REST request to update progress for book: {} to {}%", bookId, request.getProgressPercentage());

        try {
            UserBookDTO result = userBookService.updateProgress(bookId, request.getProgressPercentage());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error updating progress: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "updatefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * PUT /api/user/my-books/:bookId/favorite : Toggle favorite status
     *
     * @param bookId the ID of the book
     * @return the ResponseEntity with status 200 (OK) and updated book
     */
    @PutMapping("/{bookId}/favorite")
    public ResponseEntity<UserBookDTO> toggleFavorite(@PathVariable Long bookId) {
        LOG.debug("REST request to toggle favorite for book: {}", bookId);

        try {
            UserBookDTO result = userBookService.toggleFavorite(bookId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LOG.error("Error toggling favorite: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "updatefailed", e.getMessage()))
                .build();
        }
    }

    /**
     * GET /api/user/my-books/:bookId/progress : Get detailed progress for a book
     *
     * @param bookId the ID of the book
     * @return the ResponseEntity with status 200 (OK) and book progress details
     */
    @GetMapping("/{bookId}/progress")
    public ResponseEntity<BookProgressDTO> getBookProgress(@PathVariable Long bookId) {
        LOG.debug("REST request to get progress for book: {}", bookId);

        try {
            BookProgressDTO progress = userBookService.getBookProgress(bookId);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            LOG.error("Runtime error getting book progress for book {}: {}", bookId, e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "progressfailed", e.getMessage()))
                .build();
        } catch (Exception e) {
            LOG.error("Error getting book progress for book {}: {}", bookId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "progressfailed", e.getMessage()))
                .build();
        }
    }

    // Request DTOs

    public static class StatusUpdateRequest {

        private LearningStatus status;

        public LearningStatus getStatus() {
            return status;
        }

        public void setStatus(LearningStatus status) {
            this.status = status;
        }
    }

    public static class ChapterUpdateRequest {

        private Long chapterId;

        public Long getChapterId() {
            return chapterId;
        }

        public void setChapterId(Long chapterId) {
            this.chapterId = chapterId;
        }
    }

    public static class ProgressUpdateRequest {

        private Double progressPercentage;

        public Double getProgressPercentage() {
            return progressPercentage;
        }

        public void setProgressPercentage(Double progressPercentage) {
            this.progressPercentage = progressPercentage;
        }
    }
}
