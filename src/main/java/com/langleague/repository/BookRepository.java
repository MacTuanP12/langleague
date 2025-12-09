package com.langleague.repository;

import com.langleague.domain.Book;
import com.langleague.domain.enumeration.Level;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Book entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    /**
     * Find books by title or description containing keyword (case-insensitive).
     * Use case 18: Search lessons
     */
    Page<Book> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);

    /**
     * Find books by level.
     * Use case 27: Get lesson recommendation
     */
    List<Book> findByLevel(Level level);

    /**
     * Find books by multiple levels.
     * Use case 27: Get lesson recommendation for multiple levels
     */
    List<Book> findByLevelIn(List<Level> levels);

    /**
     * Count books by level.
     * Use case: Statistics and analytics
     */
    long countByLevel(Level level);

    /**
     * Check if book exists by title.
     * Use case: Prevent duplicate book titles
     */
    boolean existsByTitle(String title);

    /**
     * Check if book exists by title and id not equal.
     * Use case: Prevent duplicate book titles when updating
     */
    boolean existsByTitleAndIdNot(String title, Long id);

    /**
     * Find only active books.
     * Use case: Display only active books to users
     */
    Page<Book> findByIsActiveTrue(Pageable pageable);

    /**
     * Find active books by level.
     */
    List<Book> findByIsActiveTrueAndLevel(Level level);

    /**
     * Find active books by multiple levels.
     */
    List<Book> findByIsActiveTrueAndLevelIn(List<Level> levels);

    /**
     * Search active books only.
     */
    Page<Book> findByIsActiveTrueAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String title,
        String description,
        Pageable pageable
    );

    /**
     * Find only inactive books.
     * Use case: Display only inactive books to admins
     */
    Page<Book> findByIsActiveFalse(Pageable pageable);
}
