package com.langleague.app.repository;

import com.langleague.app.domain.Vocabulary;
import com.langleague.app.service.dto.GameVocabularyDTO;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vocabulary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    List<Vocabulary> findAllByUnitId(Long unitId);

    List<Vocabulary> findAllByUnitIdOrderByOrderIndexAsc(Long unitId);

    /**
     * Fetch lightweight game vocabulary DTOs for a specific unit.
     * Uses JPQL projection to avoid loading heavy entity relationships.
     *
     * @param unitId the unit ID
     * @return list of GameVocabularyDTO
     */
    @Query(
        "SELECT new com.langleague.app.service.dto.GameVocabularyDTO(" +
        "v.id, v.word, v.meaning, v.phonetic, v.example, v.imageUrl) " +
        "FROM Vocabulary v " +
        "WHERE v.unit.id = :unitId " +
        "ORDER BY v.orderIndex ASC"
    )
    List<GameVocabularyDTO> findGameVocabulariesByUnitId(@Param("unitId") Long unitId);

    /**
     * Fetch lightweight game vocabulary DTOs for a list of units.
     * Uses JPQL projection to avoid loading heavy entity relationships.
     *
     * @param unitIds the list of unit IDs
     * @return list of GameVocabularyDTO
     */
    @Query(
        "SELECT new com.langleague.app.service.dto.GameVocabularyDTO(" +
        "v.id, v.word, v.meaning, v.phonetic, v.example, v.imageUrl) " +
        "FROM Vocabulary v " +
        "WHERE v.unit.id IN :unitIds " +
        "ORDER BY v.unit.id ASC, v.orderIndex ASC"
    )
    List<GameVocabularyDTO> findGameVocabulariesByUnitIds(@Param("unitIds") List<Long> unitIds);
}
