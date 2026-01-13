package com.langleague.app.repository;

import com.langleague.app.domain.Vocabulary;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vocabulary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    List<Vocabulary> findAllByUnitId(Long unitId);

    List<Vocabulary> findAllByUnitIdOrderByOrderIndexAsc(Long unitId);
}
