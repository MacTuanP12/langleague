package com.langleague.repository;

import com.langleague.domain.WordExample;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WordExample entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WordExampleRepository extends JpaRepository<WordExample, Long> {}
