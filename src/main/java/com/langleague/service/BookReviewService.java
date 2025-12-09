package com.langleague.service;

import com.langleague.domain.BookReview;
import com.langleague.repository.BookReviewRepository;
import com.langleague.service.dto.BookReviewDTO;
import com.langleague.service.mapper.BookReviewMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link BookReview}.
 */
@Service
@Transactional
public class BookReviewService {

    private static final Logger LOG = LoggerFactory.getLogger(BookReviewService.class);

    private final BookReviewRepository bookReviewRepository;

    private final BookReviewMapper bookReviewMapper;

    private final BookService bookService;

    public BookReviewService(BookReviewRepository bookReviewRepository, BookReviewMapper bookReviewMapper, BookService bookService) {
        this.bookReviewRepository = bookReviewRepository;
        this.bookReviewMapper = bookReviewMapper;
        this.bookService = bookService;
    }

    /**
     * Save a bookReview.
     *
     * @param bookReviewDTO the entity to save.
     * @return the persisted entity.
     */
    public BookReviewDTO save(BookReviewDTO bookReviewDTO) {
        LOG.debug("Request to save BookReview : {}", bookReviewDTO);
        BookReview bookReview = bookReviewMapper.toEntity(bookReviewDTO);
        bookReview = bookReviewRepository.save(bookReview);

        // Update book rating statistics
        if (bookReview.getBook() != null && bookReview.getBook().getId() != null) {
            bookService.updateBookRating(bookReview.getBook().getId());
        }

        return bookReviewMapper.toDto(bookReview);
    }

    /**
     * Update a bookReview.
     *
     * @param bookReviewDTO the entity to save.
     * @return the persisted entity.
     */
    public BookReviewDTO update(BookReviewDTO bookReviewDTO) {
        LOG.debug("Request to update BookReview : {}", bookReviewDTO);
        BookReview bookReview = bookReviewMapper.toEntity(bookReviewDTO);
        bookReview = bookReviewRepository.save(bookReview);

        // Update book rating statistics
        if (bookReview.getBook() != null && bookReview.getBook().getId() != null) {
            bookService.updateBookRating(bookReview.getBook().getId());
        }

        return bookReviewMapper.toDto(bookReview);
    }

    /**
     * Partially update a bookReview.
     *
     * @param bookReviewDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<BookReviewDTO> partialUpdate(BookReviewDTO bookReviewDTO) {
        LOG.debug("Request to partially update BookReview : {}", bookReviewDTO);

        return bookReviewRepository
            .findById(bookReviewDTO.getId())
            .map(existingBookReview -> {
                bookReviewMapper.partialUpdate(existingBookReview, bookReviewDTO);

                return existingBookReview;
            })
            .map(bookReviewRepository::save)
            .map(bookReviewMapper::toDto);
    }

    /**
     * Get all the bookReviews.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookReviewDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all BookReviews");
        return bookReviewRepository.findAll(pageable).map(bookReviewMapper::toDto);
    }

    /**
     * Get one bookReview by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<BookReviewDTO> findOne(Long id) {
        LOG.debug("Request to get BookReview : {}", id);
        return bookReviewRepository.findById(id).map(bookReviewMapper::toDto);
    }

    /**
     * Delete the bookReview by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete BookReview : {}", id);

        // Get book ID before deleting the review
        Optional<BookReview> reviewOpt = bookReviewRepository.findById(id);
        Long bookId = reviewOpt.map(review -> review.getBook() != null ? review.getBook().getId() : null).orElse(null);

        bookReviewRepository.deleteById(id);

        // Update book rating statistics after deletion
        if (bookId != null) {
            bookService.updateBookRating(bookId);
        }
    }

    /**
     * Submit or update a book review/rating.
     * Use case 37: Like/Rate lesson (applied to books)
     *
     * @param bookId the book ID
     * @param userLogin the user login
     * @param rating the rating (1-5)
     * @param reviewContent optional review content
     * @return the saved review
     */
    public BookReviewDTO rateBook(Long bookId, String userLogin, Integer rating, String reviewContent) {
        LOG.debug("Request to rate book {} by user {} with rating {}", bookId, userLogin, rating);

        // Check if user already reviewed this book
        Optional<BookReview> existingReview = bookReviewRepository.findByBookIdAndAppUser_InternalUser_Login(bookId, userLogin);

        if (existingReview.isPresent()) {
            // Update existing review
            BookReview review = existingReview.orElseThrow();
            review.setRating(rating);
            if (reviewContent != null) {
                review.setContent(reviewContent);
            }
            review.setUpdatedAt(java.time.Instant.now());
            bookReviewRepository.save(review);
            LOG.info("Updated review for book {} by user {}", bookId, userLogin);
            return bookReviewMapper.toDto(review);
        } else {
            // Create new review - would need to fetch Book and AppUser entities
            LOG.info("Creating new review for book {} by user {}", bookId, userLogin);
            BookReviewDTO reviewDTO = new BookReviewDTO();
            reviewDTO.setRating(rating);
            reviewDTO.setContent(reviewContent);
            reviewDTO.setCreatedAt(java.time.Instant.now());
            return save(reviewDTO);
        }
    }

    /**
     * Get average rating for a book.
     * Use case 37: Like/Rate lesson
     *
     * @param bookId the book ID
     * @return average rating
     */
    @Transactional(readOnly = true)
    public Double getAverageRating(Long bookId) {
        LOG.debug("Request to get average rating for book : {}", bookId);
        return bookReviewRepository.findAverageRatingByBookId(bookId).orElse(0.0);
    }

    /**
     * Get all reviews for a book.
     * Use case 37: Like/Rate lesson
     *
     * @param bookId the book ID
     * @param pageable pagination info
     * @return page of reviews
     */
    @Transactional(readOnly = true)
    public Page<BookReviewDTO> getReviewsByBook(Long bookId, Pageable pageable) {
        LOG.debug("Request to get reviews for book : {}", bookId);
        return bookReviewRepository.findByBookIdOrderByCreatedAtDesc(bookId, pageable).map(bookReviewMapper::toDto);
    }
}
