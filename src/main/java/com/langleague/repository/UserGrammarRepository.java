package com.langleague.repository;

import com.langleague.domain.UserGrammar;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserGrammar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserGrammarRepository extends JpaRepository<UserGrammar, Long> {
    /**
     * Find saved grammar by grammar ID and user login
     */
    Optional<UserGrammar> findByGrammar_IdAndAppUser_InternalUser_Login(Long grammarId, String userLogin);

    /**
     * Find all saved grammars for a user
     */
    Page<UserGrammar> findByAppUser_InternalUser_Login(String userLogin, Pageable pageable);

    /**
     * Check if user has saved this grammar
     */
    boolean existsByGrammar_IdAndAppUser_InternalUser_Login(Long grammarId, String userLogin);

    /**
     * Find all memorized grammars for a user
     */
    Page<UserGrammar> findByAppUser_InternalUser_LoginAndIsMemorized(String userLogin, Boolean isMemorized, Pageable pageable);

    /**
     * Find grammars that need review (for spaced repetition)
     */
    @Query(
        "SELECT ug FROM UserGrammar ug " +
            "WHERE ug.appUser.internalUser.login = :userLogin " +
            "AND ug.lastReviewed < :reviewDate " +
            "ORDER BY ug.lastReviewed ASC"
    )
    Page<UserGrammar> findGrammarsNeedReview(
        @org.springframework.data.repository.query.Param("userLogin") String userLogin,
        @org.springframework.data.repository.query.Param("reviewDate") java.time.Instant reviewDate,
        Pageable pageable
    );

    /**
     * Count total saved grammars for user
     */
    long countByAppUser_InternalUser_Login(String userLogin);

    /**
     * Count memorized grammars for user
     */
    long countByAppUser_InternalUser_LoginAndIsMemorized(String userLogin, Boolean isMemorized);

    /**
     * Delete saved grammar
     */
    void deleteByGrammar_IdAndAppUser_InternalUser_Login(Long grammarId, String userLogin);
}
