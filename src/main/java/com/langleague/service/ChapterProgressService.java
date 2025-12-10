package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.Chapter;
import com.langleague.domain.ChapterProgress;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.ChapterProgressRepository;
import com.langleague.repository.ChapterRepository;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.MyChapterDTO;
import com.langleague.web.rest.errors.ResourceNotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.ChapterProgress}.
 * REFACTORED: This service now focuses on high-level business use cases rather than generic CRUD.
 */
@Service
@Transactional
public class ChapterProgressService {

    private static final Logger LOG = LoggerFactory.getLogger(ChapterProgressService.class);

    private final ChapterProgressRepository chapterProgressRepository;
    private final AppUserRepository appUserRepository;
    private final ChapterRepository chapterRepository;

    public ChapterProgressService(
        ChapterProgressRepository chapterProgressRepository,
        AppUserRepository appUserRepository,
        ChapterRepository chapterRepository
    ) {
        this.chapterProgressRepository = chapterProgressRepository;
        this.appUserRepository = appUserRepository;
        this.chapterRepository = chapterRepository;
    }

    /**
     * Mark chapter as completed for a user.
     * Use case 24: Mark lesson as completed
     */
    public void markAsCompleted(Long chapterId, String userLogin) {
        LOG.debug("Request to mark chapter {} as completed for user {}", chapterId, userLogin);
        ChapterProgress progress = findOrCreateProgress(chapterId, userLogin);
        progress.setCompleted(true);
        progress.setPercent(100);
        progress.setLastAccessed(Instant.now());
        chapterProgressRepository.save(progress);
        LOG.info("Chapter {} marked as completed for user {}", chapterId, userLogin);
    }

    /**
     * Update progress percentage for a chapter.
     * Use case 25: Save progress
     */
    public void updateProgress(Long chapterId, String userLogin, Integer percent) {
        LOG.debug("Request to update progress for chapter {} to {}% for user {}", chapterId, percent, userLogin);
        ChapterProgress progress = findOrCreateProgress(chapterId, userLogin);
        progress.setPercent(percent);
        progress.setLastAccessed(Instant.now());
        if (percent >= 100) {
            progress.setCompleted(true);
        }
        chapterProgressRepository.save(progress);
        LOG.info("Progress updated for chapter {} to {}% for user {}", chapterId, percent, userLogin);
    }

    /**
     * Calculate overall completion percentage for a book.
     * Use case 26: View learning progress
     */
    @Transactional(readOnly = true)
    public Double getBookCompletionPercentage(Long bookId, String userLogin) {
        LOG.debug("Request to calculate completion for book {} and user {}", bookId, userLogin);
        Double percentage = chapterProgressRepository.getAverageCompletionPercentageForBook(bookId, userLogin);
        return percentage != null ? percentage : 0.0;
    }

    /**
     * Get all chapters that the user has saved and is learning.
     */
    @Transactional(readOnly = true)
    public List<MyChapterDTO> getMyChapters(String userLogin) {
        LOG.debug("Request to get my chapters for user {}", userLogin);
        return chapterProgressRepository
            .findByAppUser_InternalUser_LoginOrderByLastAccessedDesc(userLogin)
            .stream()
            .map(this::toMyChapterDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get chapters that the user is currently learning (not completed).
     */
    @Transactional(readOnly = true)
    public List<MyChapterDTO> getMyInProgressChapters(String userLogin) {
        LOG.debug("Request to get in-progress chapters for user {}", userLogin);
        return chapterProgressRepository
            .findByAppUser_InternalUser_LoginAndCompletedOrderByLastAccessedDesc(userLogin, false)
            .stream()
            .map(this::toMyChapterDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get chapters that the user has completed.
     */
    @Transactional(readOnly = true)
    public List<MyChapterDTO> getMyCompletedChapters(String userLogin) {
        LOG.debug("Request to get completed chapters for user {}", userLogin);
        return chapterProgressRepository
            .findByAppUser_InternalUser_LoginAndCompletedOrderByLastAccessedDesc(userLogin, true)
            .stream()
            .map(this::toMyChapterDTO)
            .collect(Collectors.toList());
    }

    // --- Helper and Private Methods ---

    /**
     * Finds an existing ChapterProgress or creates a new one if not found.
     * This is crucial to ensure progress is always recorded.
     */
    private ChapterProgress findOrCreateProgress(Long chapterId, String userLogin) {
        // Validate ownership and access
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new AccessDeniedException("User not authenticated"));
        if (!currentUserLogin.equals(userLogin)) {
            throw new AccessDeniedException("Users can only update their own progress.");
        }

        return chapterProgressRepository
            .findByChapterIdAndAppUser_InternalUser_Login(chapterId, userLogin)
            .orElseGet(() -> {
                LOG.info("No existing progress found for chapter {} and user {}. Creating a new one.", chapterId, userLogin);
                AppUser appUser = appUserRepository
                    .findByUser_Login(userLogin)
                    .orElseThrow(() -> new ResourceNotFoundException("AppUser", "login", userLogin));
                Chapter chapter = chapterRepository
                    .findById(chapterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", chapterId));

                ChapterProgress newProgress = new ChapterProgress();
                newProgress.setAppUser(appUser);
                newProgress.setChapter(chapter);
                newProgress.setCompleted(false);
                newProgress.setPercent(0);
                newProgress.setLastAccessed(Instant.now());
                return newProgress;
            });
    }

    /**
     * Helper to map ChapterProgress entity to MyChapterDTO.
     */
    private MyChapterDTO toMyChapterDTO(ChapterProgress progress) {
        return new MyChapterDTO(
            progress.getChapter().getId(),
            progress.getChapter().getTitle(),
            progress.getChapter().getOrderIndex(),
            progress.getChapter().getBook().getId(),
            progress.getChapter().getBook().getTitle(),
            progress.getChapter().getBook().getThumbnail(),
            progress.getChapter().getBook().getLevel() != null ? progress.getChapter().getBook().getLevel().name() : null,
            progress.getPercent() != null ? progress.getPercent() : 0,
            progress.getCompleted() != null ? progress.getCompleted() : false,
            progress.getLastAccessed()
        );
    }
}
