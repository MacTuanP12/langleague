package com.langleague.app.service;

import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.ExerciseRepository;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.service.dto.ExerciseDTO;
import com.langleague.app.service.dto.ExerciseOptionDTO;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.mapper.ExerciseMapper;
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
        return exerciseMapper.toDto(exercise);
    }

    /**
     * Save a list of exercises for a specific unit.
     *
     * @param unitId the id of the unit.
     * @param exercises the list of exercises to save.
     * @return the list of saved exercises.
     */
    @Transactional
    public List<ExerciseDTO> saveBulk(Long unitId, List<ExerciseDTO> exercises) {
        LOG.debug("Request to save bulk Exercises for unit : {}", unitId);

        Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new IllegalArgumentException("Unit not found with id: " + unitId));

        UnitDTO unitDTO = new UnitDTO();
        unitDTO.setId(unit.getId());

        List<ExerciseDTO> savedExercises = new ArrayList<>();

        for (ExerciseDTO exerciseDTO : exercises) {
            // Set the unit for the exercise
            exerciseDTO.setUnit(unitDTO);

            // Save the exercise (parent)
            ExerciseDTO savedExercise = save(exerciseDTO);

            // Save options (children) if present
            if (exerciseDTO.getOptions() != null && !exerciseDTO.getOptions().isEmpty()) {
                List<ExerciseOptionDTO> savedOptions = new ArrayList<>();
                for (ExerciseOptionDTO optionDTO : exerciseDTO.getOptions()) {
                    optionDTO.setExercise(savedExercise);
                    savedOptions.add(exerciseOptionService.save(optionDTO));
                }
                savedExercise.setOptions(savedOptions);
            }

            savedExercises.add(savedExercise);
        }

        return savedExercises;
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
        return exerciseMapper.toDto(exercise);
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
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (exerciseOptional.isPresent()) {
            String correctAnswer = exerciseOptional.get().getCorrectAnswerRaw();
            if (correctAnswer != null && correctAnswer.trim().equalsIgnoreCase(studentAnswer != null ? studentAnswer.trim() : "")) {
                return "CORRECT";
            }
        }
        return "WRONG";
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
