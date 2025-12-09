package com.langleague.service;

import com.langleague.domain.ReadingOption;
import com.langleague.repository.ReadingOptionRepository;
import com.langleague.service.dto.ReadingOptionDTO;
import com.langleague.service.mapper.ReadingOptionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ReadingOption}.
 */
@Service
@Transactional
public class ReadingOptionService {

    private static final Logger LOG = LoggerFactory.getLogger(ReadingOptionService.class);

    private final ReadingOptionRepository readingOptionRepository;

    private final ReadingOptionMapper readingOptionMapper;

    public ReadingOptionService(ReadingOptionRepository readingOptionRepository, ReadingOptionMapper readingOptionMapper) {
        this.readingOptionRepository = readingOptionRepository;
        this.readingOptionMapper = readingOptionMapper;
    }

    /**
     * Save a readingOption.
     *
     * @param readingOptionDTO the entity to save.
     * @return the persisted entity.
     */
    public ReadingOptionDTO save(ReadingOptionDTO readingOptionDTO) {
        LOG.debug("Request to save ReadingOption : {}", readingOptionDTO);
        ReadingOption readingOption = readingOptionMapper.toEntity(readingOptionDTO);
        readingOption = readingOptionRepository.save(readingOption);
        return readingOptionMapper.toDto(readingOption);
    }

    /**
     * Update a readingOption.
     *
     * @param readingOptionDTO the entity to save.
     * @return the persisted entity.
     */
    public ReadingOptionDTO update(ReadingOptionDTO readingOptionDTO) {
        LOG.debug("Request to update ReadingOption : {}", readingOptionDTO);
        ReadingOption readingOption = readingOptionMapper.toEntity(readingOptionDTO);
        readingOption = readingOptionRepository.save(readingOption);
        return readingOptionMapper.toDto(readingOption);
    }

    /**
     * Partially update a readingOption.
     *
     * @param readingOptionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ReadingOptionDTO> partialUpdate(ReadingOptionDTO readingOptionDTO) {
        LOG.debug("Request to partially update ReadingOption : {}", readingOptionDTO);

        return readingOptionRepository
            .findById(readingOptionDTO.getId())
            .map(existingReadingOption -> {
                readingOptionMapper.partialUpdate(existingReadingOption, readingOptionDTO);

                return existingReadingOption;
            })
            .map(readingOptionRepository::save)
            .map(readingOptionMapper::toDto);
    }

    /**
     * Get all the readingOptions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ReadingOptionDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ReadingOptions");
        return readingOptionRepository.findAll(pageable).map(readingOptionMapper::toDto);
    }

    /**
     * Get one readingOption by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReadingOptionDTO> findOne(Long id) {
        LOG.debug("Request to get ReadingOption : {}", id);
        return readingOptionRepository.findById(id).map(readingOptionMapper::toDto);
    }

    /**
     * Delete the readingOption by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ReadingOption : {}", id);
        readingOptionRepository.deleteById(id);
    }
}
