package com.langleague.app.service;

import com.langleague.app.domain.Progress;
import com.langleague.app.domain.Unit;
import com.langleague.app.domain.UserProfile;
import com.langleague.app.repository.ProgressRepository;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.service.dto.ProgressDTO;
import com.langleague.app.service.mapper.ProgressMapper;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.Progress}.
 */
@Service
@Transactional
public class ProgressService {

    private static final Logger LOG = LoggerFactory.getLogger(ProgressService.class);

    private final ProgressRepository progressRepository;

    private final ProgressMapper progressMapper;

    private final UserProfileRepository userProfileRepository;

    private final UnitRepository unitRepository;

    public ProgressService(
        ProgressRepository progressRepository,
        ProgressMapper progressMapper,
        UserProfileRepository userProfileRepository,
        UnitRepository unitRepository
    ) {
        this.progressRepository = progressRepository;
        this.progressMapper = progressMapper;
        this.userProfileRepository = userProfileRepository;
        this.unitRepository = unitRepository;
    }

    /**
     * Save a progress.
     *
     * @param progressDTO the entity to save.
     * @return the persisted entity.
     */
    public ProgressDTO save(ProgressDTO progressDTO) {
        LOG.debug("Request to save Progress : {}", progressDTO);
        Progress progress = progressMapper.toEntity(progressDTO);
        progress = progressRepository.save(progress);
        return progressMapper.toDto(progress);
    }

    /**
     * Update a progress.
     *
     * @param progressDTO the entity to save.
     * @return the persisted entity.
     */
    public ProgressDTO update(ProgressDTO progressDTO) {
        LOG.debug("Request to update Progress : {}", progressDTO);
        Progress progress = progressMapper.toEntity(progressDTO);
        progress = progressRepository.save(progress);
        return progressMapper.toDto(progress);
    }

    /**
     * Partially update a progress.
     *
     * @param progressDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProgressDTO> partialUpdate(ProgressDTO progressDTO) {
        LOG.debug("Request to partially update Progress : {}", progressDTO);

        return progressRepository
            .findById(progressDTO.getId())
            .map(existingProgress -> {
                progressMapper.partialUpdate(existingProgress, progressDTO);

                return existingProgress;
            })
            .map(progressRepository::save)
            .map(progressMapper::toDto);
    }

    /**
     * Get all the progresses.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProgressDTO> findAll() {
        LOG.debug("Request to get all Progresses");
        return progressRepository.findAll().stream().map(progressMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the progresses for the current user.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProgressDTO> findAllByCurrentUser() {
        LOG.debug("Request to get all Progresses for current user");
        return progressRepository
            .findByUserIsCurrentUser()
            .stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one progress by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProgressDTO> findOne(Long id) {
        LOG.debug("Request to get Progress : {}", id);
        return progressRepository.findById(id).map(progressMapper::toDto);
    }

    /**
     * Get one progress by current user and unit id.
     *
     * @param unitId the id of the unit.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProgressDTO> findByCurrentUserAndUnitId(Long unitId) {
        LOG.debug("Request to get Progress for current user and unit : {}", unitId);
        return progressRepository.findByUserIsCurrentUserAndUnitId(unitId).map(progressMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<ProgressDTO> findAllByUserProfileId(Long userProfileId) {
        return progressRepository.findByUserProfileId(userProfileId).stream().map(progressMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProgressDTO> findAllByUnitId(Long unitId) {
        return progressRepository.findByUnitId(unitId).stream().map(progressMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProgressDTO> findByUserProfileIdAndUnitId(Long userProfileId, Long unitId) {
        return progressRepository.findByUserProfileIdAndUnitId(userProfileId, unitId).map(progressMapper::toDto);
    }

    public ProgressDTO completeUnit(Long unitId) {
        Optional<UserProfile> userProfile = userProfileRepository.findOneByUserIsCurrentUser();
        if (userProfile.isEmpty()) {
            throw new RuntimeException("User profile not found");
        }

        Optional<Progress> existingProgress = progressRepository.findByUserIsCurrentUserAndUnitId(unitId);
        Progress progress;

        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setIsCompleted(true);
            progress.setUpdatedAt(Instant.now());
        } else {
            progress = new Progress();
            progress.setIsCompleted(true);
            progress.setUpdatedAt(Instant.now());
            progress.setUserProfile(userProfile.get());
            Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new RuntimeException("Unit not found"));
            progress.setUnit(unit);
        }

        progress = progressRepository.save(progress);
        return progressMapper.toDto(progress);
    }

    /**
     * Delete the progress by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Progress : {}", id);
        progressRepository.deleteById(id);
    }
}
