package com.langleague.repository;

import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AppUser entity.
 */

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByInternalUser_Login(String login);

    // Find by User entity
    Optional<AppUser> findByInternalUser(User user);

    // Alias for compatibility
    default Optional<AppUser> findByUser_Login(String login) {
        return findByInternalUser_Login(login);
    }

    Optional<AppUser> findByInternalUserId(Long userId);

    /**
     * Business Analytics Queries
     */

    @Query("SELECT COUNT(a) FROM AppUser a WHERE a.internalUser.createdDate BETWEEN :startDate AND :endDate")
    Long countByCreatedDateBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}
