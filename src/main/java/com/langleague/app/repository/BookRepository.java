package com.langleague.app.repository;

import com.langleague.app.domain.Book;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Book entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT b FROM Book b JOIN b.enrollments e WHERE e.userProfile.user.login = :login")
    Page<Book> findAllByEnrolledUser(@Param("login") String login, Pageable pageable);

    @Query(
        "SELECT b FROM Book b WHERE b.isPublic = true AND NOT EXISTS (SELECT e FROM Enrollment e WHERE e.book = b AND e.userProfile.user.login = :login)"
    )
    Page<Book> findAllByNotEnrolledUser(@Param("login") String login, Pageable pageable);

    Page<Book> findByIsPublic(Boolean isPublic, Pageable pageable);

    long countByTeacherProfileUserLogin(String login);

    Page<Book> findAllByTeacherProfileUserLogin(String login, Pageable pageable);

    /**
     * Find top 4 newest books ordered by creation date descending.
     * Used for featured/latest books on homepage.
     *
     * @return list of 4 most recently created books
     */
    List<Book> findTop4ByOrderByCreatedAtDesc();
}
