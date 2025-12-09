package com.langleague.repository;

import com.langleague.domain.GrammarExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GrammarExample entity.
 */
@Repository
public interface GrammarExampleRepository extends JpaRepository<GrammarExample, Long> {}
