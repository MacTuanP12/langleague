package com.langleague.repository;

import com.langleague.domain.Authority;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Authority entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthorityRepository extends JpaRepository<Authority, String> {
    /**
     * Find authorities by names (batch query)
     */
    Set<Authority> findByNameIn(Set<String> names);
}
