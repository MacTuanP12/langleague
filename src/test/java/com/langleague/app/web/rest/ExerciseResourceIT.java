package com.langleague.app.web.rest;

import static com.langleague.app.domain.ExerciseAsserts.*;
import static com.langleague.app.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.app.IntegrationTest;
import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.Unit;
import com.langleague.app.domain.enumeration.ExerciseType;
import com.langleague.app.repository.ExerciseRepository;
import com.langleague.app.service.dto.ExerciseDTO;
import com.langleague.app.service.mapper.ExerciseMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ExerciseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExerciseResourceIT {

    private static final String DEFAULT_EXERCISE_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_EXERCISE_TEXT = "BBBBBBBBBB";

    private static final ExerciseType DEFAULT_EXERCISE_TYPE = ExerciseType.SINGLE_CHOICE;
    private static final ExerciseType UPDATED_EXERCISE_TYPE = ExerciseType.MULTI_CHOICE;

    private static final String DEFAULT_CORRECT_ANSWER_RAW = "AAAAAAAAAA";
    private static final String UPDATED_CORRECT_ANSWER_RAW = "BBBBBBBBBB";

    private static final String DEFAULT_AUDIO_URL = "AAAAAAAAAA";
    private static final String UPDATED_AUDIO_URL = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final String ENTITY_API_URL = "/api/exercises";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private ExerciseMapper exerciseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExerciseMockMvc;

    private Exercise exercise;

    private Exercise insertedExercise;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Exercise createEntity(EntityManager em) {
        Exercise exercise = new Exercise()
            .exerciseText(DEFAULT_EXERCISE_TEXT)
            .exerciseType(DEFAULT_EXERCISE_TYPE)
            .correctAnswerRaw(DEFAULT_CORRECT_ANSWER_RAW)
            .audioUrl(DEFAULT_AUDIO_URL)
            .imageUrl(DEFAULT_IMAGE_URL)
            .orderIndex(DEFAULT_ORDER_INDEX);
        // Add required entity
        Unit unit;
        if (TestUtil.findAll(em, Unit.class).isEmpty()) {
            unit = UnitResourceIT.createEntity(em);
            em.persist(unit);
            em.flush();
        } else {
            unit = TestUtil.findAll(em, Unit.class).get(0);
        }
        exercise.setUnit(unit);
        return exercise;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Exercise createUpdatedEntity(EntityManager em) {
        Exercise updatedExercise = new Exercise()
            .exerciseText(UPDATED_EXERCISE_TEXT)
            .exerciseType(UPDATED_EXERCISE_TYPE)
            .correctAnswerRaw(UPDATED_CORRECT_ANSWER_RAW)
            .audioUrl(UPDATED_AUDIO_URL)
            .imageUrl(UPDATED_IMAGE_URL)
            .orderIndex(UPDATED_ORDER_INDEX);
        // Add required entity
        Unit unit;
        if (TestUtil.findAll(em, Unit.class).isEmpty()) {
            unit = UnitResourceIT.createUpdatedEntity(em);
            em.persist(unit);
            em.flush();
        } else {
            unit = TestUtil.findAll(em, Unit.class).get(0);
        }
        updatedExercise.setUnit(unit);
        return updatedExercise;
    }

    @BeforeEach
    void initTest() {
        exercise = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedExercise != null) {
            exerciseRepository.delete(insertedExercise);
            insertedExercise = null;
        }
    }

    @Test
    @Transactional
    void createExercise() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);
        var returnedExerciseDTO = om.readValue(
            restExerciseMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ExerciseDTO.class
        );

        // Validate the Exercise in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedExercise = exerciseMapper.toEntity(returnedExerciseDTO);
        assertExerciseUpdatableFieldsEquals(returnedExercise, getPersistedExercise(returnedExercise));

        insertedExercise = returnedExercise;
    }

    @Test
    @Transactional
    void createExerciseWithExistingId() throws Exception {
        // Create the Exercise with an existing ID
        exercise.setId(1L);
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExerciseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkExerciseTypeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        exercise.setExerciseType(null);

        // Create the Exercise, which fails.
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        restExerciseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrderIndexIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        exercise.setOrderIndex(null);

        // Create the Exercise, which fails.
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        restExerciseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllExercises() throws Exception {
        // Initialize the database
        insertedExercise = exerciseRepository.saveAndFlush(exercise);

        // Get all the exerciseList
        restExerciseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(exercise.getId().intValue())))
            .andExpect(jsonPath("$.[*].exerciseText").value(hasItem(DEFAULT_EXERCISE_TEXT)))
            .andExpect(jsonPath("$.[*].exerciseType").value(hasItem(DEFAULT_EXERCISE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].correctAnswerRaw").value(hasItem(DEFAULT_CORRECT_ANSWER_RAW)))
            .andExpect(jsonPath("$.[*].audioUrl").value(hasItem(DEFAULT_AUDIO_URL)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));
    }

    @Test
    @Transactional
    void getExercise() throws Exception {
        // Initialize the database
        insertedExercise = exerciseRepository.saveAndFlush(exercise);

        // Get the exercise
        restExerciseMockMvc
            .perform(get(ENTITY_API_URL_ID, exercise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(exercise.getId().intValue()))
            .andExpect(jsonPath("$.exerciseText").value(DEFAULT_EXERCISE_TEXT))
            .andExpect(jsonPath("$.exerciseType").value(DEFAULT_EXERCISE_TYPE.toString()))
            .andExpect(jsonPath("$.correctAnswerRaw").value(DEFAULT_CORRECT_ANSWER_RAW))
            .andExpect(jsonPath("$.audioUrl").value(DEFAULT_AUDIO_URL))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGE_URL))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX));
    }

    @Test
    @Transactional
    void getNonExistingExercise() throws Exception {
        // Get the exercise
        restExerciseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExercise() throws Exception {
        // Initialize the database
        insertedExercise = exerciseRepository.saveAndFlush(exercise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the exercise
        Exercise updatedExercise = exerciseRepository.findById(exercise.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedExercise are not directly saved in db
        em.detach(updatedExercise);
        updatedExercise
            .exerciseText(UPDATED_EXERCISE_TEXT)
            .exerciseType(UPDATED_EXERCISE_TYPE)
            .correctAnswerRaw(UPDATED_CORRECT_ANSWER_RAW)
            .audioUrl(UPDATED_AUDIO_URL)
            .imageUrl(UPDATED_IMAGE_URL)
            .orderIndex(UPDATED_ORDER_INDEX);
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(updatedExercise);

        restExerciseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exerciseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(exerciseDTO))
            )
            .andExpect(status().isOk());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedExerciseToMatchAllProperties(updatedExercise);
    }

    @Test
    @Transactional
    void putNonExistingExercise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exercise.setId(longCount.incrementAndGet());

        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExerciseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exerciseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(exerciseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExercise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exercise.setId(longCount.incrementAndGet());

        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(exerciseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExercise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exercise.setId(longCount.incrementAndGet());

        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExerciseWithPatch() throws Exception {
        // Initialize the database
        insertedExercise = exerciseRepository.saveAndFlush(exercise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the exercise using partial update
        Exercise partialUpdatedExercise = new Exercise();
        partialUpdatedExercise.setId(exercise.getId());

        partialUpdatedExercise
            .exerciseText(UPDATED_EXERCISE_TEXT)
            .exerciseType(UPDATED_EXERCISE_TYPE)
            .correctAnswerRaw(UPDATED_CORRECT_ANSWER_RAW);

        restExerciseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExercise.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedExercise))
            )
            .andExpect(status().isOk());

        // Validate the Exercise in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertExerciseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedExercise, exercise), getPersistedExercise(exercise));
    }

    @Test
    @Transactional
    void fullUpdateExerciseWithPatch() throws Exception {
        // Initialize the database
        insertedExercise = exerciseRepository.saveAndFlush(exercise);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the exercise using partial update
        Exercise partialUpdatedExercise = new Exercise();
        partialUpdatedExercise.setId(exercise.getId());

        partialUpdatedExercise
            .exerciseText(UPDATED_EXERCISE_TEXT)
            .exerciseType(UPDATED_EXERCISE_TYPE)
            .correctAnswerRaw(UPDATED_CORRECT_ANSWER_RAW)
            .audioUrl(UPDATED_AUDIO_URL)
            .imageUrl(UPDATED_IMAGE_URL)
            .orderIndex(UPDATED_ORDER_INDEX);

        restExerciseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExercise.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedExercise))
            )
            .andExpect(status().isOk());

        // Validate the Exercise in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertExerciseUpdatableFieldsEquals(partialUpdatedExercise, getPersistedExercise(partialUpdatedExercise));
    }

    @Test
    @Transactional
    void patchNonExistingExercise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exercise.setId(longCount.incrementAndGet());

        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExerciseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, exerciseDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(exerciseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExercise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exercise.setId(longCount.incrementAndGet());

        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(exerciseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExercise() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exercise.setId(longCount.incrementAndGet());

        // Create the Exercise
        ExerciseDTO exerciseDTO = exerciseMapper.toDto(exercise);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(exerciseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Exercise in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExercise() throws Exception {
        // Initialize the database
        insertedExercise = exerciseRepository.saveAndFlush(exercise);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the exercise
        restExerciseMockMvc
            .perform(delete(ENTITY_API_URL_ID, exercise.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return exerciseRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Exercise getPersistedExercise(Exercise exercise) {
        return exerciseRepository.findById(exercise.getId()).orElseThrow();
    }

    protected void assertPersistedExerciseToMatchAllProperties(Exercise expectedExercise) {
        assertExerciseAllPropertiesEquals(expectedExercise, getPersistedExercise(expectedExercise));
    }

    protected void assertPersistedExerciseToMatchUpdatableProperties(Exercise expectedExercise) {
        assertExerciseAllUpdatablePropertiesEquals(expectedExercise, getPersistedExercise(expectedExercise));
    }
}
