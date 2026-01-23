package com.langleague.app.repository;

import com.langleague.app.domain.Progress;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Progress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    @Query("select progress from Progress progress where progress.userProfile.user.login = ?#{authentication.name}")
    List<Progress> findByUserIsCurrentUser();

    @Query(
        "select progress from Progress progress where progress.userProfile.user.login = ?#{authentication.name} and progress.unit.id = ?1"
    )
    Optional<Progress> findByUserIsCurrentUserAndUnitId(Long unitId);

    List<Progress> findByUserProfileId(Long userProfileId);

    List<Progress> findByUnitId(Long unitId);

    Optional<Progress> findByUserProfileIdAndUnitId(Long userProfileId, Long unitId);

    @Query(
        "select progress from Progress progress where progress.userProfile.user.login = ?#{authentication.name} and progress.isBookmarked = true order by progress.lastAccessedAt desc"
    )
    List<Progress> findBookmarkedByCurrentUser();

    @Query(
        "select progress from Progress progress where progress.userProfile.user.login = ?#{authentication.name} order by progress.lastAccessedAt desc"
    )
    List<Progress> findByCurrentUserOrderByLastAccessedAtDesc();

    long countByIsCompletedTrue();
}
