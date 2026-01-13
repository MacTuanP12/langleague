package com.langleague.app.service;

import com.langleague.app.domain.ExerciseOption;
import com.langleague.app.repository.ExerciseOptionRepository;
import com.langleague.app.service.dto.ExerciseOptionDTO;
import com.langleague.app.service.mapper.ExerciseOptionMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.ExerciseOption}.
 */
@Service
@Transactional
public class ExerciseOptionService {

    private static final Logger LOG = LoggerFactory.getLogger(ExerciseOptionService.class);

    private final ExerciseOptionRepository exerciseOptionRepository;

    private final ExerciseOptionMapper exerciseOptionMapper;

    public ExerciseOptionService(ExerciseOptionRepository exerciseOptionRepository, ExerciseOptionMapper exerciseOptionMapper) {
        this.exerciseOptionRepository = exerciseOptionRepository;
        this.exerciseOptionMapper = exerciseOptionMapper;
    }

    /**
     * Save a exerciseOption.
     *
     * @param exerciseOptionDTO the entity to save.
     * @return the persisted entity.
     */
    public ExerciseOptionDTO save(ExerciseOptionDTO exerciseOptionDTO) {
        LOG.debug("Request to save ExerciseOption : {}", exerciseOptionDTO);
        ExerciseOption exerciseOption = exerciseOptionMapper.toEntity(exerciseOptionDTO);
        exerciseOption = exerciseOptionRepository.save(exerciseOption);
        return exerciseOptionMapper.toDto(exerciseOption);
    }

    /**
     * Update a exerciseOption.
     *
     * @param exerciseOptionDTO the entity to save.
     * @return the persisted entity.
     */
    public ExerciseOptionDTO update(ExerciseOptionDTO exerciseOptionDTO) {
        LOG.debug("Request to update ExerciseOption : {}", exerciseOptionDTO);
        ExerciseOption exerciseOption = exerciseOptionMapper.toEntity(exerciseOptionDTO);
        exerciseOption = exerciseOptionRepository.save(exerciseOption);
        return exerciseOptionMapper.toDto(exerciseOption);
    }

    /**
     * Partially update a exerciseOption.
     *
     * @param exerciseOptionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ExerciseOptionDTO> partialUpdate(ExerciseOptionDTO exerciseOptionDTO) {
        LOG.debug("Request to partially update ExerciseOption : {}", exerciseOptionDTO);

        return exerciseOptionRepository
            .findById(exerciseOptionDTO.getId())
            .map(existingExerciseOption -> {
                exerciseOptionMapper.partialUpdate(existingExerciseOption, exerciseOptionDTO);

                return existingExerciseOption;
            })
            .map(exerciseOptionRepository::save)
            .map(exerciseOptionMapper::toDto);
    }

    /**
     * Get all the exerciseOptions.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseOptionDTO> findAll() {
        LOG.debug("Request to get all ExerciseOptions");
        return exerciseOptionRepository
            .findAll()
            .stream()
            .map(exerciseOptionMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the exerciseOptions by exerciseId.
     *
     * @param exerciseId the id of the exercise.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseOptionDTO> findAllByExerciseId(Long exerciseId) {
        LOG.debug("Request to get all ExerciseOptions by exerciseId : {}", exerciseId);
        return exerciseOptionRepository
            .findByExerciseId(exerciseId)
            .stream()
            .map(exerciseOptionMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one exerciseOption by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ExerciseOptionDTO> findOne(Long id) {
        LOG.debug("Request to get ExerciseOption : {}", id);
        return exerciseOptionRepository.findById(id).map(exerciseOptionMapper::toDto);
    }

    /**
     * Delete the exerciseOption by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ExerciseOption : {}", id);
        exerciseOptionRepository.deleteById(id);
    }
}
