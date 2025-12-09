package com.langleague.repository;

import com.langleague.domain.ListeningOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ListeningOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListeningOptionRepository extends JpaRepository<ListeningOption, Long> {}
