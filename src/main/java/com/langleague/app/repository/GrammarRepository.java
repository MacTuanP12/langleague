package com.langleague.app.repository;

import com.langleague.app.domain.Grammar;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Grammar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrammarRepository extends JpaRepository<Grammar, Long> {
    List<Grammar> findAllByUnitId(Long unitId);

    List<Grammar> findAllByUnitIdOrderByOrderIndexAsc(Long unitId);
}
