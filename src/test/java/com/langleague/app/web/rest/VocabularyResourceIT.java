package com.langleague.app.web.rest;

import static com.langleague.app.domain.VocabularyAsserts.*;
import static com.langleague.app.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.app.IntegrationTest;
import com.langleague.app.domain.Unit;
import com.langleague.app.domain.Vocabulary;
import com.langleague.app.repository.VocabularyRepository;
import com.langleague.app.service.dto.VocabularyDTO;
import com.langleague.app.service.mapper.VocabularyMapper;
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
 * Integration tests for the {@link VocabularyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VocabularyResourceIT {

    private static final String DEFAULT_WORD = "AAAAAAAAAA";
    private static final String UPDATED_WORD = "BBBBBBBBBB";

    private static final String DEFAULT_PHONETIC = "AAAAAAAAAA";
    private static final String UPDATED_PHONETIC = "BBBBBBBBBB";

    private static final String DEFAULT_MEANING = "AAAAAAAAAA";
    private static final String UPDATED_MEANING = "BBBBBBBBBB";

    private static final String DEFAULT_EXAMPLE = "AAAAAAAAAA";
    private static final String UPDATED_EXAMPLE = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final String ENTITY_API_URL = "/api/vocabularies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private VocabularyRepository vocabularyRepository;

    @Autowired
    private VocabularyMapper vocabularyMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVocabularyMockMvc;

    private Vocabulary vocabulary;

    private Vocabulary insertedVocabulary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vocabulary createEntity(EntityManager em) {
        Vocabulary vocabulary = new Vocabulary()
            .word(DEFAULT_WORD)
            .phonetic(DEFAULT_PHONETIC)
            .meaning(DEFAULT_MEANING)
            .example(DEFAULT_EXAMPLE)
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
        vocabulary.setUnit(unit);
        return vocabulary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vocabulary createUpdatedEntity(EntityManager em) {
        Vocabulary updatedVocabulary = new Vocabulary()
            .word(UPDATED_WORD)
            .phonetic(UPDATED_PHONETIC)
            .meaning(UPDATED_MEANING)
            .example(UPDATED_EXAMPLE)
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
        updatedVocabulary.setUnit(unit);
        return updatedVocabulary;
    }

    @BeforeEach
    void initTest() {
        vocabulary = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedVocabulary != null) {
            vocabularyRepository.delete(insertedVocabulary);
            insertedVocabulary = null;
        }
    }

    @Test
    @Transactional
    void createVocabulary() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);
        var returnedVocabularyDTO = om.readValue(
            restVocabularyMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vocabularyDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            VocabularyDTO.class
        );

        // Validate the Vocabulary in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedVocabulary = vocabularyMapper.toEntity(returnedVocabularyDTO);
        assertVocabularyUpdatableFieldsEquals(returnedVocabulary, getPersistedVocabulary(returnedVocabulary));

        insertedVocabulary = returnedVocabulary;
    }

    @Test
    @Transactional
    void createVocabularyWithExistingId() throws Exception {
        // Create the Vocabulary with an existing ID
        vocabulary.setId(1L);
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVocabularyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vocabularyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkWordIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vocabulary.setWord(null);

        // Create the Vocabulary, which fails.
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        restVocabularyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vocabularyDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMeaningIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vocabulary.setMeaning(null);

        // Create the Vocabulary, which fails.
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        restVocabularyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vocabularyDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrderIndexIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vocabulary.setOrderIndex(null);

        // Create the Vocabulary, which fails.
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        restVocabularyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vocabularyDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVocabularies() throws Exception {
        // Initialize the database
        insertedVocabulary = vocabularyRepository.saveAndFlush(vocabulary);

        // Get all the vocabularyList
        restVocabularyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vocabulary.getId().intValue())))
            .andExpect(jsonPath("$.[*].word").value(hasItem(DEFAULT_WORD)))
            .andExpect(jsonPath("$.[*].phonetic").value(hasItem(DEFAULT_PHONETIC)))
            .andExpect(jsonPath("$.[*].meaning").value(hasItem(DEFAULT_MEANING)))
            .andExpect(jsonPath("$.[*].example").value(hasItem(DEFAULT_EXAMPLE)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));
    }

    @Test
    @Transactional
    void getVocabulary() throws Exception {
        // Initialize the database
        insertedVocabulary = vocabularyRepository.saveAndFlush(vocabulary);

        // Get the vocabulary
        restVocabularyMockMvc
            .perform(get(ENTITY_API_URL_ID, vocabulary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vocabulary.getId().intValue()))
            .andExpect(jsonPath("$.word").value(DEFAULT_WORD))
            .andExpect(jsonPath("$.phonetic").value(DEFAULT_PHONETIC))
            .andExpect(jsonPath("$.meaning").value(DEFAULT_MEANING))
            .andExpect(jsonPath("$.example").value(DEFAULT_EXAMPLE))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGE_URL))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX));
    }

    @Test
    @Transactional
    void getNonExistingVocabulary() throws Exception {
        // Get the vocabulary
        restVocabularyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVocabulary() throws Exception {
        // Initialize the database
        insertedVocabulary = vocabularyRepository.saveAndFlush(vocabulary);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vocabulary
        Vocabulary updatedVocabulary = vocabularyRepository.findById(vocabulary.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVocabulary are not directly saved in db
        em.detach(updatedVocabulary);
        updatedVocabulary
            .word(UPDATED_WORD)
            .phonetic(UPDATED_PHONETIC)
            .meaning(UPDATED_MEANING)
            .example(UPDATED_EXAMPLE)
            .imageUrl(UPDATED_IMAGE_URL)
            .orderIndex(UPDATED_ORDER_INDEX);
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(updatedVocabulary);

        restVocabularyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vocabularyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vocabularyDTO))
            )
            .andExpect(status().isOk());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedVocabularyToMatchAllProperties(updatedVocabulary);
    }

    @Test
    @Transactional
    void putNonExistingVocabulary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vocabulary.setId(longCount.incrementAndGet());

        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVocabularyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vocabularyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vocabularyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVocabulary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vocabulary.setId(longCount.incrementAndGet());

        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVocabularyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vocabularyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVocabulary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vocabulary.setId(longCount.incrementAndGet());

        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVocabularyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vocabularyDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVocabularyWithPatch() throws Exception {
        // Initialize the database
        insertedVocabulary = vocabularyRepository.saveAndFlush(vocabulary);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vocabulary using partial update
        Vocabulary partialUpdatedVocabulary = new Vocabulary();
        partialUpdatedVocabulary.setId(vocabulary.getId());

        partialUpdatedVocabulary.example(UPDATED_EXAMPLE).orderIndex(UPDATED_ORDER_INDEX);

        restVocabularyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVocabulary.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVocabulary))
            )
            .andExpect(status().isOk());

        // Validate the Vocabulary in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVocabularyUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedVocabulary, vocabulary),
            getPersistedVocabulary(vocabulary)
        );
    }

    @Test
    @Transactional
    void fullUpdateVocabularyWithPatch() throws Exception {
        // Initialize the database
        insertedVocabulary = vocabularyRepository.saveAndFlush(vocabulary);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vocabulary using partial update
        Vocabulary partialUpdatedVocabulary = new Vocabulary();
        partialUpdatedVocabulary.setId(vocabulary.getId());

        partialUpdatedVocabulary
            .word(UPDATED_WORD)
            .phonetic(UPDATED_PHONETIC)
            .meaning(UPDATED_MEANING)
            .example(UPDATED_EXAMPLE)
            .imageUrl(UPDATED_IMAGE_URL)
            .orderIndex(UPDATED_ORDER_INDEX);

        restVocabularyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVocabulary.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVocabulary))
            )
            .andExpect(status().isOk());

        // Validate the Vocabulary in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVocabularyUpdatableFieldsEquals(partialUpdatedVocabulary, getPersistedVocabulary(partialUpdatedVocabulary));
    }

    @Test
    @Transactional
    void patchNonExistingVocabulary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vocabulary.setId(longCount.incrementAndGet());

        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVocabularyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vocabularyDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vocabularyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVocabulary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vocabulary.setId(longCount.incrementAndGet());

        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVocabularyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vocabularyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVocabulary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vocabulary.setId(longCount.incrementAndGet());

        // Create the Vocabulary
        VocabularyDTO vocabularyDTO = vocabularyMapper.toDto(vocabulary);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVocabularyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(vocabularyDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vocabulary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVocabulary() throws Exception {
        // Initialize the database
        insertedVocabulary = vocabularyRepository.saveAndFlush(vocabulary);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the vocabulary
        restVocabularyMockMvc
            .perform(delete(ENTITY_API_URL_ID, vocabulary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return vocabularyRepository.count();
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

    protected Vocabulary getPersistedVocabulary(Vocabulary vocabulary) {
        return vocabularyRepository.findById(vocabulary.getId()).orElseThrow();
    }

    protected void assertPersistedVocabularyToMatchAllProperties(Vocabulary expectedVocabulary) {
        assertVocabularyAllPropertiesEquals(expectedVocabulary, getPersistedVocabulary(expectedVocabulary));
    }

    protected void assertPersistedVocabularyToMatchUpdatableProperties(Vocabulary expectedVocabulary) {
        assertVocabularyAllUpdatablePropertiesEquals(expectedVocabulary, getPersistedVocabulary(expectedVocabulary));
    }
}
