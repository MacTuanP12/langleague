package com.langleague.service;

import com.langleague.domain.StreakIcon;
import com.langleague.repository.StreakIconRepository;
import com.langleague.service.dto.StreakIconDTO;
import com.langleague.service.mapper.StreakIconMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.StreakIcon}.
 */
@Service
@Transactional
public class StreakIconService {

    private static final Logger LOG = LoggerFactory.getLogger(StreakIconService.class);

    private final StreakIconRepository streakIconRepository;

    private final StreakIconMapper streakIconMapper;

    public StreakIconService(StreakIconRepository streakIconRepository, StreakIconMapper streakIconMapper) {
        this.streakIconRepository = streakIconRepository;
        this.streakIconMapper = streakIconMapper;
    }

    /**
     * Save a streakIcon.
     *
     * @param streakIconDTO the entity to save.
     * @return the persisted entity.
     */
    public StreakIconDTO save(StreakIconDTO streakIconDTO) {
        LOG.debug("Request to save StreakIcon : {}", streakIconDTO);
        StreakIcon streakIcon = streakIconMapper.toEntity(streakIconDTO);
        streakIcon = streakIconRepository.save(streakIcon);
        return streakIconMapper.toDto(streakIcon);
    }

    /**
     * Update a streakIcon.
     *
     * @param streakIconDTO the entity to save.
     * @return the persisted entity.
     */
    public StreakIconDTO update(StreakIconDTO streakIconDTO) {
        LOG.debug("Request to update StreakIcon : {}", streakIconDTO);
        StreakIcon streakIcon = streakIconMapper.toEntity(streakIconDTO);
        streakIcon = streakIconRepository.save(streakIcon);
        return streakIconMapper.toDto(streakIcon);
    }

    /**
     * Partially update a streakIcon.
     *
     * @param streakIconDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StreakIconDTO> partialUpdate(StreakIconDTO streakIconDTO) {
        LOG.debug("Request to partially update StreakIcon : {}", streakIconDTO);

        return streakIconRepository
            .findById(streakIconDTO.getId())
            .map(existingStreakIcon -> {
                streakIconMapper.partialUpdate(existingStreakIcon, streakIconDTO);

                return existingStreakIcon;
            })
            .map(streakIconRepository::save)
            .map(streakIconMapper::toDto);
    }

    /**
     * Get all the streakIcons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StreakIconDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StreakIcons");
        return streakIconRepository.findAll(pageable).map(streakIconMapper::toDto);
    }

    /**
     * Get one streakIcon by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StreakIconDTO> findOne(Long id) {
        LOG.debug("Request to get StreakIcon : {}", id);
        return streakIconRepository.findById(id).map(streakIconMapper::toDto);
    }

    /**
     * Delete the streakIcon by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete StreakIcon : {}", id);
        streakIconRepository.deleteById(id);
    }
}
