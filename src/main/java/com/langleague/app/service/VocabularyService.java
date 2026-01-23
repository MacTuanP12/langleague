package com.langleague.app.service;

import com.langleague.app.domain.Vocabulary;
import com.langleague.app.repository.VocabularyRepository;
import com.langleague.app.service.dto.GameVocabularyDTO;
import com.langleague.app.service.dto.VocabularyDTO;
import com.langleague.app.service.mapper.VocabularyMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.Vocabulary}.
 */
@Service
@Transactional
public class VocabularyService {

    private static final Logger LOG = LoggerFactory.getLogger(VocabularyService.class);

    private final VocabularyRepository vocabularyRepository;

    private final VocabularyMapper vocabularyMapper;

    public VocabularyService(VocabularyRepository vocabularyRepository, VocabularyMapper vocabularyMapper) {
        this.vocabularyRepository = vocabularyRepository;
        this.vocabularyMapper = vocabularyMapper;
    }

    /**
     * Save a vocabulary.
     *
     * @param vocabularyDTO the entity to save.
     * @return the persisted entity.
     */
    public VocabularyDTO save(VocabularyDTO vocabularyDTO) {
        LOG.debug("Request to save Vocabulary : {}", vocabularyDTO);
        Vocabulary vocabulary = vocabularyMapper.toEntity(vocabularyDTO);
        vocabulary = vocabularyRepository.save(vocabulary);
        return vocabularyMapper.toDto(vocabulary);
    }

    /**
     * Save multiple vocabularies.
     *
     * @param unitId the id of the unit.
     * @param vocabularyDTOs the list of entities to save.
     * @return the list of persisted entities.
     */
    public List<VocabularyDTO> saveBulk(Long unitId, List<VocabularyDTO> vocabularyDTOs) {
        LOG.debug("Request to save bulk Vocabularies for unit : {}", unitId);
        List<Vocabulary> vocabularies = vocabularyMapper.toEntity(vocabularyDTOs);

        // Ensure all vocabularies are linked to the correct unit if not already
        // Note: The mapper should handle this if the DTO has the unit ID, but we can enforce it here if needed
        // Since we are using saveAll, it's more efficient

        vocabularies = vocabularyRepository.saveAll(vocabularies);
        return vocabularyMapper.toDto(vocabularies);
    }

    /**
     * Update a vocabulary.
     *
     * @param vocabularyDTO the entity to save.
     * @return the persisted entity.
     */
    public VocabularyDTO update(VocabularyDTO vocabularyDTO) {
        LOG.debug("Request to update Vocabulary : {}", vocabularyDTO);
        Vocabulary vocabulary = vocabularyMapper.toEntity(vocabularyDTO);
        vocabulary = vocabularyRepository.save(vocabulary);
        return vocabularyMapper.toDto(vocabulary);
    }

    /**
     * Partially update a vocabulary.
     *
     * @param vocabularyDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<VocabularyDTO> partialUpdate(VocabularyDTO vocabularyDTO) {
        LOG.debug("Request to partially update Vocabulary : {}", vocabularyDTO);

        return vocabularyRepository
            .findById(vocabularyDTO.getId())
            .map(existingVocabulary -> {
                vocabularyMapper.partialUpdate(existingVocabulary, vocabularyDTO);

                return existingVocabulary;
            })
            .map(vocabularyRepository::save)
            .map(vocabularyMapper::toDto);
    }

    /**
     * Get all the vocabularies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<VocabularyDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Vocabularies");
        return vocabularyRepository.findAll(pageable).map(vocabularyMapper::toDto);
    }

    /**
     * Get all the vocabularies by unitId.
     *
     * @param unitId the id of the unit.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<VocabularyDTO> findAllByUnitId(Long unitId) {
        LOG.debug("Request to get all Vocabularies by unitId : {}", unitId);
        return vocabularyRepository
            .findAllByUnitIdOrderByOrderIndexAsc(unitId)
            .stream()
            .map(vocabularyMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get one vocabulary by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<VocabularyDTO> findOne(Long id) {
        LOG.debug("Request to get Vocabulary : {}", id);
        return vocabularyRepository.findById(id).map(vocabularyMapper::toDto);
    }

    /**
     * Delete the vocabulary by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Vocabulary : {}", id);
        vocabularyRepository.deleteById(id);
    }

    /**
     * Get lightweight game vocabularies by unit ID.
     * This method fetches only essential fields for game play, avoiding heavy entity relationships.
     *
     * @param unitId the unit ID
     * @return list of GameVocabularyDTO
     */
    @Transactional(readOnly = true)
    public List<GameVocabularyDTO> getGameVocabularies(Long unitId) {
        LOG.debug("Request to get game vocabularies for unit : {}", unitId);
        return vocabularyRepository.findGameVocabulariesByUnitId(unitId);
    }

    /**
     * Get lightweight game vocabularies by a list of unit IDs.
     * This method fetches only essential fields for game play, avoiding heavy entity relationships.
     *
     * @param unitIds the list of unit IDs
     * @return list of GameVocabularyDTO
     */
    @Transactional(readOnly = true)
    public List<GameVocabularyDTO> getGameVocabulariesByUnits(List<Long> unitIds) {
        LOG.debug("Request to get game vocabularies for units : {}", unitIds);
        return vocabularyRepository.findGameVocabulariesByUnitIds(unitIds);
    }
}
