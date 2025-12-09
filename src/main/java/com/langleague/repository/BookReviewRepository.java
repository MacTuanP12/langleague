package com.langleague.repository;

import com.langleague.domain.BookReview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookReview entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookReviewRepository extends JpaRepository<BookReview, Long> {
    /**
     * Find review by book and user
     */
    Optional<BookReview> findByBookIdAndAppUser_InternalUser_Login(Long bookId, String userLogin);

    /**
     * Check if user already reviewed a book
     */
    boolean existsByBookIdAndAppUser_InternalUser_Login(Long bookId, String userLogin);

    /**
     * Find all reviews for a book, ordered by date descending
     */
    Page<BookReview> findByBookIdOrderByCreatedAtDesc(Long bookId, Pageable pageable);

    /**
     * Find top N recent reviews for a book (non-paginated, limited for performance)
     * Use case: Quick preview of latest reviews
     */
    @Query("SELECT br FROM BookReview br WHERE br.book.id = :bookId ORDER BY br.createdAt DESC")
    List<BookReview> findTop10ByBookIdOrderByCreatedAtDesc(@Param("bookId") Long bookId, Pageable pageable);

    /**
     * Find all reviews for a book (non-paginated) - DEPRECATED: Use paginated version
     * @deprecated Use findByBookIdOrderByCreatedAtDesc with Pageable instead
     */
    @Deprecated
    List<BookReview> findByBookId(Long bookId);

    /**
     * Count reviews for a book
     */
    long countByBookId(Long bookId);

    /**
     * Calculate average rating for a book
     */
    @Query("SELECT AVG(br.rating) FROM BookReview br WHERE br.book.id = :bookId")
    Optional<Double> findAverageRatingByBookId(@Param("bookId") Long bookId);

    /**
     * Find top-rated reviews for a book
     */
    @Query("SELECT br FROM BookReview br WHERE br.book.id = :bookId ORDER BY br.rating DESC, br.createdAt DESC")
    Page<BookReview> findTopRatedByBookId(@Param("bookId") Long bookId, Pageable pageable);
}
