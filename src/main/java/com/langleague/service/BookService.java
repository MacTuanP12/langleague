package com.langleague.service;

import com.langleague.domain.Book;
import com.langleague.repository.BookRepository;
import com.langleague.repository.BookReviewRepository;
import com.langleague.repository.ChapterRepository;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.BookDetailDTO;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.mapper.BookMapper;
import com.langleague.service.mapper.ChapterMapper;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.Book}.
 * OPTIMIZED: Added caching for frequently accessed book data
 */
@Service
@Transactional
public class BookService {

    private static final Logger LOG = LoggerFactory.getLogger(BookService.class);

    private final BookRepository bookRepository;

    private final BookMapper bookMapper;

    private final ChapterRepository chapterRepository;

    private final ChapterMapper chapterMapper;

    private final BookReviewRepository bookReviewRepository;

    public BookService(
        BookRepository bookRepository,
        BookMapper bookMapper,
        ChapterRepository chapterRepository,
        ChapterMapper chapterMapper,
        BookReviewRepository bookReviewRepository
    ) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
        this.chapterRepository = chapterRepository;
        this.chapterMapper = chapterMapper;
        this.bookReviewRepository = bookReviewRepository;
    }

    /**
     * Save a book.
     * OPTIMIZED: Evict cache on save
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    @CacheEvict(value = { "books", "booksByLevel" }, allEntries = true)
    public BookDTO save(BookDTO bookDTO) {
        LOG.debug("Request to save Book : {}", bookDTO);
        validateBook(bookDTO);
        Book book = bookMapper.toEntity(bookDTO);
        // Set default values for new book
        if (book.getIsActive() == null) {
            book.setIsActive(true);
        }
        if (book.getAverageRating() == null) {
            book.setAverageRating(0.0);
        }
        if (book.getTotalReviews() == null) {
            book.setTotalReviews(0L);
        }
        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    /**
     * Update a book.
     * OPTIMIZED: Evict cache on update
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    @CacheEvict(value = { "books", "booksByLevel" }, allEntries = true)
    public BookDTO update(BookDTO bookDTO) {
        LOG.debug("Request to update Book : {}", bookDTO);
        validateBook(bookDTO);
        Book book = bookMapper.toEntity(bookDTO);
        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    /**
     * Partially update a book.
     *
     * @param bookDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<BookDTO> partialUpdate(BookDTO bookDTO) {
        LOG.debug("Request to partially update Book : {}", bookDTO);

        return bookRepository
            .findById(bookDTO.getId())
            .map(existingBook -> {
                bookMapper.partialUpdate(existingBook, bookDTO);

                return existingBook;
            })
            .map(bookRepository::save)
            .map(bookMapper::toDto);
    }

    /**
     * Get all the books.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Books");
        return bookRepository.findAll(pageable).map(bookMapper::toDto);
    }

    /**
     * Get one book by id.
     * OPTIMIZED: Cached for better performance
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "books", key = "#id")
    public Optional<BookDTO> findOne(Long id) {
        LOG.debug("Request to get Book : {}", id);
        return bookRepository.findById(id).map(bookMapper::toDto);
    }

    /**
     * Soft delete the book by id.
     * OPTIMIZED: Evict cache on delete
     * Business Rule: Check for existing chapters and reviews before soft delete
     *
     * @param id the id of the entity.
     */
    @CacheEvict(value = { "books", "booksByLevel" }, allEntries = true)
    public void delete(Long id) {
        LOG.debug("Request to soft delete Book : {}", id);

        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));

        // Audit logging: Get current user
        String currentUser = getCurrentUserLogin();

        // Check if book has chapters
        long chapterCount = chapterRepository.countByBookId(id);
        if (chapterCount > 0) {
            LOG.warn("Book {} has {} chapters. Proceeding with soft delete.", id, chapterCount);
        }

        // Check if book has reviews
        long reviewCount = bookReviewRepository.countByBookId(id);
        if (reviewCount > 0) {
            LOG.warn("Book {} has {} reviews. Proceeding with soft delete.", id, reviewCount);
        }

        // Soft delete: mark as inactive instead of hard delete
        book.setIsActive(false);
        bookRepository.save(book);

        // Audit logging
        LOG.info(
            "AUDIT: Book soft-deleted | ID: {} | Title: '{}' | User: {} | ChapterCount: {} | ReviewCount: {}",
            id,
            book.getTitle(),
            currentUser,
            chapterCount,
            reviewCount
        );
    }

    /**
     * Get all inactive books (for admin review).
     *
     * @param pageable the pagination information.
     * @return the page of books.
     */
    public Page<BookDTO> findInactive(Pageable pageable) {
        LOG.debug("Request to get all inactive Books");
        return bookRepository.findByIsActiveFalse(pageable).map(bookMapper::toDto);
    }

    /**
     * Approve a book - set it as active.
     *
     * @param id the id of the book.
     * @return the approved book.
     */
    public BookDTO approve(Long id) {
        LOG.debug("Request to approve Book : {}", id);
        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));

        book.setIsActive(true);
        book = bookRepository.save(book);

        String currentUser = getCurrentUserLogin();
        LOG.info("AUDIT: Book approved | ID: {} | Title: '{}' | User: {}", id, book.getTitle(), currentUser);

        return bookMapper.toDto(book);
    }

    /**
     * Reject a book - set it as inactive.
     *
     * @param id the id of the book.
     */
    public void reject(Long id) {
        LOG.debug("Request to reject Book : {}", id);
        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));

        book.setIsActive(false);
        bookRepository.save(book);

        String currentUser = getCurrentUserLogin();
        LOG.info("AUDIT: Book rejected | ID: {} | Title: '{}' | User: {}", id, book.getTitle(), currentUser);
    }

    /**
     * Hard delete the book by id - ADMIN ONLY.
     * WARNING: This permanently deletes the book and all related data.
     *
     * @param id the id of the entity.
     * @param force if true, delete even if there are chapters/reviews
     */
    @CacheEvict(value = { "books", "booksByLevel" }, allEntries = true)
    public void hardDelete(Long id, boolean force) {
        LOG.debug("Request to hard delete Book : {}", id);

        // Get book info before deletion for audit log
        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));
        String bookTitle = book.getTitle();
        String currentUser = getCurrentUserLogin();

        long chapterCount;
        long reviewCount;

        if (!force) {
            // Check if book has chapters
            chapterCount = chapterRepository.countByBookId(id);
            if (chapterCount > 0) {
                throw new IllegalStateException(
                    "Cannot delete book with existing chapters. Book has " + chapterCount + " chapters. Use force=true to delete anyway."
                );
            }

            // Check if book has reviews
            reviewCount = bookReviewRepository.countByBookId(id);
            if (reviewCount > 0) {
                throw new IllegalStateException(
                    "Cannot delete book with existing reviews. Book has " + reviewCount + " reviews. Use force=true to delete anyway."
                );
            }
        } else {
            // Get counts for audit log
            chapterCount = chapterRepository.countByBookId(id);
            reviewCount = bookReviewRepository.countByBookId(id);
        }

        bookRepository.deleteById(id);

        // Audit logging
        LOG.warn(
            "AUDIT: Book PERMANENTLY deleted | ID: {} | Title: '{}' | User: {} | Force: {} | ChapterCount: {} | ReviewCount: {}",
            id,
            bookTitle,
            currentUser,
            force,
            chapterCount,
            reviewCount
        );
    }

    /**
     * Search books by title or description.
     * Use case 18: Search lessons
     *
     * @param keyword  the search keyword
     * @param pageable the pagination information
     * @return page of matching books
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> searchBooks(String keyword, Pageable pageable) {
        LOG.debug("Request to search Books with keyword : {}", keyword);
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return findAllActive(pageable);
            }
            return bookRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable)
                .map(bookMapper::toDto);
        } catch (Exception e) {
            LOG.error("Error searching books with keyword: {}", keyword, e);
            // Return empty page instead of throwing exception
            return Page.empty(pageable);
        }
    }

    /**
     * Get books by level.
     * Use case 27: Get lesson recommendation
     * OPTIMIZED: Cached for better performance
     *
     * @param level the book level as string
     * @return list of books matching the level
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "booksByLevel", key = "#level")
    public List<BookDTO> findByLevel(String level) {
        LOG.debug("Request to get Books by level : {}", level);
        try {
            com.langleague.domain.enumeration.Level levelEnum = com.langleague.domain.enumeration.Level.valueOf(level.toUpperCase());
            return bookRepository.findByLevel(levelEnum).stream().map(bookMapper::toDto).toList();
        } catch (IllegalArgumentException e) {
            LOG.warn("Invalid level value: {}", level);
            return List.of();
        }
    }

    /**
     * Get all chapters for a specific book.
     * Use case 16: View assigned lessons
     *
     * @param bookId the ID of the book
     * @return list of chapters
     */
    @Transactional(readOnly = true)
    public List<ChapterDTO> findChaptersByBookId(Long bookId) {
        LOG.debug("Request to get Chapters by book id : {}", bookId);
        return chapterRepository.findByBookIdOrderByOrderIndexAsc(bookId).stream().map(chapterMapper::toDto).toList();
    }

    /**
     * Get books by multiple levels.
     * Use case 27: Advanced lesson recommendation
     *
     * @param levels list of book levels
     * @return list of books matching any of the levels
     */
    @Transactional(readOnly = true)
    public List<BookDTO> findByLevels(List<com.langleague.domain.enumeration.Level> levels) {
        LOG.debug("Request to get Books by multiple levels : {}", levels);
        return bookRepository.findByLevelIn(levels).stream().map(bookMapper::toDto).toList();
    }

    /**
     * Check if a book title already exists.
     * Use case: Prevent duplicate book titles
     *
     * @param title the book title to check
     * @return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean existsByTitle(String title) {
        LOG.debug("Request to check if Book title exists : {}", title);
        return bookRepository.existsByTitle(title);
    }

    /**
     * Check if a book title already exists for a different book.
     * Use case: Prevent duplicate book titles when updating
     *
     * @param title the book title to check
     * @param id the current book ID to exclude
     * @return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean existsByTitleAndIdNot(String title, Long id) {
        LOG.debug("Request to check if Book title exists for different id : {} {}", title, id);
        return bookRepository.existsByTitleAndIdNot(title, id);
    }

    /**
     * Count books by level.
     * Use case: Statistics and analytics
     *
     * @param level the book level
     * @return count of books
     */
    @Transactional(readOnly = true)
    public long countByLevel(com.langleague.domain.enumeration.Level level) {
        LOG.debug("Request to count Books by level : {}", level);
        return bookRepository.countByLevel(level);
    }

    /**
     * Validate book before save/update.
     *
     * @param bookDTO the book to validate
     * @throws IllegalArgumentException if validation fails
     */
    public void validateBook(BookDTO bookDTO) {
        if (bookDTO.getTitle() == null || bookDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title cannot be empty");
        }

        // Check for duplicate title
        if (bookDTO.getId() == null) {
            // Creating new book
            if (existsByTitle(bookDTO.getTitle())) {
                throw new IllegalArgumentException("A book with this title already exists");
            }
        } else {
            // Updating existing book
            if (existsByTitleAndIdNot(bookDTO.getTitle(), bookDTO.getId())) {
                throw new IllegalArgumentException("A book with this title already exists");
            }
        }
    }

    /**
     * Update book rating statistics when a review is added/updated/deleted.
     * Business Logic: Automatically recalculate averageRating and totalReviews
     *
     * @param bookId the book ID
     */
    @CacheEvict(value = { "books", "booksByLevel" }, allEntries = true)
    public void updateBookRating(Long bookId) {
        LOG.debug("Request to update rating for Book : {}", bookId);

        Book book = bookRepository.findById(bookId).orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + bookId));

        // Get review statistics
        long reviewCount = bookReviewRepository.countByBookId(bookId);
        book.setTotalReviews(reviewCount);

        if (reviewCount > 0) {
            Double avgRating = bookReviewRepository.findAverageRatingByBookId(bookId).orElse(0.0);
            book.setAverageRating(avgRating);
        } else {
            book.setAverageRating(0.0);
        }

        bookRepository.save(book);
        LOG.info("Updated book {} rating: {} stars ({} reviews)", bookId, book.getAverageRating(), book.getTotalReviews());
    }

    /**
     * Get detailed book information including chapters and statistics.
     * Use case 16: View assigned lessons with complete details
     *
     * @param id the book ID
     * @return detailed book information
     */
    @Transactional(readOnly = true)
    public Optional<BookDetailDTO> findOneWithDetails(Long id) {
        LOG.debug("Request to get Book with details : {}", id);

        return bookRepository
            .findById(id)
            .map(book -> {
                BookDetailDTO detailDTO = new BookDetailDTO();

                // Copy basic book info
                detailDTO.setId(book.getId());
                detailDTO.setTitle(book.getTitle());
                detailDTO.setLevel(book.getLevel());
                detailDTO.setDescription(book.getDescription());
                detailDTO.setThumbnail(book.getThumbnail());

                // Get chapters
                List<ChapterDTO> chapters = findChaptersByBookId(id);
                detailDTO.setChapters(chapters);
                detailDTO.setTotalChapters(chapters.size());

                // Get review statistics using optimized queries
                long reviewCount = bookReviewRepository.countByBookId(id);
                detailDTO.setTotalReviews(reviewCount);

                if (reviewCount > 0) {
                    Double avgRating = bookReviewRepository.findAverageRatingByBookId(id).orElse(0.0);
                    detailDTO.setAverageRating(avgRating);
                } else {
                    detailDTO.setAverageRating(0.0);
                }

                return detailDTO;
            });
    }

    /**
     * Get all active books.
     * Use case: Display only active books to users
     *
     * @param pageable the pagination information
     * @return page of active books
     */
    @Transactional(readOnly = true)
    public Page<BookDTO> findAllActive(Pageable pageable) {
        LOG.debug("Request to get all active Books");
        return bookRepository.findByIsActiveTrue(pageable).map(bookMapper::toDto);
    }

    /**
     * Restore a soft-deleted book.
     * Use case: Restore accidentally deleted books
     *
     * @param id the book ID to restore
     * @return the restored book
     */
    @CacheEvict(value = { "books", "booksByLevel" }, allEntries = true)
    public BookDTO restore(Long id) {
        LOG.debug("Request to restore Book : {}", id);

        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));

        if (Boolean.TRUE.equals(book.getIsActive())) {
            throw new IllegalStateException("Book is already active");
        }

        String currentUser = getCurrentUserLogin();
        book.setIsActive(true);
        bookRepository.save(book);

        // Audit logging
        LOG.info("AUDIT: Book restored | ID: {} | Title: '{}' | User: {}", id, book.getTitle(), currentUser);

        return bookMapper.toDto(book);
    }

    /**
     * Get current user login for audit logging.
     *
     * @return current user login or "system"
     */
    private String getCurrentUserLogin() {
        return org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
