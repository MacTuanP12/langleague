package com.langleague.repository;

import com.langleague.domain.UserBook;
import com.langleague.domain.enumeration.LearningStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserBook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserBookRepository extends JpaRepository<UserBook, Long> {
    @Query(
        "SELECT ub FROM UserBook ub " +
            "LEFT JOIN FETCH ub.book b " +
            "WHERE ub.appUser.id = :userId " +
            "ORDER BY ub.lastAccessedAt DESC NULLS LAST, ub.savedAt DESC"
    )
    List<UserBook> findByAppUser_IdWithBook(@Param("userId") Long userId);

    @Query("SELECT ub FROM UserBook ub WHERE ub.appUser.id = :userId AND ub.book.id = :bookId")
    Optional<UserBook> findByAppUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId);

    @Query("SELECT ub FROM UserBook ub WHERE ub.appUser.id = :userId AND ub.isFavorite = true")
    List<UserBook> findFavoritesByUserId(@Param("userId") Long userId);

    @Query("SELECT ub FROM UserBook ub WHERE ub.appUser.id = :userId AND ub.learningStatus = :status")
    List<UserBook> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") LearningStatus status);

    @Query("SELECT COUNT(ub) FROM UserBook ub WHERE ub.appUser.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(ub) FROM UserBook ub WHERE ub.appUser.id = :userId AND ub.learningStatus = :status")
    Long countByAppUserIdAndLearningStatus(@Param("userId") Long userId, @Param("status") LearningStatus status);

    Long countByAppUserId(Long userId);

    boolean existsByAppUser_IdAndBook_Id(Long userId, Long bookId);
}
