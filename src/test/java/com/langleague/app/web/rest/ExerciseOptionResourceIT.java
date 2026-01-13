package com.langleague.app.web.rest;

import static com.langleague.app.domain.ExerciseOptionAsserts.*;
import static com.langleague.app.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.app.IntegrationTest;
import com.langleague.app.domain.Exercise;
import com.langleague.app.domain.ExerciseOption;
import com.langleague.app.repository.ExerciseOptionRepository;
import com.langleague.app.service.dto.ExerciseOptionDTO;
import com.langleague.app.service.mapper.ExerciseOptionMapper;
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
 * Integration tests for the {@link ExerciseOptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExerciseOptionResourceIT {

    private static final String DEFAULT_OPTION_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_OPTION_TEXT = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_CORRECT = false;
    private static final Boolean UPDATED_IS_CORRECT = true;

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final String ENTITY_API_URL = "/api/exercise-options";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ExerciseOptionRepository exerciseOptionRepository;

    @Autowired
    private ExerciseOptionMapper exerciseOptionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExerciseOptionMockMvc;

    private ExerciseOption exerciseOption;

    private ExerciseOption insertedExerciseOption;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExerciseOption createEntity(EntityManager em) {
        ExerciseOption exerciseOption = new ExerciseOption()
            .optionText(DEFAULT_OPTION_TEXT)
            .isCorrect(DEFAULT_IS_CORRECT)
            .orderIndex(DEFAULT_ORDER_INDEX);
        // Add required entity
        Exercise exercise;
        if (TestUtil.findAll(em, Exercise.class).isEmpty()) {
            exercise = ExerciseResourceIT.createEntity(em);
            em.persist(exercise);
            em.flush();
        } else {
            exercise = TestUtil.findAll(em, Exercise.class).get(0);
        }
        exerciseOption.setExercise(exercise);
        return exerciseOption;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExerciseOption createUpdatedEntity(EntityManager em) {
        ExerciseOption updatedExerciseOption = new ExerciseOption()
            .optionText(UPDATED_OPTION_TEXT)
            .isCorrect(UPDATED_IS_CORRECT)
            .orderIndex(UPDATED_ORDER_INDEX);
        // Add required entity
        Exercise exercise;
        if (TestUtil.findAll(em, Exercise.class).isEmpty()) {
            exercise = ExerciseResourceIT.createUpdatedEntity(em);
            em.persist(exercise);
            em.flush();
        } else {
            exercise = TestUtil.findAll(em, Exercise.class).get(0);
        }
        updatedExerciseOption.setExercise(exercise);
        return updatedExerciseOption;
    }

    @BeforeEach
    void initTest() {
        exerciseOption = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedExerciseOption != null) {
            exerciseOptionRepository.delete(insertedExerciseOption);
            insertedExerciseOption = null;
        }
    }

    @Test
    @Transactional
    void createExerciseOption() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);
        var returnedExerciseOptionDTO = om.readValue(
            restExerciseOptionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseOptionDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ExerciseOptionDTO.class
        );

        // Validate the ExerciseOption in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedExerciseOption = exerciseOptionMapper.toEntity(returnedExerciseOptionDTO);
        assertExerciseOptionUpdatableFieldsEquals(returnedExerciseOption, getPersistedExerciseOption(returnedExerciseOption));

        insertedExerciseOption = returnedExerciseOption;
    }

    @Test
    @Transactional
    void createExerciseOptionWithExistingId() throws Exception {
        // Create the ExerciseOption with an existing ID
        exerciseOption.setId(1L);
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExerciseOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseOptionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkOptionTextIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        exerciseOption.setOptionText(null);

        // Create the ExerciseOption, which fails.
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        restExerciseOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseOptionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsCorrectIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        exerciseOption.setIsCorrect(null);

        // Create the ExerciseOption, which fails.
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        restExerciseOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseOptionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllExerciseOptions() throws Exception {
        // Initialize the database
        insertedExerciseOption = exerciseOptionRepository.saveAndFlush(exerciseOption);

        // Get all the exerciseOptionList
        restExerciseOptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(exerciseOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].optionText").value(hasItem(DEFAULT_OPTION_TEXT)))
            .andExpect(jsonPath("$.[*].isCorrect").value(hasItem(DEFAULT_IS_CORRECT)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));
    }

    @Test
    @Transactional
    void getExerciseOption() throws Exception {
        // Initialize the database
        insertedExerciseOption = exerciseOptionRepository.saveAndFlush(exerciseOption);

        // Get the exerciseOption
        restExerciseOptionMockMvc
            .perform(get(ENTITY_API_URL_ID, exerciseOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(exerciseOption.getId().intValue()))
            .andExpect(jsonPath("$.optionText").value(DEFAULT_OPTION_TEXT))
            .andExpect(jsonPath("$.isCorrect").value(DEFAULT_IS_CORRECT))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX));
    }

    @Test
    @Transactional
    void getNonExistingExerciseOption() throws Exception {
        // Get the exerciseOption
        restExerciseOptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExerciseOption() throws Exception {
        // Initialize the database
        insertedExerciseOption = exerciseOptionRepository.saveAndFlush(exerciseOption);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the exerciseOption
        ExerciseOption updatedExerciseOption = exerciseOptionRepository.findById(exerciseOption.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedExerciseOption are not directly saved in db
        em.detach(updatedExerciseOption);
        updatedExerciseOption.optionText(UPDATED_OPTION_TEXT).isCorrect(UPDATED_IS_CORRECT).orderIndex(UPDATED_ORDER_INDEX);
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(updatedExerciseOption);

        restExerciseOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exerciseOptionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(exerciseOptionDTO))
            )
            .andExpect(status().isOk());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedExerciseOptionToMatchAllProperties(updatedExerciseOption);
    }

    @Test
    @Transactional
    void putNonExistingExerciseOption() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exerciseOption.setId(longCount.incrementAndGet());

        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExerciseOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exerciseOptionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(exerciseOptionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExerciseOption() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exerciseOption.setId(longCount.incrementAndGet());

        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(exerciseOptionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExerciseOption() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exerciseOption.setId(longCount.incrementAndGet());

        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseOptionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(exerciseOptionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExerciseOptionWithPatch() throws Exception {
        // Initialize the database
        insertedExerciseOption = exerciseOptionRepository.saveAndFlush(exerciseOption);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the exerciseOption using partial update
        ExerciseOption partialUpdatedExerciseOption = new ExerciseOption();
        partialUpdatedExerciseOption.setId(exerciseOption.getId());

        partialUpdatedExerciseOption.optionText(UPDATED_OPTION_TEXT).isCorrect(UPDATED_IS_CORRECT).orderIndex(UPDATED_ORDER_INDEX);

        restExerciseOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExerciseOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedExerciseOption))
            )
            .andExpect(status().isOk());

        // Validate the ExerciseOption in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertExerciseOptionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedExerciseOption, exerciseOption),
            getPersistedExerciseOption(exerciseOption)
        );
    }

    @Test
    @Transactional
    void fullUpdateExerciseOptionWithPatch() throws Exception {
        // Initialize the database
        insertedExerciseOption = exerciseOptionRepository.saveAndFlush(exerciseOption);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the exerciseOption using partial update
        ExerciseOption partialUpdatedExerciseOption = new ExerciseOption();
        partialUpdatedExerciseOption.setId(exerciseOption.getId());

        partialUpdatedExerciseOption.optionText(UPDATED_OPTION_TEXT).isCorrect(UPDATED_IS_CORRECT).orderIndex(UPDATED_ORDER_INDEX);

        restExerciseOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExerciseOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedExerciseOption))
            )
            .andExpect(status().isOk());

        // Validate the ExerciseOption in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertExerciseOptionUpdatableFieldsEquals(partialUpdatedExerciseOption, getPersistedExerciseOption(partialUpdatedExerciseOption));
    }

    @Test
    @Transactional
    void patchNonExistingExerciseOption() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exerciseOption.setId(longCount.incrementAndGet());

        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExerciseOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, exerciseOptionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(exerciseOptionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExerciseOption() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exerciseOption.setId(longCount.incrementAndGet());

        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(exerciseOptionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExerciseOption() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        exerciseOption.setId(longCount.incrementAndGet());

        // Create the ExerciseOption
        ExerciseOptionDTO exerciseOptionDTO = exerciseOptionMapper.toDto(exerciseOption);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseOptionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(exerciseOptionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExerciseOption in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExerciseOption() throws Exception {
        // Initialize the database
        insertedExerciseOption = exerciseOptionRepository.saveAndFlush(exerciseOption);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the exerciseOption
        restExerciseOptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, exerciseOption.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return exerciseOptionRepository.count();
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

    protected ExerciseOption getPersistedExerciseOption(ExerciseOption exerciseOption) {
        return exerciseOptionRepository.findById(exerciseOption.getId()).orElseThrow();
    }

    protected void assertPersistedExerciseOptionToMatchAllProperties(ExerciseOption expectedExerciseOption) {
        assertExerciseOptionAllPropertiesEquals(expectedExerciseOption, getPersistedExerciseOption(expectedExerciseOption));
    }

    protected void assertPersistedExerciseOptionToMatchUpdatableProperties(ExerciseOption expectedExerciseOption) {
        assertExerciseOptionAllUpdatablePropertiesEquals(expectedExerciseOption, getPersistedExerciseOption(expectedExerciseOption));
    }
}
