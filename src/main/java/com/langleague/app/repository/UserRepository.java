package com.langleague.app.repository;

import com.langleague.app.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";
    Optional<User> findOneByActivationKey(String activationKey);
    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);
    Optional<User> findOneByResetKey(String resetKey);
    Optional<User> findOneByEmailIgnoreCase(String email);
    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE, unless = "#result == null")
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE, unless = "#result == null")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    @Query(
        "SELECT DISTINCT u FROM User u LEFT JOIN u.authorities a WHERE " +
        "(:login IS NULL OR " +
        "lower(u.login) LIKE lower(concat('%', :login,'%')) OR " +
        "lower(u.email) LIKE lower(concat('%', :login,'%')) OR " +
        "lower(u.firstName) LIKE lower(concat('%', :login,'%')) OR " +
        "lower(u.lastName) LIKE lower(concat('%', :login,'%'))) AND " +
        "(:role IS NULL OR a.name = :role) AND " +
        "(:activated IS NULL OR u.activated = :activated)"
    )
    Page<User> findAllWithFilters(
        @Param("login") String login,
        @Param("role") String role,
        @Param("activated") Boolean activated,
        Pageable pageable
    );
}
