package com.langleague.service;

import com.langleague.domain.SpeakingExercise;
import com.langleague.repository.SpeakingExerciseRepository;
import com.langleague.service.dto.SpeakingExerciseDTO;
import com.langleague.service.mapper.SpeakingExerciseMapper;
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
 * Service Implementation for managing {@link com.langleague.domain.SpeakingExercise}.
 */
@Service
@Transactional
public class SpeakingExerciseService {

    private static final Logger LOG = LoggerFactory.getLogger(SpeakingExerciseService.class);

    private final SpeakingExerciseRepository speakingExerciseRepository;

    private final SpeakingExerciseMapper speakingExerciseMapper;

    public SpeakingExerciseService(SpeakingExerciseRepository speakingExerciseRepository, SpeakingExerciseMapper speakingExerciseMapper) {
        this.speakingExerciseRepository = speakingExerciseRepository;
        this.speakingExerciseMapper = speakingExerciseMapper;
    }

    /**
     * Save a speakingExercise.
     *
     * @param speakingExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public SpeakingExerciseDTO save(SpeakingExerciseDTO speakingExerciseDTO) {
        LOG.debug("Request to save SpeakingExercise : {}", speakingExerciseDTO);
        SpeakingExercise speakingExercise = speakingExerciseMapper.toEntity(speakingExerciseDTO);
        speakingExercise = speakingExerciseRepository.save(speakingExercise);
        return speakingExerciseMapper.toDto(speakingExercise);
    }

    /**
     * Update a speakingExercise.
     *
     * @param speakingExerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public SpeakingExerciseDTO update(SpeakingExerciseDTO speakingExerciseDTO) {
        LOG.debug("Request to update SpeakingExercise : {}", speakingExerciseDTO);
        SpeakingExercise speakingExercise = speakingExerciseMapper.toEntity(speakingExerciseDTO);
        speakingExercise = speakingExerciseRepository.save(speakingExercise);
        return speakingExerciseMapper.toDto(speakingExercise);
    }

    /**
     * Partially update a speakingExercise.
     *
     * @param speakingExerciseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SpeakingExerciseDTO> partialUpdate(SpeakingExerciseDTO speakingExerciseDTO) {
        LOG.debug("Request to partially update SpeakingExercise : {}", speakingExerciseDTO);

        return speakingExerciseRepository
            .findById(speakingExerciseDTO.getId())
            .map(existingSpeakingExercise -> {
                speakingExerciseMapper.partialUpdate(existingSpeakingExercise, speakingExerciseDTO);

                return existingSpeakingExercise;
            })
            .map(speakingExerciseRepository::save)
            .map(speakingExerciseMapper::toDto);
    }

    /**
     * Get all the speakingExercises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<SpeakingExerciseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all SpeakingExercises");
        return speakingExerciseRepository.findAll(pageable).map(speakingExerciseMapper::toDto);
    }

    /**
     * Get one speakingExercise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SpeakingExerciseDTO> findOne(Long id) {
        LOG.debug("Request to get SpeakingExercise : {}", id);
        return speakingExerciseRepository.findById(id).map(speakingExerciseMapper::toDto);
    }

    /**
     * Delete the speakingExercise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete SpeakingExercise : {}", id);
        speakingExerciseRepository.deleteById(id);
    }

    /**
     * Get all speaking exercises by chapter ID.
     *
     * @param chapterId the chapter ID
     * @return list of speaking exercises
     */
    @Transactional(readOnly = true)
    public List<SpeakingExerciseDTO> findByChapterId(Long chapterId) {
        LOG.debug("Request to get SpeakingExercises by chapter : {}", chapterId);
        return speakingExerciseRepository
            .findByChapterId(chapterId)
            .stream()
            .map(speakingExerciseMapper::toDto)
            .collect(Collectors.toList());
    }
}
