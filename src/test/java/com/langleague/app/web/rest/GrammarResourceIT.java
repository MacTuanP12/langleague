package com.langleague.app.web.rest;

import static com.langleague.app.domain.GrammarAsserts.*;
import static com.langleague.app.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.app.IntegrationTest;
import com.langleague.app.domain.Grammar;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.GrammarRepository;
import com.langleague.app.service.dto.GrammarDTO;
import com.langleague.app.service.mapper.GrammarMapper;
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
 * Integration tests for the {@link GrammarResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrammarResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT_MARKDOWN = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_MARKDOWN = "BBBBBBBBBB";

    private static final String DEFAULT_EXAMPLE_USAGE = "AAAAAAAAAA";
    private static final String UPDATED_EXAMPLE_USAGE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final String ENTITY_API_URL = "/api/grammars";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GrammarRepository grammarRepository;

    @Autowired
    private GrammarMapper grammarMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrammarMockMvc;

    private Grammar grammar;

    private Grammar insertedGrammar;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grammar createEntity(EntityManager em) {
        Grammar grammar = new Grammar()
            .title(DEFAULT_TITLE)
            .contentMarkdown(DEFAULT_CONTENT_MARKDOWN)
            .exampleUsage(DEFAULT_EXAMPLE_USAGE)
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
        grammar.setUnit(unit);
        return grammar;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grammar createUpdatedEntity(EntityManager em) {
        Grammar updatedGrammar = new Grammar()
            .title(UPDATED_TITLE)
            .contentMarkdown(UPDATED_CONTENT_MARKDOWN)
            .exampleUsage(UPDATED_EXAMPLE_USAGE)
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
        updatedGrammar.setUnit(unit);
        return updatedGrammar;
    }

    @BeforeEach
    void initTest() {
        grammar = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedGrammar != null) {
            grammarRepository.delete(insertedGrammar);
            insertedGrammar = null;
        }
    }

    @Test
    @Transactional
    void createGrammar() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);
        var returnedGrammarDTO = om.readValue(
            restGrammarMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            GrammarDTO.class
        );

        // Validate the Grammar in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGrammar = grammarMapper.toEntity(returnedGrammarDTO);
        assertGrammarUpdatableFieldsEquals(returnedGrammar, getPersistedGrammar(returnedGrammar));

        insertedGrammar = returnedGrammar;
    }

    @Test
    @Transactional
    void createGrammarWithExistingId() throws Exception {
        // Create the Grammar with an existing ID
        grammar.setId(1L);
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrammarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        grammar.setTitle(null);

        // Create the Grammar, which fails.
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        restGrammarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrderIndexIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        grammar.setOrderIndex(null);

        // Create the Grammar, which fails.
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        restGrammarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGrammars() throws Exception {
        // Initialize the database
        insertedGrammar = grammarRepository.saveAndFlush(grammar);

        // Get all the grammarList
        restGrammarMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grammar.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].contentMarkdown").value(hasItem(DEFAULT_CONTENT_MARKDOWN)))
            .andExpect(jsonPath("$.[*].exampleUsage").value(hasItem(DEFAULT_EXAMPLE_USAGE)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));
    }

    @Test
    @Transactional
    void getGrammar() throws Exception {
        // Initialize the database
        insertedGrammar = grammarRepository.saveAndFlush(grammar);

        // Get the grammar
        restGrammarMockMvc
            .perform(get(ENTITY_API_URL_ID, grammar.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grammar.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.contentMarkdown").value(DEFAULT_CONTENT_MARKDOWN))
            .andExpect(jsonPath("$.exampleUsage").value(DEFAULT_EXAMPLE_USAGE))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX));
    }

    @Test
    @Transactional
    void getNonExistingGrammar() throws Exception {
        // Get the grammar
        restGrammarMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGrammar() throws Exception {
        // Initialize the database
        insertedGrammar = grammarRepository.saveAndFlush(grammar);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the grammar
        Grammar updatedGrammar = grammarRepository.findById(grammar.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGrammar are not directly saved in db
        em.detach(updatedGrammar);
        updatedGrammar
            .title(UPDATED_TITLE)
            .contentMarkdown(UPDATED_CONTENT_MARKDOWN)
            .exampleUsage(UPDATED_EXAMPLE_USAGE)
            .orderIndex(UPDATED_ORDER_INDEX);
        GrammarDTO grammarDTO = grammarMapper.toDto(updatedGrammar);

        restGrammarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grammarDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO))
            )
            .andExpect(status().isOk());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGrammarToMatchAllProperties(updatedGrammar);
    }

    @Test
    @Transactional
    void putNonExistingGrammar() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        grammar.setId(longCount.incrementAndGet());

        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrammarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grammarDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrammar() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        grammar.setId(longCount.incrementAndGet());

        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrammarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(grammarDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrammar() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        grammar.setId(longCount.incrementAndGet());

        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrammarMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(grammarDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrammarWithPatch() throws Exception {
        // Initialize the database
        insertedGrammar = grammarRepository.saveAndFlush(grammar);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the grammar using partial update
        Grammar partialUpdatedGrammar = new Grammar();
        partialUpdatedGrammar.setId(grammar.getId());

        partialUpdatedGrammar.title(UPDATED_TITLE).exampleUsage(UPDATED_EXAMPLE_USAGE).orderIndex(UPDATED_ORDER_INDEX);

        restGrammarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrammar.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGrammar))
            )
            .andExpect(status().isOk());

        // Validate the Grammar in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGrammarUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedGrammar, grammar), getPersistedGrammar(grammar));
    }

    @Test
    @Transactional
    void fullUpdateGrammarWithPatch() throws Exception {
        // Initialize the database
        insertedGrammar = grammarRepository.saveAndFlush(grammar);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the grammar using partial update
        Grammar partialUpdatedGrammar = new Grammar();
        partialUpdatedGrammar.setId(grammar.getId());

        partialUpdatedGrammar
            .title(UPDATED_TITLE)
            .contentMarkdown(UPDATED_CONTENT_MARKDOWN)
            .exampleUsage(UPDATED_EXAMPLE_USAGE)
            .orderIndex(UPDATED_ORDER_INDEX);

        restGrammarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrammar.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGrammar))
            )
            .andExpect(status().isOk());

        // Validate the Grammar in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGrammarUpdatableFieldsEquals(partialUpdatedGrammar, getPersistedGrammar(partialUpdatedGrammar));
    }

    @Test
    @Transactional
    void patchNonExistingGrammar() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        grammar.setId(longCount.incrementAndGet());

        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrammarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grammarDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(grammarDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrammar() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        grammar.setId(longCount.incrementAndGet());

        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrammarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(grammarDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrammar() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        grammar.setId(longCount.incrementAndGet());

        // Create the Grammar
        GrammarDTO grammarDTO = grammarMapper.toDto(grammar);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrammarMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(grammarDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grammar in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrammar() throws Exception {
        // Initialize the database
        insertedGrammar = grammarRepository.saveAndFlush(grammar);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the grammar
        restGrammarMockMvc
            .perform(delete(ENTITY_API_URL_ID, grammar.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return grammarRepository.count();
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

    protected Grammar getPersistedGrammar(Grammar grammar) {
        return grammarRepository.findById(grammar.getId()).orElseThrow();
    }

    protected void assertPersistedGrammarToMatchAllProperties(Grammar expectedGrammar) {
        assertGrammarAllPropertiesEquals(expectedGrammar, getPersistedGrammar(expectedGrammar));
    }

    protected void assertPersistedGrammarToMatchUpdatableProperties(Grammar expectedGrammar) {
        assertGrammarAllUpdatablePropertiesEquals(expectedGrammar, getPersistedGrammar(expectedGrammar));
    }
}
