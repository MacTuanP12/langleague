package com.langleague.repository;

import com.langleague.domain.UserVocabulary;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserVocabulary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserVocabularyRepository extends JpaRepository<UserVocabulary, Long> {
    /**
     * Find saved word by word ID and user login
     */
    Optional<UserVocabulary> findByWord_IdAndAppUser_InternalUser_Login(Long wordId, String userLogin);

    /**
     * Find all saved words for a user
     */
    Page<UserVocabulary> findByAppUser_InternalUser_Login(String userLogin, Pageable pageable);

    /**
     * Check if user has saved this word
     */
    boolean existsByWord_IdAndAppUser_InternalUser_Login(Long wordId, String userLogin);

    /**
     * Find all memorized words for a user
     */
    Page<UserVocabulary> findByAppUser_InternalUser_LoginAndIsMemorized(String userLogin, Boolean isMemorized, Pageable pageable);

    /**
     * Find words that need review today (SRS - Spaced Repetition System)
     */
    Page<UserVocabulary> findByAppUser_InternalUser_LoginAndNextReviewDateLessThanEqual(
        String userLogin,
        LocalDate date,
        Pageable pageable
    );

    /**
     * Find words by review count (to see progress)
     */
    Page<UserVocabulary> findByAppUser_InternalUser_LoginAndReviewCountGreaterThan(
        String userLogin,
        Integer reviewCount,
        Pageable pageable
    );

    /**
     * Count total saved words for user
     */
    long countByAppUser_InternalUser_Login(String userLogin);

    /**
     * Count memorized words for user
     */
    long countByAppUser_InternalUser_LoginAndIsMemorized(String userLogin, Boolean isMemorized);

    /**
     * Count words need review today
     */
    long countByAppUser_InternalUser_LoginAndNextReviewDateLessThanEqual(String userLogin, LocalDate date);

    /**
     * Delete saved word
     */
    void deleteByWord_IdAndAppUser_InternalUser_Login(Long wordId, String userLogin);

    /**
     * Find words by chapter (through Word entity)
     */
    @Query(
        "SELECT uv FROM UserVocabulary uv " + "WHERE uv.appUser.internalUser.login = :userLogin " + "AND uv.word.chapter.id = :chapterId"
    )
    Page<UserVocabulary> findByUserAndChapter(
        @org.springframework.data.repository.query.Param("userLogin") String userLogin,
        @org.springframework.data.repository.query.Param("chapterId") Long chapterId,
        Pageable pageable
    );
}
