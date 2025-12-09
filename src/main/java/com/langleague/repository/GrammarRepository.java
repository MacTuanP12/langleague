package com.langleague.repository;

import com.langleague.domain.Grammar;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Grammar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrammarRepository extends JpaRepository<Grammar, Long> {
    /**
     * Find all grammars by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of grammars
     */
    List<Grammar> findByChapterId(Long chapterId);
}
