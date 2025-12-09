package com.langleague.service;

import com.langleague.domain.WordExample;
import com.langleague.repository.WordExampleRepository;
import com.langleague.service.dto.WordExampleDTO;
import com.langleague.service.mapper.WordExampleMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.WordExample}.
 */
@Service
@Transactional
public class WordExampleService {

    private static final Logger LOG = LoggerFactory.getLogger(WordExampleService.class);

    private final WordExampleRepository wordExampleRepository;

    private final WordExampleMapper wordExampleMapper;

    public WordExampleService(WordExampleRepository wordExampleRepository, WordExampleMapper wordExampleMapper) {
        this.wordExampleRepository = wordExampleRepository;
        this.wordExampleMapper = wordExampleMapper;
    }

    /**
     * Save a wordExample.
     *
     * @param wordExampleDTO the entity to save.
     * @return the persisted entity.
     */
    public WordExampleDTO save(WordExampleDTO wordExampleDTO) {
        LOG.debug("Request to save WordExample : {}", wordExampleDTO);

        // Validate required fields
        if (wordExampleDTO == null) {
            throw new IllegalArgumentException("WordExampleDTO cannot be null");
        }
        if (wordExampleDTO.getExampleText() == null || wordExampleDTO.getExampleText().trim().isEmpty()) {
            throw new IllegalArgumentException("Example text is required");
        }
        if (wordExampleDTO.getWord() == null || wordExampleDTO.getWord().getId() == null) {
            throw new IllegalArgumentException("Word is required");
        }

        WordExample wordExample = wordExampleMapper.toEntity(wordExampleDTO);
        wordExample = wordExampleRepository.save(wordExample);
        return wordExampleMapper.toDto(wordExample);
    }

    /**
     * Update a wordExample.
     *
     * @param wordExampleDTO the entity to save.
     * @return the persisted entity.
     */
    public WordExampleDTO update(WordExampleDTO wordExampleDTO) {
        LOG.debug("Request to update WordExample : {}", wordExampleDTO);
        WordExample wordExample = wordExampleMapper.toEntity(wordExampleDTO);
        wordExample = wordExampleRepository.save(wordExample);
        return wordExampleMapper.toDto(wordExample);
    }

    /**
     * Partially update a wordExample.
     *
     * @param wordExampleDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<WordExampleDTO> partialUpdate(WordExampleDTO wordExampleDTO) {
        LOG.debug("Request to partially update WordExample : {}", wordExampleDTO);

        return wordExampleRepository
            .findById(wordExampleDTO.getId())
            .map(existingWordExample -> {
                wordExampleMapper.partialUpdate(existingWordExample, wordExampleDTO);

                return existingWordExample;
            })
            .map(wordExampleRepository::save)
            .map(wordExampleMapper::toDto);
    }

    /**
     * Get all the wordExamples.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<WordExampleDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all WordExamples");
        return wordExampleRepository.findAll(pageable).map(wordExampleMapper::toDto);
    }

    /**
     * Get one wordExample by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WordExampleDTO> findOne(Long id) {
        LOG.debug("Request to get WordExample : {}", id);
        return wordExampleRepository.findById(id).map(wordExampleMapper::toDto);
    }

    /**
     * Delete the wordExample by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete WordExample : {}", id);
        wordExampleRepository.deleteById(id);
    }
}
