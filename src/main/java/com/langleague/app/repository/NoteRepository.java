package com.langleague.app.repository;

import com.langleague.app.domain.Note;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Note entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByUserProfileIdAndUnitId(Long userProfileId, Long unitId);
}
