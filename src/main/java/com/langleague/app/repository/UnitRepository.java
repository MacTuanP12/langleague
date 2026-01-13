package com.langleague.app.repository;

import com.langleague.app.domain.Unit;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Unit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    List<Unit> findAllByBookIdOrderByOrderIndexAsc(Long bookId);
}
