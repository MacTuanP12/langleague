package com.langleague.service;

import com.langleague.domain.Grammar;
import com.langleague.repository.GrammarRepository;
import com.langleague.service.dto.GrammarDTO;
import com.langleague.service.mapper.GrammarMapper;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Grammar}.
 */
@Service
@Transactional
public class GrammarService {

    private static final Logger LOG = LoggerFactory.getLogger(GrammarService.class);

    private final GrammarRepository grammarRepository;

    private final GrammarMapper grammarMapper;

    public GrammarService(GrammarRepository grammarRepository, GrammarMapper grammarMapper) {
        this.grammarRepository = grammarRepository;
        this.grammarMapper = grammarMapper;
    }

    /**
     * Save a grammar.
     *
     * @param grammarDTO the entity to save.
     * @return the persisted entity.
     */
    public GrammarDTO save(GrammarDTO grammarDTO) {
        LOG.debug("Request to save Grammar : {}", grammarDTO);
        Grammar grammar = grammarMapper.toEntity(grammarDTO);
        grammar = grammarRepository.save(grammar);
        return grammarMapper.toDto(grammar);
    }

    /**
     * Save a list of grammars.
     *
     * @param grammarDTOs the list of entities to save.
     * @return the list of persisted entities.
     */
    public List<GrammarDTO> saveAll(List<GrammarDTO> grammarDTOs) {
        LOG.debug("Request to save {} Grammars", grammarDTOs.size());
        List<Grammar> grammars = grammarMapper.toEntity(grammarDTOs);
        grammars = grammarRepository.saveAll(grammars);
        return grammarMapper.toDto(grammars);
    }

    /**
     * Update a grammar.
     *
     * @param grammarDTO the entity to save.
     * @return the persisted entity.
     */
    public GrammarDTO update(GrammarDTO grammarDTO) {
        LOG.debug("Request to update Grammar : {}", grammarDTO);
        Grammar grammar = grammarMapper.toEntity(grammarDTO);
        grammar = grammarRepository.save(grammar);
        return grammarMapper.toDto(grammar);
    }

    /**
     * Partially update a grammar.
     *
     * @param grammarDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<GrammarDTO> partialUpdate(GrammarDTO grammarDTO) {
        LOG.debug("Request to partially update Grammar : {}", grammarDTO);

        return grammarRepository
            .findById(grammarDTO.getId())
            .map(existingGrammar -> {
                grammarMapper.partialUpdate(existingGrammar, grammarDTO);

                return existingGrammar;
            })
            .map(grammarRepository::save)
            .map(grammarMapper::toDto);
    }

    /**
     * Get all the grammars.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<GrammarDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Grammars");
        return grammarRepository.findAll(pageable).map(grammarMapper::toDto);
    }

    /**
     * Get one grammar by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GrammarDTO> findOne(Long id) {
        LOG.debug("Request to get Grammar : {}", id);
        return grammarRepository.findById(id).map(grammarMapper::toDto);
    }

    /**
     * Delete the grammar by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Grammar : {}", id);
        grammarRepository.deleteById(id);
    }

    /**
     * Get all grammars by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return the list of grammars
     */
    @Transactional(readOnly = true)
    public java.util.List<GrammarDTO> findByChapterId(Long chapterId) {
        LOG.debug("Request to get grammars by chapter : {}", chapterId);
        return grammarRepository
            .findByChapterId(chapterId)
            .stream()
            .map(grammarMapper::toDto)
            .collect(java.util.stream.Collectors.toList());
    }
}
