package com.langleague.service;

import com.langleague.domain.StreakMilestone;
import com.langleague.repository.StreakMilestoneRepository;
import com.langleague.service.dto.StreakMilestoneDTO;
import com.langleague.service.mapper.StreakMilestoneMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.StreakMilestone}.
 */
@Service
@Transactional
public class StreakMilestoneService {

    private static final Logger LOG = LoggerFactory.getLogger(StreakMilestoneService.class);

    private final StreakMilestoneRepository streakMilestoneRepository;

    private final StreakMilestoneMapper streakMilestoneMapper;

    public StreakMilestoneService(StreakMilestoneRepository streakMilestoneRepository, StreakMilestoneMapper streakMilestoneMapper) {
        this.streakMilestoneRepository = streakMilestoneRepository;
        this.streakMilestoneMapper = streakMilestoneMapper;
    }

    /**
     * Save a streakMilestone.
     *
     * @param streakMilestoneDTO the entity to save.
     * @return the persisted entity.
     */
    public StreakMilestoneDTO save(StreakMilestoneDTO streakMilestoneDTO) {
        LOG.debug("Request to save StreakMilestone : {}", streakMilestoneDTO);
        StreakMilestone streakMilestone = streakMilestoneMapper.toEntity(streakMilestoneDTO);
        streakMilestone = streakMilestoneRepository.save(streakMilestone);
        return streakMilestoneMapper.toDto(streakMilestone);
    }

    /**
     * Update a streakMilestone.
     *
     * @param streakMilestoneDTO the entity to save.
     * @return the persisted entity.
     */
    public StreakMilestoneDTO update(StreakMilestoneDTO streakMilestoneDTO) {
        LOG.debug("Request to update StreakMilestone : {}", streakMilestoneDTO);
        StreakMilestone streakMilestone = streakMilestoneMapper.toEntity(streakMilestoneDTO);
        streakMilestone = streakMilestoneRepository.save(streakMilestone);
        return streakMilestoneMapper.toDto(streakMilestone);
    }

    /**
     * Partially update a streakMilestone.
     *
     * @param streakMilestoneDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StreakMilestoneDTO> partialUpdate(StreakMilestoneDTO streakMilestoneDTO) {
        LOG.debug("Request to partially update StreakMilestone : {}", streakMilestoneDTO);

        return streakMilestoneRepository
            .findById(streakMilestoneDTO.getId())
            .map(existingStreakMilestone -> {
                streakMilestoneMapper.partialUpdate(existingStreakMilestone, streakMilestoneDTO);

                return existingStreakMilestone;
            })
            .map(streakMilestoneRepository::save)
            .map(streakMilestoneMapper::toDto);
    }

    /**
     * Get all the streakMilestones.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StreakMilestoneDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StreakMilestones");
        return streakMilestoneRepository.findAll(pageable).map(streakMilestoneMapper::toDto);
    }

    /**
     * Get one streakMilestone by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StreakMilestoneDTO> findOne(Long id) {
        LOG.debug("Request to get StreakMilestone : {}", id);
        return streakMilestoneRepository.findById(id).map(streakMilestoneMapper::toDto);
    }

    /**
     * Delete the streakMilestone by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete StreakMilestone : {}", id);
        streakMilestoneRepository.deleteById(id);
    }
}
