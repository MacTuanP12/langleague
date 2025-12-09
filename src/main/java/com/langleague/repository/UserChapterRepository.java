package com.langleague.repository;

import com.langleague.domain.UserChapter;
import com.langleague.domain.enumeration.LearningStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserChapter entity.
 */
@Repository
public interface UserChapterRepository extends JpaRepository<UserChapter, Long> {
    /**
     * Find by user login and chapter ID
     */
    Optional<UserChapter> findByAppUser_InternalUser_LoginAndChapter_Id(String userLogin, Long chapterId);

    /**
     * Find all user's saved chapters
     */
    List<UserChapter> findByAppUser_InternalUser_LoginOrderByLastAccessedAtDesc(String userLogin);

    /**
     * Find user's favorite chapters
     */
    List<UserChapter> findByAppUser_InternalUser_LoginAndIsFavoriteTrueOrderByLastAccessedAtDesc(String userLogin);

    /**
     * Find by learning status
     */
    List<UserChapter> findByAppUser_InternalUser_LoginAndLearningStatusOrderByLastAccessedAtDesc(String userLogin, LearningStatus status);

    /**
     * Find by book ID
     */
    @Query(
        "SELECT uc FROM UserChapter uc WHERE uc.appUser.internalUser.login = :userLogin AND uc.chapter.book.id = :bookId ORDER BY uc.chapter.orderIndex"
    )
    List<UserChapter> findByUserLoginAndBookId(@Param("userLogin") String userLogin, @Param("bookId") Long bookId);

    /**
     * Check if user has saved this chapter
     */
    boolean existsByAppUser_InternalUser_LoginAndChapter_Id(String userLogin, Long chapterId);

    /**
     * Count user's saved chapters
     */
    long countByAppUser_InternalUser_Login(String userLogin);

    /**
     * Count by status
     */
    long countByAppUser_InternalUser_LoginAndLearningStatus(String userLogin, LearningStatus status);

    /**
     * Count favorites
     */
    long countByAppUser_InternalUser_LoginAndIsFavoriteTrue(String userLogin);

    /**
     * Delete by user and chapter
     */
    void deleteByAppUser_InternalUser_LoginAndChapter_Id(String userLogin, Long chapterId);
}
