package com.langleague.repository;

import com.langleague.domain.ChapterProgress;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ChapterProgress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChapterProgressRepository extends JpaRepository<ChapterProgress, Long> {
    Page<ChapterProgress> findByAppUser_InternalUser_Login(String login, Pageable pageable);

    List<ChapterProgress> findByChapter_BookIdAndAppUser_InternalUser_Login(Long bookId, String login);

    // --- Start of Optimizations & Fixes ---

    /**
     * OPTIMIZATION: Calculate average completion percentage directly in the database.
     *
     * @param bookId the book ID
     * @param userLogin the user login
     * @return completion percentage or null if no progress found.
     */
    @Query(
        "SELECT AVG(cp.percent) FROM ChapterProgress cp WHERE cp.chapter.book.id = :bookId AND cp.appUser.internalUser.login = :userLogin"
    )
    Double getAverageCompletionPercentageForBook(@Param("bookId") Long bookId, @Param("userLogin") String userLogin);

    /**
     * Find progress for a specific chapter and user.
     */
    java.util.Optional<ChapterProgress> findByChapterIdAndAppUser_InternalUser_Login(Long chapterId, String userLogin);

    /**
     * OPTIMIZATION: Find all user's chapter progresses, sorted by last accessed time.
     */
    List<ChapterProgress> findByAppUser_InternalUser_LoginOrderByLastAccessedDesc(String userLogin);

    /**
     * OPTIMIZATION: Find all user's chapter progresses with a specific completion status, sorted by last accessed time.
     */
    List<ChapterProgress> findByAppUser_InternalUser_LoginAndCompletedOrderByLastAccessedDesc(String userLogin, boolean completed);
    // --- End of Optimizations & Fixes ---
}
