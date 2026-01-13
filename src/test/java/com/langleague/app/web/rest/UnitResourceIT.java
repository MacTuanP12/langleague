package com.langleague.app.web.rest;

import static com.langleague.app.domain.UnitAsserts.*;
import static com.langleague.app.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.app.IntegrationTest;
import com.langleague.app.domain.Book;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.mapper.UnitMapper;
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
 * Integration tests for the {@link UnitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UnitResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/units";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UnitMapper unitMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUnitMockMvc;

    private Unit unit;

    private Unit insertedUnit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Unit createEntity(EntityManager em) {
        Unit unit = new Unit().title(DEFAULT_TITLE).orderIndex(DEFAULT_ORDER_INDEX).summary(DEFAULT_SUMMARY);
        // Add required entity
        Book book;
        if (TestUtil.findAll(em, Book.class).isEmpty()) {
            book = BookResourceIT.createEntity(em);
            em.persist(book);
            em.flush();
        } else {
            book = TestUtil.findAll(em, Book.class).get(0);
        }
        unit.setBook(book);
        return unit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Unit createUpdatedEntity(EntityManager em) {
        Unit updatedUnit = new Unit().title(UPDATED_TITLE).orderIndex(UPDATED_ORDER_INDEX).summary(UPDATED_SUMMARY);
        // Add required entity
        Book book;
        if (TestUtil.findAll(em, Book.class).isEmpty()) {
            book = BookResourceIT.createUpdatedEntity(em);
            em.persist(book);
            em.flush();
        } else {
            book = TestUtil.findAll(em, Book.class).get(0);
        }
        updatedUnit.setBook(book);
        return updatedUnit;
    }

    @BeforeEach
    void initTest() {
        unit = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedUnit != null) {
            unitRepository.delete(insertedUnit);
            insertedUnit = null;
        }
    }

    @Test
    @Transactional
    void createUnit() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);
        var returnedUnitDTO = om.readValue(
            restUnitMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UnitDTO.class
        );

        // Validate the Unit in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedUnit = unitMapper.toEntity(returnedUnitDTO);
        assertUnitUpdatableFieldsEquals(returnedUnit, getPersistedUnit(returnedUnit));

        insertedUnit = returnedUnit;
    }

    @Test
    @Transactional
    void createUnitWithExistingId() throws Exception {
        // Create the Unit with an existing ID
        unit.setId(1L);
        UnitDTO unitDTO = unitMapper.toDto(unit);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUnitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        unit.setTitle(null);

        // Create the Unit, which fails.
        UnitDTO unitDTO = unitMapper.toDto(unit);

        restUnitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrderIndexIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        unit.setOrderIndex(null);

        // Create the Unit, which fails.
        UnitDTO unitDTO = unitMapper.toDto(unit);

        restUnitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUnits() throws Exception {
        // Initialize the database
        insertedUnit = unitRepository.saveAndFlush(unit);

        // Get all the unitList
        restUnitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unit.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)));
    }

    @Test
    @Transactional
    void getUnit() throws Exception {
        // Initialize the database
        insertedUnit = unitRepository.saveAndFlush(unit);

        // Get the unit
        restUnitMockMvc
            .perform(get(ENTITY_API_URL_ID, unit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(unit.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY));
    }

    @Test
    @Transactional
    void getNonExistingUnit() throws Exception {
        // Get the unit
        restUnitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUnit() throws Exception {
        // Initialize the database
        insertedUnit = unitRepository.saveAndFlush(unit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unit
        Unit updatedUnit = unitRepository.findById(unit.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUnit are not directly saved in db
        em.detach(updatedUnit);
        updatedUnit.title(UPDATED_TITLE).orderIndex(UPDATED_ORDER_INDEX).summary(UPDATED_SUMMARY);
        UnitDTO unitDTO = unitMapper.toDto(updatedUnit);

        restUnitMockMvc
            .perform(put(ENTITY_API_URL_ID, unitDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isOk());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUnitToMatchAllProperties(updatedUnit);
    }

    @Test
    @Transactional
    void putNonExistingUnit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unit.setId(longCount.incrementAndGet());

        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnitMockMvc
            .perform(put(ENTITY_API_URL_ID, unitDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUnit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unit.setId(longCount.incrementAndGet());

        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUnit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unit.setId(longCount.incrementAndGet());

        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUnitWithPatch() throws Exception {
        // Initialize the database
        insertedUnit = unitRepository.saveAndFlush(unit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unit using partial update
        Unit partialUpdatedUnit = new Unit();
        partialUpdatedUnit.setId(unit.getId());

        partialUpdatedUnit.orderIndex(UPDATED_ORDER_INDEX);

        restUnitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnit.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUnit))
            )
            .andExpect(status().isOk());

        // Validate the Unit in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUnitUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedUnit, unit), getPersistedUnit(unit));
    }

    @Test
    @Transactional
    void fullUpdateUnitWithPatch() throws Exception {
        // Initialize the database
        insertedUnit = unitRepository.saveAndFlush(unit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unit using partial update
        Unit partialUpdatedUnit = new Unit();
        partialUpdatedUnit.setId(unit.getId());

        partialUpdatedUnit.title(UPDATED_TITLE).orderIndex(UPDATED_ORDER_INDEX).summary(UPDATED_SUMMARY);

        restUnitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnit.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUnit))
            )
            .andExpect(status().isOk());

        // Validate the Unit in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUnitUpdatableFieldsEquals(partialUpdatedUnit, getPersistedUnit(partialUpdatedUnit));
    }

    @Test
    @Transactional
    void patchNonExistingUnit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unit.setId(longCount.incrementAndGet());

        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, unitDTO.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(unitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUnit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unit.setId(longCount.incrementAndGet());

        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(unitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUnit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unit.setId(longCount.incrementAndGet());

        // Create the Unit
        UnitDTO unitDTO = unitMapper.toDto(unit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(unitDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Unit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUnit() throws Exception {
        // Initialize the database
        insertedUnit = unitRepository.saveAndFlush(unit);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the unit
        restUnitMockMvc
            .perform(delete(ENTITY_API_URL_ID, unit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return unitRepository.count();
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

    protected Unit getPersistedUnit(Unit unit) {
        return unitRepository.findById(unit.getId()).orElseThrow();
    }

    protected void assertPersistedUnitToMatchAllProperties(Unit expectedUnit) {
        assertUnitAllPropertiesEquals(expectedUnit, getPersistedUnit(expectedUnit));
    }

    protected void assertPersistedUnitToMatchUpdatableProperties(Unit expectedUnit) {
        assertUnitAllUpdatablePropertiesEquals(expectedUnit, getPersistedUnit(expectedUnit));
    }
}
