package com.langleague.service;

import com.langleague.domain.ListeningOption;
import com.langleague.repository.ListeningOptionRepository;
import com.langleague.service.dto.ListeningOptionDTO;
import com.langleague.service.mapper.ListeningOptionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ListeningOption}.
 */
@Service
@Transactional
public class ListeningOptionService {

    private static final Logger LOG = LoggerFactory.getLogger(ListeningOptionService.class);

    private final ListeningOptionRepository listeningOptionRepository;

    private final ListeningOptionMapper listeningOptionMapper;

    public ListeningOptionService(ListeningOptionRepository listeningOptionRepository, ListeningOptionMapper listeningOptionMapper) {
        this.listeningOptionRepository = listeningOptionRepository;
        this.listeningOptionMapper = listeningOptionMapper;
    }

    /**
     * Save a listeningOption.
     *
     * @param listeningOptionDTO the entity to save.
     * @return the persisted entity.
     */
    public ListeningOptionDTO save(ListeningOptionDTO listeningOptionDTO) {
        LOG.debug("Request to save ListeningOption : {}", listeningOptionDTO);
        ListeningOption listeningOption = listeningOptionMapper.toEntity(listeningOptionDTO);
        listeningOption = listeningOptionRepository.save(listeningOption);
        return listeningOptionMapper.toDto(listeningOption);
    }

    /**
     * Update a listeningOption.
     *
     * @param listeningOptionDTO the entity to save.
     * @return the persisted entity.
     */
    public ListeningOptionDTO update(ListeningOptionDTO listeningOptionDTO) {
        LOG.debug("Request to update ListeningOption : {}", listeningOptionDTO);
        ListeningOption listeningOption = listeningOptionMapper.toEntity(listeningOptionDTO);
        listeningOption = listeningOptionRepository.save(listeningOption);
        return listeningOptionMapper.toDto(listeningOption);
    }

    /**
     * Partially update a listeningOption.
     *
     * @param listeningOptionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ListeningOptionDTO> partialUpdate(ListeningOptionDTO listeningOptionDTO) {
        LOG.debug("Request to partially update ListeningOption : {}", listeningOptionDTO);

        return listeningOptionRepository
            .findById(listeningOptionDTO.getId())
            .map(existingListeningOption -> {
                listeningOptionMapper.partialUpdate(existingListeningOption, listeningOptionDTO);

                return existingListeningOption;
            })
            .map(listeningOptionRepository::save)
            .map(listeningOptionMapper::toDto);
    }

    /**
     * Get all the listeningOptions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ListeningOptionDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ListeningOptions");
        return listeningOptionRepository.findAll(pageable).map(listeningOptionMapper::toDto);
    }

    /**
     * Get one listeningOption by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ListeningOptionDTO> findOne(Long id) {
        LOG.debug("Request to get ListeningOption : {}", id);
        return listeningOptionRepository.findById(id).map(listeningOptionMapper::toDto);
    }

    /**
     * Delete the listeningOption by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ListeningOption : {}", id);
        listeningOptionRepository.deleteById(id);
    }
}
