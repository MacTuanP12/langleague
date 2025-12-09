package com.langleague.service;

import com.langleague.domain.WritingExercise;
import com.langleague.repository.WritingExerciseRepository;
import com.langleague.service.dto.WritingExerciseDTO;
import com.langleague.service.mapper.WritingExerciseMapper;
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
 * Service Implementation for managing {@link com.langleague.domain.WritingExercise}.
 */
@Service
@Transactional
public class WritingExerciseService {

    private static final Logger LOG = LoggerFactory.getLogger(WritingExerciseService.class);

    private final WritingExerciseRepository writingExerciseRepository;

    private final WritingExerciseMapper writingExerciseMapper;

    public WritingExerciseService(WritingExerciseRepository writingExerciseRepository, WritingExerciseMapper writingExerciseMapper) {
        this.writingExerciseRepository = writingExerciseRepository;
        this.writingExerciseMapper = writingExerciseMapper;
    }

    /**
     * Save a writingExercise.
     *
     * @param writingExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public WritingExerciseDTO save(WritingExerciseDTO writingExerciseDTO) {
        LOG.debug("Request to save WritingExercise : {}", writingExerciseDTO);
        WritingExercise writingExercise = writingExerciseMapper.toEntity(writingExerciseDTO);
        writingExercise = writingExerciseRepository.save(writingExercise);
        return writingExerciseMapper.toDto(writingExercise);
    }

    /**
     * Update a writingExercise.
     *
     * @param writingExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public WritingExerciseDTO update(WritingExerciseDTO writingExerciseDTO) {
        LOG.debug("Request to update WritingExercise : {}", writingExerciseDTO);
        WritingExercise writingExercise = writingExerciseMapper.toEntity(writingExerciseDTO);
        writingExercise = writingExerciseRepository.save(writingExercise);
        return writingExerciseMapper.toDto(writingExercise);
    }

    /**
     * Partially update a writingExercise.
     *
     * @param writingExerciseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<WritingExerciseDTO> partialUpdate(WritingExerciseDTO writingExerciseDTO) {
        LOG.debug("Request to partially update WritingExercise : {}", writingExerciseDTO);

        return writingExerciseRepository
            .findById(writingExerciseDTO.getId())
            .map(existingWritingExercise -> {
                writingExerciseMapper.partialUpdate(existingWritingExercise, writingExerciseDTO);

                return existingWritingExercise;
            })
            .map(writingExerciseRepository::save)
            .map(writingExerciseMapper::toDto);
    }

    /**
     * Get all the writingExercises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<WritingExerciseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all WritingExercises");
        return writingExerciseRepository.findAll(pageable).map(writingExerciseMapper::toDto);
    }

    /**
     * Get one writingExercise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WritingExerciseDTO> findOne(Long id) {
        LOG.debug("Request to get WritingExercise : {}", id);
        return writingExerciseRepository.findById(id).map(writingExerciseMapper::toDto);
    }

    /**
     * Delete the writingExercise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete WritingExercise : {}", id);
        writingExerciseRepository.deleteById(id);
    }

    /**
     * Get all writing exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of writing exercises
     */
    @Transactional(readOnly = true)
    public List<WritingExerciseDTO> findByChapterId(Long chapterId) {
        LOG.debug("Request to get WritingExercises by chapter : {}", chapterId);
        return writingExerciseRepository.findByChapterId(chapterId).stream().map(writingExerciseMapper::toDto).collect(Collectors.toList());
    }
}
