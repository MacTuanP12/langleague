package com.langleague.app.service;

import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.ExerciseOption;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.ExerciseRepository;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.service.dto.ExerciseDTO;
import com.langleague.app.service.dto.ExerciseOptionDTO;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.mapper.ExerciseMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.Exercise}.
 */
@Service
@Transactional
public class ExerciseService {

    private static final Logger LOG = LoggerFactory.getLogger(ExerciseService.class);

    private final ExerciseRepository exerciseRepository;

    private final ExerciseMapper exerciseMapper;

    private final UnitRepository unitRepository;

    private final ExerciseOptionService exerciseOptionService;

    public ExerciseService(
        ExerciseRepository exerciseRepository,
        ExerciseMapper exerciseMapper,
        UnitRepository unitRepository,
        ExerciseOptionService exerciseOptionService
    ) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
        this.unitRepository = unitRepository;
        this.exerciseOptionService = exerciseOptionService;
    }

    /**
     * Save a exercise.
     *
     * @param exerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public ExerciseDTO save(ExerciseDTO exerciseDTO) {
        LOG.debug("Request to save Exercise : {}", exerciseDTO);
        Exercise exercise = exerciseMapper.toEntity(exerciseDTO);
        exercise = exerciseRepository.save(exercise);

        // Handle options for CREATE
        if (exerciseDTO.getOptions() != null && !exerciseDTO.getOptions().isEmpty()) {
            List<ExerciseOption> newOptions = new ArrayList<>();
            for (ExerciseOptionDTO optionDTO : exerciseDTO.getOptions()) {
                optionDTO.setId(null); // Ensure new

                ExerciseOption option = exerciseOptionService.toEntity(optionDTO);
                option.setExercise(exercise); // Use managed entity

                newOptions.add(option);
            }
            exerciseOptionService.saveAllEntities(newOptions);
        }

        // Return with options
        List<ExerciseOptionDTO> savedOptions = exerciseOptionService.findAllByExerciseId(exercise.getId());
        ExerciseDTO result = exerciseMapper.toDto(exercise);
        result.setOptions(savedOptions);
        return result;
    }

    /**
     * Save a list of exercises for a specific unit.
     * OPTIMIZED: Fixed N+1 problem by using batch operations and reducing database round-trips.
     *
     * @param unitId the id of the unit.
     * @param exercises the list of exercises to save.
     * @return the list of saved exercises.
     */
    @Transactional
    public List<ExerciseDTO> saveBulk(Long unitId, List<ExerciseDTO> exercises) {
        LOG.debug("Request to save bulk Exercises for unit : {}", unitId);

        Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new IllegalArgumentException("Unit not found with id: " + unitId));

        // Step 1: Prepare all exercises
        List<Exercise> exercisesToSave = new ArrayList<>();
        for (ExerciseDTO exerciseDTO : exercises) {
            exerciseDTO.setUnitId(unit.getId());
            Exercise exercise = exerciseMapper.toEntity(exerciseDTO);
            exercisesToSave.add(exercise);
        }

        // Step 2: Batch save all exercises (reduces N DB calls to 1)
        List<Exercise> savedExerciseEntities = exerciseRepository.saveAll(exercisesToSave);

        // Step 3: Prepare all options for all exercises
        List<ExerciseOption> allOptionsToSave = new ArrayList<>();
        Map<Long, List<ExerciseOptionDTO>> exerciseIdToOptionsMap = new HashMap<>();

        for (int i = 0; i < exercises.size(); i++) {
            ExerciseDTO exerciseDTO = exercises.get(i);
            Exercise savedExercise = savedExerciseEntities.get(i);

            if (exerciseDTO.getOptions() != null && !exerciseDTO.getOptions().isEmpty()) {
                exerciseIdToOptionsMap.put(savedExercise.getId(), exerciseDTO.getOptions());

                for (ExerciseOptionDTO optionDTO : exerciseDTO.getOptions()) {
                    ExerciseOption option = exerciseOptionService.toEntity(optionDTO);
                    option.setExercise(savedExercise); // Use managed entity
                    allOptionsToSave.add(option);
                }
            }
        }

        // Step 4: Batch save all options (reduces M DB calls to 1)
        List<ExerciseOption> savedOptions = new ArrayList<>();
        if (!allOptionsToSave.isEmpty()) {
            savedOptions = exerciseOptionService.saveAllEntities(allOptionsToSave);
        }

        // Step 5: Map saved options back to exercises
        List<ExerciseDTO> result = new ArrayList<>();
        int optionIndex = 0;

        for (Exercise savedExercise : savedExerciseEntities) {
            ExerciseDTO exerciseDTO = exerciseMapper.toDto(savedExercise);

            List<ExerciseOptionDTO> optionDTOs = exerciseIdToOptionsMap.get(savedExercise.getId());
            if (optionDTOs != null && !optionDTOs.isEmpty()) {
                List<ExerciseOptionDTO> savedOptionDTOs = new ArrayList<>();
                for (int j = 0; j < optionDTOs.size(); j++) {
                    if (optionIndex < savedOptions.size()) {
                        ExerciseOption option = savedOptions.get(optionIndex++);
                        savedOptionDTOs.add(exerciseOptionService.toDto(option));
                    }
                }
                exerciseDTO.setOptions(savedOptionDTOs);
            }

            result.add(exerciseDTO);
        }

        return result;
    }

    /**
     * Update a exercise.
     *
     * @param exerciseDTO the entity to save.
     * @return the persisted entity.
     */
    public ExerciseDTO update(ExerciseDTO exerciseDTO) {
        LOG.debug("Request to update Exercise : {}", exerciseDTO);
        Exercise exercise = exerciseMapper.toEntity(exerciseDTO);
        exercise = exerciseRepository.save(exercise);

        // Handle options
        if (exerciseDTO.getOptions() != null) {
            // 1. Delete existing options
            List<ExerciseOptionDTO> existingOptions = exerciseOptionService.findAllByExerciseId(exercise.getId());
            for (ExerciseOptionDTO option : existingOptions) {
                exerciseOptionService.delete(option.getId());
            }

            // 2. Save new options
            List<ExerciseOption> newOptions = new ArrayList<>();
            for (ExerciseOptionDTO optionDTO : exerciseDTO.getOptions()) {
                // Reset ID to ensure creation
                optionDTO.setId(null);

                ExerciseOption option = exerciseOptionService.toEntity(optionDTO);
                option.setExercise(exercise); // Use managed entity

                newOptions.add(option);
            }
            exerciseOptionService.saveAllEntities(newOptions);
        }

        // Return with options
        List<ExerciseOptionDTO> savedOptions = exerciseOptionService.findAllByExerciseId(exercise.getId());
        ExerciseDTO result = exerciseMapper.toDto(exercise);
        result.setOptions(savedOptions);
        return result;
    }

    /**
     * Update a list of exercises in bulk.
     * OPTIMIZED: Uses batch operations to reduce database round-trips.
     *
     * @param exercises the list of exercises to update.
     * @return the list of updated exercises.
     */
    @Transactional
    public List<ExerciseDTO> bulkUpdate(List<ExerciseDTO> exercises) {
        LOG.debug("Request to bulk update Exercises, count: {}", exercises.size());

        if (exercises.isEmpty()) {
            return List.of();
        }

        // Step 1: Verify all exercises exist and prepare entities
        List<Exercise> exercisesToUpdate = new ArrayList<>();
        for (ExerciseDTO exerciseDTO : exercises) {
            if (exerciseDTO.getId() == null) {
                throw new IllegalArgumentException("Exercise ID cannot be null for bulk update");
            }
            Exercise exercise = exerciseMapper.toEntity(exerciseDTO);
            exercisesToUpdate.add(exercise);
        }

        // Step 2: Batch update all exercises (reduces N DB calls to 1)
        List<Exercise> updatedExercises = exerciseRepository.saveAll(exercisesToUpdate);

        // Step 3: Convert to DTOs
        return updatedExercises.stream().map(exerciseMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Partially update a exercise.
     *
     * @param exerciseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ExerciseDTO> partialUpdate(ExerciseDTO exerciseDTO) {
        LOG.debug("Request to partially update Exercise : {}", exerciseDTO);

        return exerciseRepository
            .findById(exerciseDTO.getId())
            .map(existingExercise -> {
                exerciseMapper.partialUpdate(existingExercise, exerciseDTO);

                return existingExercise;
            })
            .map(exerciseRepository::save)
            .map(exerciseMapper::toDto);
    }

    /**
     * Get all the exercises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ExerciseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Exercises");
        return exerciseRepository.findAll(pageable).map(exerciseMapper::toDto);
    }

    /**
     * Get one exercise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ExerciseDTO> findOne(Long id) {
        LOG.debug("Request to get Exercise : {}", id);
        return exerciseRepository.findById(id).map(exerciseMapper::toDto);
    }

    /**
     * Get all the exercises by unit id.
     *
     * @param unitId the id of the unit.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ExerciseDTO> findAllByUnitId(Long unitId) {
        LOG.debug("Request to get all Exercises by unitId : {}", unitId);
        return exerciseRepository
            .findAllByUnitIdOrderByOrderIndexAsc(unitId)
            .stream()
            .map(exerciseMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get all the exercises by unit id WITH OPTIONS (for self-study mode).
     * This method eagerly fetches options to avoid N+1 problem.
     * The options include the isCorrect field for client-side answer checking.
     *
     * @param unitId the id of the unit.
     * @return the list of entities with options included.
     */
    @Transactional(readOnly = true)
    public List<ExerciseDTO> findAllByUnitIdWithOptions(Long unitId) {
        LOG.debug("Request to get all Exercises with options by unitId : {}", unitId);
        return exerciseRepository.findAllByUnitIdWithOptions(unitId).stream().map(exerciseMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Check the answer for an exercise.
     *
     * @param exerciseId the id of the exercise.
     * @param studentAnswer the student's answer.
     * @return 'CORRECT' or 'WRONG'.
     */
    @Transactional(readOnly = true)
    public String checkAnswer(Long exerciseId, String studentAnswer) {
        LOG.debug("Request to check answer for Exercise : {}", exerciseId);
        return exerciseRepository
            .findById(exerciseId)
            .map(exercise -> {
                String correctAnswer = exercise.getCorrectAnswerRaw();
                if (correctAnswer != null && correctAnswer.trim().equalsIgnoreCase(studentAnswer != null ? studentAnswer.trim() : "")) {
                    return "CORRECT";
                }
                return "WRONG";
            })
            .orElse("WRONG");
    }

    /**
     * Delete the exercise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Exercise : {}", id);
        exerciseRepository.deleteById(id);
    }
}
