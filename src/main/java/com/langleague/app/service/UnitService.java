package com.langleague.app.service;

import com.langleague.app.domain.Unit;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.service.mapper.UnitMapper;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.Unit}.
 */
@Service
@Transactional
public class UnitService {

    private static final Logger LOG = LoggerFactory.getLogger(UnitService.class);

    private final UnitRepository unitRepository;

    private final UnitMapper unitMapper;

    public UnitService(UnitRepository unitRepository, UnitMapper unitMapper) {
        this.unitRepository = unitRepository;
        this.unitMapper = unitMapper;
    }

    /**
     * Save a unit.
     *
     * @param unitDTO the entity to save.
     * @return the persisted entity.
     */
    public UnitDTO save(UnitDTO unitDTO) {
        LOG.debug("Request to save Unit : {}", unitDTO);
        Unit unit = unitMapper.toEntity(unitDTO);
        unit = unitRepository.save(unit);
        return unitMapper.toDto(unit);
    }

    /**
     * Update a unit.
     *
     * @param unitDTO the entity to save.
     * @return the persisted entity.
     */
    public UnitDTO update(UnitDTO unitDTO) {
        LOG.debug("Request to update Unit : {}", unitDTO);
        Unit unit = unitMapper.toEntity(unitDTO);
        unit = unitRepository.save(unit);
        return unitMapper.toDto(unit);
    }

    /**
     * Partially update a unit.
     *
     * @param unitDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UnitDTO> partialUpdate(UnitDTO unitDTO) {
        LOG.debug("Request to partially update Unit : {}", unitDTO);

        return unitRepository
            .findById(unitDTO.getId())
            .map(existingUnit -> {
                unitMapper.partialUpdate(existingUnit, unitDTO);

                return existingUnit;
            })
            .map(unitRepository::save)
            .map(unitMapper::toDto);
    }

    /**
     * Get all the units.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UnitDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Units");
        return unitRepository.findAll(pageable).map(unitMapper::toDto);
    }

    /**
     * Get all the units for a specific book, sorted by orderIndex.
     *
     * @param bookId the id of the book.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UnitDTO> findAllByBookId(Long bookId) {
        LOG.debug("Request to get all Units for Book : {}", bookId);
        return unitMapper.toDto(unitRepository.findAllByBookIdOrderByOrderIndexAsc(bookId));
    }

    /**
     * Reorder units for a specific book.
     *
     * @param bookId the id of the book.
     * @param unitIds the list of unit ids in the new order.
     */
    public void reorderUnits(Long bookId, List<Long> unitIds) {
        LOG.debug("Request to reorder Units for Book : {}", bookId);
        List<Unit> units = unitRepository.findAllByBookIdOrderByOrderIndexAsc(bookId);
        for (int i = 0; i < unitIds.size(); i++) {
            Long unitId = unitIds.get(i);
            for (Unit unit : units) {
                if (unit.getId().equals(unitId)) {
                    unit.setOrderIndex(i);
                    unitRepository.save(unit);
                    break;
                }
            }
        }
    }

    /**
     * Get one unit by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UnitDTO> findOne(Long id) {
        LOG.debug("Request to get Unit : {}", id);
        return unitRepository.findById(id).map(unitMapper::toDto);
    }

    /**
     * Delete the unit by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Unit : {}", id);
        unitRepository.deleteById(id);
    }
}
