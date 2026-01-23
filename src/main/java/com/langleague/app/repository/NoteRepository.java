package com.langleague.app.repository;

import com.langleague.app.domain.Note;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Note entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByUserProfileIdAndUnitId(Long userProfileId, Long unitId);

    Page<Note> findAllByUserProfileId(Long userProfileId, Pageable pageable);

    Page<Note> findAllByUserProfileIdAndUnitId(Long userProfileId, Long unitId, Pageable pageable);

    /**
     * Efficiently checks if a note exists for a given user profile and unit.
     * This is more performant than fetching the entire list.
     *
     * @param userProfileId the user profile ID.
     * @param unitId the unit ID.
     * @return true if a note exists, false otherwise.
     */
    boolean existsByUserProfileIdAndUnitId(Long userProfileId, Long unitId);
}
