package com.langleague.service;

import com.langleague.domain.ChapterProgress;
import com.langleague.repository.ChapterProgressRepository;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.ChapterProgressDTO;
import com.langleague.service.dto.MyChapterDTO;
import com.langleague.service.mapper.ChapterProgressMapper;
import com.langleague.web.rest.errors.ResourceNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.ChapterProgress}.
 */
@Service
@Transactional
public class ChapterProgressService {

    private static final Logger LOG = LoggerFactory.getLogger(ChapterProgressService.class);

    private final ChapterProgressRepository chapterProgressRepository;

    private final ChapterProgressMapper chapterProgressMapper;

    public ChapterProgressService(ChapterProgressRepository chapterProgressRepository, ChapterProgressMapper chapterProgressMapper) {
        this.chapterProgressRepository = chapterProgressRepository;
        this.chapterProgressMapper = chapterProgressMapper;
    }

    /**
     * Save a chapterProgress.
     *
     * @param chapterProgressDTO the entity to save.
     * @return the persisted entity.
     */
    public ChapterProgressDTO save(ChapterProgressDTO chapterProgressDTO) {
        LOG.debug("Request to save ChapterProgress : {}", chapterProgressDTO);
        // Note: In a real-world scenario, we should also validate that the user creating this progress
        // is the current authenticated user. This is often done in the resource layer.
        ChapterProgress chapterProgress = chapterProgressMapper.toEntity(chapterProgressDTO);
        chapterProgress = chapterProgressRepository.save(chapterProgress);
        return chapterProgressMapper.toDto(chapterProgress);
    }

    /**
     * Update a chapterProgress.
     *
     * @param chapterProgressDTO the entity to save.
     * @return the persisted entity.
     */
    @Retryable(retryFor = { ObjectOptimisticLockingFailureException.class }, maxAttempts = 3, backoff = @Backoff(delay = 100))
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ChapterProgressDTO update(ChapterProgressDTO chapterProgressDTO) {
        LOG.debug("Request to update ChapterProgress : {}", chapterProgressDTO);
        validateOwnership(chapterProgressDTO.getId()); // IDOR Fix
        ChapterProgress chapterProgress = chapterProgressMapper.toEntity(chapterProgressDTO);
        chapterProgress = chapterProgressRepository.save(chapterProgress);
        return chapterProgressMapper.toDto(chapterProgress);
    }

    /**
     * Partially update a chapterProgress.
     *
     * @param chapterProgressDTO the entity to update partially.
     * @return the persisted entity.
     */
    @Retryable(retryFor = { ObjectOptimisticLockingFailureException.class }, maxAttempts = 3, backoff = @Backoff(delay = 100))
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Optional<ChapterProgressDTO> partialUpdate(ChapterProgressDTO chapterProgressDTO) {
        LOG.debug("Request to partially update ChapterProgress : {}", chapterProgressDTO);

        return chapterProgressRepository
            .findById(chapterProgressDTO.getId())
            .map(existingChapterProgress -> {
                validateOwnership(existingChapterProgress); // IDOR Fix
                chapterProgressMapper.partialUpdate(existingChapterProgress, chapterProgressDTO);
                return existingChapterProgress;
            })
            .map(chapterProgressRepository::save)
            .map(chapterProgressMapper::toDto);
    }

    /**
     * Get all the chapterProgresses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ChapterProgressDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ChapterProgresses for current user");
        String userLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new AccessDeniedException("User not authenticated"));
        return chapterProgressRepository.findByAppUser_InternalUser_Login(userLogin, pageable).map(chapterProgressMapper::toDto);
    }

    /**
     * Get one chapterProgress by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ChapterProgressDTO> findOne(Long id) {
        LOG.debug("Request to get ChapterProgress : {}", id);
        validateOwnership(id); // IDOR Fix
        return chapterProgressRepository.findById(id).map(chapterProgressMapper::toDto);
    }

    /**
     * Delete the chapterProgress by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ChapterProgress : {}", id);
        validateOwnership(id); // IDOR Fix
        chapterProgressRepository.deleteById(id);
    }

    // --- Start of IDOR Fix ---

    /**
     * Validates that the current user is the owner of the ChapterProgress.
     * Throws AccessDeniedException if not.
     *
     * @param chapterProgressId the ID of the ChapterProgress to check.
     */
    private void validateOwnership(Long chapterProgressId) {
        String currentUserLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new AccessDeniedException("User not authenticated"));

        ChapterProgress progress = chapterProgressRepository
            .findById(chapterProgressId)
            .orElseThrow(() -> new ResourceNotFoundException("ChapterProgress", "id", chapterProgressId));

        if (
            progress.getAppUser() == null ||
            progress.getAppUser().getInternalUser() == null ||
            !progress.getAppUser().getInternalUser().getLogin().equals(currentUserLogin)
        ) {
            throw new AccessDeniedException("User does not have permission to access this resource");
        }
    }

    /**
     * Overloaded method to validate ownership directly from the entity.
     */
    private void validateOwnership(ChapterProgress chapterProgress) {
        String currentUserLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new AccessDeniedException("User not authenticated"));

        if (
            chapterProgress.getAppUser() == null ||
            chapterProgress.getAppUser().getInternalUser() == null ||
            !chapterProgress.getAppUser().getInternalUser().getLogin().equals(currentUserLogin)
        ) {
            throw new AccessDeniedException("User does not have permission to access this resource");
        }
    }

    // --- End of IDOR Fix ---

    /**
     * Mark chapter as completed for a user.
     * Use case 24: Mark lesson as completed
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     */
    public void markAsCompleted(Long chapterId, String userLogin) {
        LOG.debug("Request to mark chapter {} as completed for user {}", chapterId, userLogin);
        chapterProgressRepository
            .findByChapterIdAndAppUser_InternalUser_Login(chapterId, userLogin)
            .ifPresentOrElse(
                progress -> {
                    progress.setCompleted(true);
                    progress.setPercent(100);
                    progress.setLastAccessed(java.time.Instant.now());
                    chapterProgressRepository.save(progress);
                    LOG.info("Chapter {} marked as completed for user {}", chapterId, userLogin);
                },
                () -> {
                    LOG.warn("Chapter progress not found for chapter {} and user {}", chapterId, userLogin);
                    // In a real app, we might want to create a new progress record here.
                }
            );
    }

    /**
     * Update progress percentage for a chapter.
     * Use case 25: Save progress
     *
     * @param chapterId the chapter ID
     * @param userLogin the user login
     * @param percent the completion percentage
     */
    public void updateProgress(Long chapterId, String userLogin, Integer percent) {
        LOG.debug("Request to update progress for chapter {} to {}% for user {}", chapterId, percent, userLogin);
        chapterProgressRepository
            .findByChapterIdAndAppUser_InternalUser_Login(chapterId, userLogin)
            .ifPresentOrElse(
                progress -> {
                    progress.setPercent(percent);
                    progress.setLastAccessed(java.time.Instant.now());
                    if (percent >= 100) {
                        progress.setCompleted(true);
                    }
                    chapterProgressRepository.save(progress);
                    LOG.info("Progress updated for chapter {} to {}% for user {}", chapterId, percent, userLogin);
                },
                () -> {
                    LOG.warn("Chapter progress not found for chapter {} and user {}. Cannot update progress.", chapterId, userLogin);
                    // In a real app, we might want to create a new progress record here.
                }
            );
    }

    /**
     * Get user's progress for all chapters in a book.
     * Use case 26: View learning progress
     *
     * @param bookId the book ID
     * @param userLogin the user login
     * @return list of chapter progress
     */
    @Transactional(readOnly = true)
    public List<ChapterProgressDTO> getProgressByBook(Long bookId, String userLogin) {
        LOG.debug("Request to get progress for book {} and user {}", bookId, userLogin);
        return chapterProgressRepository
            .findByChapter_BookIdAndAppUser_InternalUser_Login(bookId, userLogin)
            .stream()
            .map(chapterProgressMapper::toDto)
            .toList();
    }

    /**
     * Calculate overall completion percentage for a book.
     * Use case 26: View learning progress
     *
     * @param bookId the book ID
     * @param userLogin the user login
     * @return completion percentage
     */
    @Transactional(readOnly = true)
    public Double getBookCompletionPercentage(Long bookId, String userLogin) {
        LOG.debug("Request to calculate completion for book {} and user {}", bookId, userLogin);
        List<com.langleague.domain.ChapterProgress> progresses =
            chapterProgressRepository.findByChapter_BookIdAndAppUser_InternalUser_Login(bookId, userLogin);

        if (progresses.isEmpty()) {
            return 0.0;
        }

        double totalPercent = progresses
            .stream()
            .mapToInt(p -> p.getPercent() != null ? p.getPercent() : 0)
            .sum();
        return totalPercent / progresses.size();
    }

    /**
     * Get all chapters that the user has saved and is learning.
     * Returns chapters ordered by last accessed time (most recent first).
     *
     * @param userLogin the user login
     * @return list of chapters with progress information
     */
    @Transactional(readOnly = true)
    public List<MyChapterDTO> getMyChapters(String userLogin) {
        LOG.debug("Request to get my chapters for user {}", userLogin);
        return chapterProgressRepository
            .findByAppUser_InternalUser_Login(userLogin)
            .stream()
            .map(progress ->
                new MyChapterDTO(
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
                )
            )
            .sorted((a, b) -> {
                // Sort by last accessed, most recent first
                if (a.getLastAccessed() == null && b.getLastAccessed() == null) return 0;
                if (a.getLastAccessed() == null) return 1;
                if (b.getLastAccessed() == null) return -1;
                return b.getLastAccessed().compareTo(a.getLastAccessed());
            })
            .collect(Collectors.toList());
    }

    /**
     * Get chapters that the user is currently learning (not completed).
     *
     * @param userLogin the user login
     * @return list of in-progress chapters
     */
    @Transactional(readOnly = true)
    public List<MyChapterDTO> getMyInProgressChapters(String userLogin) {
        LOG.debug("Request to get in-progress chapters for user {}", userLogin);
        return getMyChapters(userLogin)
            .stream()
            .filter(chapter -> !chapter.getCompleted())
            .collect(Collectors.toList());
    }

    /**
     * Get chapters that the user has completed.
     *
     * @param userLogin the user login
     * @return list of completed chapters
     */
    @Transactional(readOnly = true)
    public List<MyChapterDTO> getMyCompletedChapters(String userLogin) {
        LOG.debug("Request to get completed chapters for user {}", userLogin);
        return getMyChapters(userLogin).stream().filter(MyChapterDTO::getCompleted).collect(Collectors.toList());
    }
}
