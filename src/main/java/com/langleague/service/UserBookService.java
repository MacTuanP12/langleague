package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.Book;
import com.langleague.domain.Chapter;
import com.langleague.domain.UserBook;
import com.langleague.domain.enumeration.LearningStatus;
import com.langleague.repository.*;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.BookProgressDTO;
import com.langleague.service.dto.UserBookDTO;
import com.langleague.service.dto.UserBookStatisticsDTO;
import com.langleague.service.mapper.UserBookMapper;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing user's book library
 */
@Service
@Transactional
public class UserBookService {

    private static final Logger LOG = LoggerFactory.getLogger(UserBookService.class);
    private static final Integer MIN_PASSING_SCORE = 60; // Minimum score to consider exercise as completed

    private final UserBookRepository userBookRepository;
    private final AppUserRepository appUserRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final UserBookMapper userBookMapper;
    private final ExerciseResultRepository exerciseResultRepository;
    private final ListeningExerciseRepository listeningExerciseRepository;
    private final ReadingExerciseRepository readingExerciseRepository;
    private final SpeakingExerciseRepository speakingExerciseRepository;
    private final WritingExerciseRepository writingExerciseRepository;

    public UserBookService(
        UserBookRepository userBookRepository,
        AppUserRepository appUserRepository,
        BookRepository bookRepository,
        ChapterRepository chapterRepository,
        UserBookMapper userBookMapper,
        ExerciseResultRepository exerciseResultRepository,
        ListeningExerciseRepository listeningExerciseRepository,
        ReadingExerciseRepository readingExerciseRepository,
        SpeakingExerciseRepository speakingExerciseRepository,
        WritingExerciseRepository writingExerciseRepository
    ) {
        this.userBookRepository = userBookRepository;
        this.appUserRepository = appUserRepository;
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.userBookMapper = userBookMapper;
        this.exerciseResultRepository = exerciseResultRepository;
        this.listeningExerciseRepository = listeningExerciseRepository;
        this.readingExerciseRepository = readingExerciseRepository;
        this.speakingExerciseRepository = speakingExerciseRepository;
        this.writingExerciseRepository = writingExerciseRepository;
    }

    /**
     * Get all books saved by current user
     */
    @Transactional(readOnly = true)
    public List<UserBookDTO> getMyBooks() {
        LOG.debug("Request to get my books");

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        return userBookRepository.findByAppUser_IdWithBook(appUser.getId()).stream().map(userBookMapper::toDto).toList();
    }

    /**
     * Get favorite books of current user
     */
    @Transactional(readOnly = true)
    public List<UserBookDTO> getMyFavoriteBooks() {
        LOG.debug("Request to get my favorite books");

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        return userBookRepository.findFavoritesByUserId(appUser.getId()).stream().map(userBookMapper::toDto).toList();
    }

    /**
     * Get books by learning status
     */
    @Transactional(readOnly = true)
    public List<UserBookDTO> getBooksByStatus(LearningStatus status) {
        LOG.debug("Request to get books by status: {}", status);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        return userBookRepository.findByUserIdAndStatus(appUser.getId(), status).stream().map(userBookMapper::toDto).toList();
    }

    /**
     * Save a book to user's library
     */
    public UserBookDTO saveBook(Long bookId) throws Exception {
        LOG.debug("Request to save book: {}", bookId);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        Book book = bookRepository.findById(bookId).orElseThrow(() -> new Exception("Book not found"));

        // Check if already saved
        if (userBookRepository.existsByAppUser_IdAndBook_Id(appUser.getId(), bookId)) {
            throw new Exception("Book already saved to your library");
        }

        // Create UserBook
        UserBook userBook = new UserBook();
        userBook.setAppUser(appUser);
        userBook.setBook(book);
        userBook.setSavedAt(Instant.now());
        userBook.setLearningStatus(LearningStatus.NOT_STARTED);
        userBook.setProgressPercentage(0.0);
        userBook.setIsFavorite(false);

        userBook = userBookRepository.save(userBook);

        LOG.info("Book {} saved to library for user {}", bookId, userLogin);

        return userBookMapper.toDto(userBook);
    }

    /**
     * Remove a book from user's library
     */
    public void removeBook(Long bookId) throws Exception {
        LOG.debug("Request to remove book: {}", bookId);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        UserBook userBook = userBookRepository
            .findByAppUserIdAndBookId(appUser.getId(), bookId)
            .orElseThrow(() -> new Exception("Book not found in your library"));

        userBookRepository.delete(userBook);

        LOG.info("Book {} removed from library for user {}", bookId, userLogin);
    }

    /**
     * Update learning status
     */
    public UserBookDTO updateLearningStatus(Long bookId, LearningStatus status) throws Exception {
        LOG.debug("Request to update learning status: {} to {}", bookId, status);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        UserBook userBook = userBookRepository
            .findByAppUserIdAndBookId(appUser.getId(), bookId)
            .orElseThrow(() -> new Exception("Book not found in your library"));

        userBook.setLearningStatus(status);
        userBook.setLastAccessedAt(Instant.now());

        userBook = userBookRepository.save(userBook);

        return userBookMapper.toDto(userBook);
    }

    /**
     * Update current chapter
     */
    public UserBookDTO updateCurrentChapter(Long bookId, Long chapterId) throws Exception {
        LOG.debug("Request to update current chapter: {} to {}", bookId, chapterId);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        UserBook userBook = userBookRepository
            .findByAppUserIdAndBookId(appUser.getId(), bookId)
            .orElseThrow(() -> new Exception("Book not found in your library"));

        // Verify chapter belongs to book
        if (!chapterRepository.existsByIdAndBook_Id(chapterId, bookId)) {
            throw new Exception("Chapter does not belong to this book");
        }

        userBook.setCurrentChapterId(chapterId);
        userBook.setLastAccessedAt(Instant.now());

        // Update status to IN_PROGRESS if not started
        if (userBook.getLearningStatus() == LearningStatus.NOT_STARTED) {
            userBook.setLearningStatus(LearningStatus.IN_PROGRESS);
        }

        userBook = userBookRepository.save(userBook);

        return userBookMapper.toDto(userBook);
    }

    /**
     * Toggle favorite status
     */
    public UserBookDTO toggleFavorite(Long bookId) throws Exception {
        LOG.debug("Request to toggle favorite: {}", bookId);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        UserBook userBook = userBookRepository
            .findByAppUserIdAndBookId(appUser.getId(), bookId)
            .orElseThrow(() -> new Exception("Book not found in your library"));

        userBook.setIsFavorite(!userBook.getIsFavorite());
        userBook = userBookRepository.save(userBook);

        return userBookMapper.toDto(userBook);
    }

    /**
     * Update progress percentage
     */
    public UserBookDTO updateProgress(Long bookId, Double progressPercentage) throws Exception {
        LOG.debug("Request to update progress: {} to {}%", bookId, progressPercentage);

        if (progressPercentage < 0 || progressPercentage > 100) {
            throw new Exception("Progress percentage must be between 0 and 100");
        }

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        UserBook userBook = userBookRepository
            .findByAppUserIdAndBookId(appUser.getId(), bookId)
            .orElseThrow(() -> new Exception("Book not found in your library"));

        userBook.setProgressPercentage(progressPercentage);
        userBook.setLastAccessedAt(Instant.now());

        // Auto-update status based on progress
        if (progressPercentage == 100.0) {
            userBook.setLearningStatus(LearningStatus.COMPLETED);
        } else if (progressPercentage > 0 && userBook.getLearningStatus() == LearningStatus.NOT_STARTED) {
            userBook.setLearningStatus(LearningStatus.IN_PROGRESS);
        }

        userBook = userBookRepository.save(userBook);

        return userBookMapper.toDto(userBook);
    }

    /**
     * Get statistics for current user
     */
    @Transactional(readOnly = true)
    public UserBookStatisticsDTO getStatistics() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));

        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        Long total = userBookRepository.countByUserId(appUser.getId());
        Long inProgress = (long) userBookRepository.findByUserIdAndStatus(appUser.getId(), LearningStatus.IN_PROGRESS).size();
        Long completed = (long) userBookRepository.findByUserIdAndStatus(appUser.getId(), LearningStatus.COMPLETED).size();
        Long favorites = (long) userBookRepository.findFavoritesByUserId(appUser.getId()).size();

        UserBookStatisticsDTO stats = new UserBookStatisticsDTO();
        stats.setTotalBooks(total);
        stats.setBooksInProgress(inProgress);
        stats.setBooksCompleted(completed);
        stats.setFavoriteBooks(favorites);

        return stats;
    }

    /**
     * Calculate and get detailed progress for a book
     *
     * @param bookId the book ID
     * @return book progress DTO with detailed chapter progress
     */
    @Transactional(readOnly = true)
    public BookProgressDTO getBookProgress(Long bookId) throws Exception {
        LOG.debug("Request to get book progress for book: {}", bookId);

        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Current user not found"));
        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found"));

        Book book = bookRepository.findById(bookId).orElseThrow(() -> new Exception("Book not found"));

        // Check if user has saved this book
        if (!userBookRepository.existsByAppUser_IdAndBook_Id(appUser.getId(), bookId)) {
            throw new Exception("Book not found in your library. Please save the book first.");
        }

        BookProgressDTO progressDTO = new BookProgressDTO();
        progressDTO.setBookId(bookId);
        progressDTO.setBookTitle(book.getTitle());

        // Get all chapters for this book
        List<Chapter> chapters = chapterRepository.findByBookIdOrderByOrderIndexAsc(bookId);
        progressDTO.setTotalChapters(chapters.size());

        // Calculate progress for each chapter
        List<BookProgressDTO.ChapterProgressItemDTO> chapterProgressList = new ArrayList<>();
        int completedChaptersCount = 0;
        int totalExercises = 0;
        int completedExercises = 0;

        for (Chapter chapter : chapters) {
            BookProgressDTO.ChapterProgressItemDTO chapterProgress = calculateChapterProgress(appUser.getId(), chapter);
            chapterProgressList.add(chapterProgress);

            if (chapterProgress.getIsCompleted()) {
                completedChaptersCount++;
            }

            totalExercises += chapterProgress.getTotalExercises();
            completedExercises += chapterProgress.getCompletedExercises();
        }

        progressDTO.setChapterProgress(chapterProgressList);
        progressDTO.setCompletedChapters(completedChaptersCount);
        progressDTO.setTotalExercises(totalExercises);
        progressDTO.setCompletedExercises(completedExercises);

        // Calculate overall progress percentage
        double overallProgress = 0.0;
        if (totalExercises > 0) {
            overallProgress = (completedExercises * 100.0) / totalExercises;
        } else if (chapters.size() > 0) {
            // If no exercises, use chapter completion
            overallProgress = (completedChaptersCount * 100.0) / chapters.size();
        }
        progressDTO.setOverallProgress(Math.round(overallProgress * 100.0) / 100.0);

        // Get average score for the book
        Double averageScore = exerciseResultRepository.getAverageScoreByAppUserIdAndBookId(appUser.getId(), bookId);
        progressDTO.setAverageScore(averageScore != null ? Math.round(averageScore * 100.0) / 100.0 : 0.0);

        return progressDTO;
    }

    /**
     * Calculate progress for a single chapter
     */
    private BookProgressDTO.ChapterProgressItemDTO calculateChapterProgress(Long appUserId, Chapter chapter) {
        BookProgressDTO.ChapterProgressItemDTO chapterProgress = new BookProgressDTO.ChapterProgressItemDTO();
        chapterProgress.setChapterId(chapter.getId());
        chapterProgress.setChapterTitle(chapter.getTitle());
        chapterProgress.setOrderIndex(chapter.getOrderIndex());

        // Count total exercises in this chapter
        int totalExercises = 0;
        totalExercises += listeningExerciseRepository.countByChapter_Id(chapter.getId());
        totalExercises += readingExerciseRepository.countByChapter_Id(chapter.getId());
        totalExercises += speakingExerciseRepository.countByChapter_Id(chapter.getId());
        totalExercises += writingExerciseRepository.countByChapter_Id(chapter.getId());

        chapterProgress.setTotalExercises(totalExercises);

        // Count completed exercises (score >= MIN_PASSING_SCORE)
        long completedCount = exerciseResultRepository.countByAppUserIdAndChapterId(appUserId, chapter.getId());
        chapterProgress.setCompletedExercises((int) completedCount);

        // Calculate progress percentage
        double progressPercentage = 0.0;
        if (totalExercises > 0) {
            progressPercentage = (completedCount * 100.0) / totalExercises;
        }
        chapterProgress.setProgressPercentage(Math.round(progressPercentage * 100.0) / 100.0);

        // Get average score for this chapter
        Double averageScore = exerciseResultRepository.getAverageScoreByAppUserIdAndChapterId(appUserId, chapter.getId());
        chapterProgress.setAverageScore(averageScore != null ? Math.round(averageScore * 100.0) / 100.0 : 0.0);

        // Consider chapter completed if progress >= 80%
        chapterProgress.setIsCompleted(progressPercentage >= 80.0);

        return chapterProgress;
    }

    /**
     * Auto-calculate and update progress percentage for a book
     * This should be called after user completes exercises
     *
     * @param bookId the book ID
     */
    public void autoUpdateBookProgress(Long bookId, Long appUserId) {
        LOG.debug("Auto-updating book progress for book: {} and user: {}", bookId, appUserId);

        try {
            UserBook userBook = userBookRepository.findByAppUserIdAndBookId(appUserId, bookId).orElse(null);

            if (userBook == null) {
                return; // User hasn't saved this book yet
            }

            // Get all chapters
            List<Chapter> chapters = chapterRepository.findByBookIdOrderByOrderIndexAsc(bookId);
            if (chapters.isEmpty()) {
                return;
            }

            int totalExercises = 0;
            int completedExercises = 0;

            for (Chapter chapter : chapters) {
                // Count total exercises
                totalExercises += listeningExerciseRepository.countByChapter_Id(chapter.getId());
                totalExercises += readingExerciseRepository.countByChapter_Id(chapter.getId());
                totalExercises += speakingExerciseRepository.countByChapter_Id(chapter.getId());
                totalExercises += writingExerciseRepository.countByChapter_Id(chapter.getId());

                // Count completed exercises
                completedExercises += exerciseResultRepository.countByAppUserIdAndChapterId(appUserId, chapter.getId());
            }

            // Calculate progress percentage
            double progressPercentage = 0.0;
            if (totalExercises > 0) {
                progressPercentage = (completedExercises * 100.0) / totalExercises;
            }

            // Update UserBook progress
            userBook.setProgressPercentage(Math.round(progressPercentage * 100.0) / 100.0);
            userBook.setLastAccessedAt(Instant.now());

            // Auto-update learning status
            if (progressPercentage >= 100.0) {
                userBook.setLearningStatus(LearningStatus.COMPLETED);
            } else if (progressPercentage > 0 && userBook.getLearningStatus() == LearningStatus.NOT_STARTED) {
                userBook.setLearningStatus(LearningStatus.IN_PROGRESS);
            }

            userBookRepository.save(userBook);

            LOG.info("Updated book progress for book {} to {}%", bookId, progressPercentage);
        } catch (Exception e) {
            LOG.error("Error auto-updating book progress: {}", e.getMessage());
        }
    }
}
