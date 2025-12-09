package com.langleague.service;

import com.langleague.domain.GrammarExample;
import com.langleague.repository.GrammarExampleRepository;
import com.langleague.service.dto.GrammarExampleDTO;
import com.langleague.service.mapper.GrammarExampleMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.GrammarExample}.
 */
@Service
@Transactional
public class GrammarExampleService {

    private static final Logger LOG = LoggerFactory.getLogger(GrammarExampleService.class);

    private final GrammarExampleRepository grammarExampleRepository;

    private final GrammarExampleMapper grammarExampleMapper;

    public GrammarExampleService(GrammarExampleRepository grammarExampleRepository, GrammarExampleMapper grammarExampleMapper) {
        this.grammarExampleRepository = grammarExampleRepository;
        this.grammarExampleMapper = grammarExampleMapper;
    }

    /**
     * Save a grammarExample.
     *
     * @param grammarExampleDTO the entity to save.
     * @return the persisted entity.
     */
    public GrammarExampleDTO save(GrammarExampleDTO grammarExampleDTO) {
        LOG.debug("Request to save GrammarExample : {}", grammarExampleDTO);
        GrammarExample grammarExample = grammarExampleMapper.toEntity(grammarExampleDTO);
        grammarExample = grammarExampleRepository.save(grammarExample);
        return grammarExampleMapper.toDto(grammarExample);
    }

    /**
     * Update a grammarExample.
     *
     * @param grammarExampleDTO the entity to save.
     * @return the persisted entity.
     */
    public GrammarExampleDTO update(GrammarExampleDTO grammarExampleDTO) {
        LOG.debug("Request to update GrammarExample : {}", grammarExampleDTO);
        GrammarExample grammarExample = grammarExampleMapper.toEntity(grammarExampleDTO);
        grammarExample = grammarExampleRepository.save(grammarExample);
        return grammarExampleMapper.toDto(grammarExample);
    }

    /**
     * Partially update a grammarExample.
     *
     * @param grammarExampleDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<GrammarExampleDTO> partialUpdate(GrammarExampleDTO grammarExampleDTO) {
        LOG.debug("Request to partially update GrammarExample : {}", grammarExampleDTO);

        return grammarExampleRepository
            .findById(grammarExampleDTO.getId())
            .map(existingGrammarExample -> {
                grammarExampleMapper.partialUpdate(existingGrammarExample, grammarExampleDTO);

                return existingGrammarExample;
            })
            .map(grammarExampleRepository::save)
            .map(grammarExampleMapper::toDto);
    }

    /**
     * Get all the grammarExamples.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<GrammarExampleDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all GrammarExamples");
        return grammarExampleRepository.findAll(pageable).map(grammarExampleMapper::toDto);
    }

    /**
     * Get one grammarExample by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GrammarExampleDTO> findOne(Long id) {
        LOG.debug("Request to get GrammarExample : {}", id);
        return grammarExampleRepository.findById(id).map(grammarExampleMapper::toDto);
    }

    /**
     * Delete the grammarExample by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete GrammarExample : {}", id);
        grammarExampleRepository.deleteById(id);
    }
}
