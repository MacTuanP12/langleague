package com.langleague.service;

import com.langleague.domain.Word;
import com.langleague.repository.WordRepository;
import com.langleague.service.dto.WordDTO;
import com.langleague.service.mapper.WordMapper;
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
 * Service Implementation for managing {@link com.langleague.domain.Word}.
 */
@Service
@Transactional
public class WordService {

    private static final Logger LOG = LoggerFactory.getLogger(WordService.class);

    private final WordRepository wordRepository;

    private final WordMapper wordMapper;

    public WordService(WordRepository wordRepository, WordMapper wordMapper) {
        this.wordRepository = wordRepository;
        this.wordMapper = wordMapper;
    }

    /**
     * Save a word.
     *
     * @param wordDTO the entity to save.
     * @return the persisted entity.
     */
    public WordDTO save(WordDTO wordDTO) {
        LOG.debug("Request to save Word : {}", wordDTO);
        Word word = wordMapper.toEntity(wordDTO);
        word = wordRepository.save(word);
        return wordMapper.toDto(word);
    }

    /**
     * Save a list of words.
     *
     * @param wordDTOs the list of entities to save.
     * @return the list of persisted entities.
     */
    public List<WordDTO> saveAll(List<WordDTO> wordDTOs) {
        LOG.debug("Request to save {} Words", wordDTOs.size());
        List<Word> words = wordMapper.toEntity(wordDTOs);
        words = wordRepository.saveAll(words);
        return wordMapper.toDto(words);
    }

    /**
     * Update a word.
     *
     * @param wordDTO the entity to save.
     * @return the persisted entity.
     */
    public WordDTO update(WordDTO wordDTO) {
        LOG.debug("Request to update Word : {}", wordDTO);

        // Validate required fields
        if (wordDTO == null) {
            throw new IllegalArgumentException("WordDTO cannot be null");
        }
        if (wordDTO.getId() == null) {
            throw new IllegalArgumentException("ID is required for update");
        }

        Word word = wordMapper.toEntity(wordDTO);
        word = wordRepository.save(word);
        return wordMapper.toDto(word);
    }

    /**
     * Partially update a word.
     *
     * @param wordDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<WordDTO> partialUpdate(WordDTO wordDTO) {
        LOG.debug("Request to partially update Word : {}", wordDTO);

        return wordRepository
            .findById(wordDTO.getId())
            .map(existingWord -> {
                wordMapper.partialUpdate(existingWord, wordDTO);

                return existingWord;
            })
            .map(wordRepository::save)
            .map(wordMapper::toDto);
    }

    /**
     * Get all the words.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<WordDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Words");
        return wordRepository.findAll(pageable).map(wordMapper::toDto);
    }

    /**
     * Get one word by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WordDTO> findOne(Long id) {
        LOG.debug("Request to get Word : {}", id);
        return wordRepository.findById(id).map(wordMapper::toDto);
    }

    /**
     * Delete the word by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Word : {}", id);
        wordRepository.deleteById(id);
    }

    /**
     * Get all words by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return the list of words
     */
    @Transactional(readOnly = true)
    public java.util.List<WordDTO> findByChapterId(Long chapterId) {
        LOG.debug("Request to get words by chapter : {}", chapterId);
        return wordRepository.findByChapterId(chapterId).stream().map(wordMapper::toDto).collect(java.util.stream.Collectors.toList());
    }
}
