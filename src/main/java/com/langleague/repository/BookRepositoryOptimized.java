package com.langleague.repository;

import com.langleague.domain.Book;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Book entity with optimized queries.
 * Includes entity graphs to prevent N+1 query problems.
 */
@Repository
public interface BookRepositoryOptimized extends JpaRepository<Book, Long> {
    /**
     * Find book with chapters and exercises eagerly loaded
     * Prevents N+1 queries when fetching book details
     */
    @EntityGraph(
        attributePaths = { "chapters", "chapters.words", "chapters.grammars", "chapters.listeningExercises", "chapters.readingExercises" }
    )
    @Query("SELECT DISTINCT b FROM Book b WHERE b.id = :id")
    Optional<Book> findByIdWithFullDetails(@Param("id") Long id);

    /**
     * Find active books with review count
     * Uses DTO projection for better performance
     */
    @Query("SELECT b FROM Book b " + "LEFT JOIN FETCH b.chapters " + "WHERE b.isActive = true " + "ORDER BY b.id DESC")
    List<Book> findActiveWithChapters();

    /**
     * Search books with pagination, optimized
     * Uses native query to avoid HQL type issues with LOWER and CONCAT
     */
    @Query(
        value = "SELECT DISTINCT b.* FROM book b " +
            "WHERE b.is_active = true " +
            "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))",
        countQuery = "SELECT COUNT(DISTINCT b.id) FROM book b " +
            "WHERE b.is_active = true " +
            "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))",
        nativeQuery = true
    )
    Page<Book> searchOptimized(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Count books by level (only active books)
     */
    @Query("SELECT b.level, COUNT(b) FROM Book b WHERE b.isActive = true GROUP BY b.level")
    List<Object[]> countByLevel();
}
