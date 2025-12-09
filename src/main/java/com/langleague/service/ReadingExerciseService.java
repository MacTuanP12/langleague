package com.langleague.service;

import com.langleague.domain.ReadingExercise;
import com.langleague.repository.ReadingExerciseRepository;
import com.langleague.service.dto.ReadingExerciseDTO;
import com.langleague.service.mapper.ReadingExerciseMapper;
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
 * Service Implementation for managing {@link com.langleague.domain.ReadingExercise}.
 */
@Service
@Transactional
public class ReadingExerciseService {

    private static final Logger LOG = LoggerFactory.getLogger(ReadingExerciseService.class);

    private final ReadingExerciseRepository readingExerciseRepository;

    private final ReadingExerciseMapper readingExerciseMapper;

    public ReadingExerciseService(ReadingExerciseRepository readingExerciseRepository, ReadingExerciseMapper readingExerciseMapper) {
        this.readingExerciseRepository = readingExerciseRepository;
        this.readingExerciseMapper = readingExerciseMapper;
    }

    /**
     * Save a readingExercise.
     *
     * @param readingExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public ReadingExerciseDTO save(ReadingExerciseDTO readingExerciseDTO) {
        LOG.debug("Request to save ReadingExercise : {}", readingExerciseDTO);
        ReadingExercise readingExercise = readingExerciseMapper.toEntity(readingExerciseDTO);
        readingExercise = readingExerciseRepository.save(readingExercise);
        return readingExerciseMapper.toDto(readingExercise);
    }

    /**
     * Update a readingExercise.
     *
     * @param readingExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public ReadingExerciseDTO update(ReadingExerciseDTO readingExerciseDTO) {
        LOG.debug("Request to update ReadingExercise : {}", readingExerciseDTO);
        ReadingExercise readingExercise = readingExerciseMapper.toEntity(readingExerciseDTO);
        readingExercise = readingExerciseRepository.save(readingExercise);
        return readingExerciseMapper.toDto(readingExercise);
    }

    /**
     * Partially update a readingExercise.
     *
     * @param readingExerciseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ReadingExerciseDTO> partialUpdate(ReadingExerciseDTO readingExerciseDTO) {
        LOG.debug("Request to partially update ReadingExercise : {}", readingExerciseDTO);

        return readingExerciseRepository
            .findById(readingExerciseDTO.getId())
            .map(existingReadingExercise -> {
                readingExerciseMapper.partialUpdate(existingReadingExercise, readingExerciseDTO);

                return existingReadingExercise;
            })
            .map(readingExerciseRepository::save)
            .map(readingExerciseMapper::toDto);
    }

    /**
     * Get all the readingExercises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ReadingExerciseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ReadingExercises");
        return readingExerciseRepository.findAll(pageable).map(readingExerciseMapper::toDto);
    }

    /**
     * Get one readingExercise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReadingExerciseDTO> findOne(Long id) {
        LOG.debug("Request to get ReadingExercise : {}", id);
        return readingExerciseRepository.findById(id).map(readingExerciseMapper::toDto);
    }

    /**
     * Delete the readingExercise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ReadingExercise : {}", id);
        readingExerciseRepository.deleteById(id);
    }

    /**
     * Get all reading exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of reading exercises
     */
    @Transactional(readOnly = true)
    public List<ReadingExerciseDTO> findByChapterId(Long chapterId) {
        LOG.debug("Request to get ReadingExercises by chapter : {}", chapterId);
        return readingExerciseRepository.findByChapterId(chapterId).stream().map(readingExerciseMapper::toDto).collect(Collectors.toList());
    }
}
