package com.langleague.repository;

import com.langleague.domain.ReadingOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ReadingOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReadingOptionRepository extends JpaRepository<ReadingOption, Long> {}
