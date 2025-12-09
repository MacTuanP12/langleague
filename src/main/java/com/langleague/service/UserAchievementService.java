package com.langleague.service;

import com.langleague.domain.UserAchievement;
import com.langleague.repository.UserAchievementRepository;
import com.langleague.service.dto.UserAchievementDTO;
import com.langleague.service.mapper.UserAchievementMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.UserAchievement}.
 */
@Service
@Transactional
public class UserAchievementService {

    private static final Logger LOG = LoggerFactory.getLogger(UserAchievementService.class);

    private final UserAchievementRepository userAchievementRepository;

    private final UserAchievementMapper userAchievementMapper;

    public UserAchievementService(UserAchievementRepository userAchievementRepository, UserAchievementMapper userAchievementMapper) {
        this.userAchievementRepository = userAchievementRepository;
        this.userAchievementMapper = userAchievementMapper;
    }

    /**
     * Save a userAchievement.
     *
     * @param userAchievementDTO the entity to save.
     * @return the persisted entity.
     */
    public UserAchievementDTO save(UserAchievementDTO userAchievementDTO) {
        LOG.debug("Request to save UserAchievement : {}", userAchievementDTO);

        // Validate required fields
        if (userAchievementDTO == null) {
            throw new IllegalArgumentException("UserAchievementDTO cannot be null");
        }
        if (userAchievementDTO.getAchievement() == null || userAchievementDTO.getAchievement().getId() == null) {
            throw new IllegalArgumentException("Achievement is required");
        }

        UserAchievement userAchievement = userAchievementMapper.toEntity(userAchievementDTO);
        userAchievement = userAchievementRepository.save(userAchievement);
        return userAchievementMapper.toDto(userAchievement);
    }

    /**
     * Update a userAchievement.
     *
     * @param userAchievementDTO the entity to save.
     * @return the persisted entity.
     */
    public UserAchievementDTO update(UserAchievementDTO userAchievementDTO) {
        LOG.debug("Request to update UserAchievement : {}", userAchievementDTO);
        UserAchievement userAchievement = userAchievementMapper.toEntity(userAchievementDTO);
        userAchievement = userAchievementRepository.save(userAchievement);
        return userAchievementMapper.toDto(userAchievement);
    }

    /**
     * Partially update a userAchievement.
     *
     * @param userAchievementDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserAchievementDTO> partialUpdate(UserAchievementDTO userAchievementDTO) {
        LOG.debug("Request to partially update UserAchievement : {}", userAchievementDTO);

        return userAchievementRepository
            .findById(userAchievementDTO.getId())
            .map(existingUserAchievement -> {
                userAchievementMapper.partialUpdate(existingUserAchievement, userAchievementDTO);

                return existingUserAchievement;
            })
            .map(userAchievementRepository::save)
            .map(userAchievementMapper::toDto);
    }

    /**
     * Get all the userAchievements.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserAchievementDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all UserAchievements");
        return userAchievementRepository.findAll(pageable).map(userAchievementMapper::toDto);
    }

    /**
     * Get one userAchievement by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserAchievementDTO> findOne(Long id) {
        LOG.debug("Request to get UserAchievement : {}", id);
        return userAchievementRepository.findById(id).map(userAchievementMapper::toDto);
    }

    /**
     * Delete the userAchievement by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete UserAchievement : {}", id);
        userAchievementRepository.deleteById(id);
    }

    /**
     * Get all achievements for a specific user.
     *
     * @param userId the user ID
     * @return the list of user achievements
     */
    @Transactional(readOnly = true)
    public List<UserAchievementDTO> findByUserId(Long userId) {
        LOG.debug("Request to get all UserAchievements for user : {}", userId);
        return userAchievementRepository.findByAppUserId(userId).stream().map(userAchievementMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Check if user has a specific achievement.
     *
     * @param userId the user ID
     * @param achievementId the achievement ID
     * @return true if user has the achievement
     */
    @Transactional(readOnly = true)
    public boolean hasAchievement(Long userId, Long achievementId) {
        LOG.debug("Request to check if user {} has achievement {}", userId, achievementId);
        return userAchievementRepository.findByAppUserIdAndAchievementId(userId, achievementId).isPresent();
    }

    /**
     * Count total achievements for a user.
     *
     * @param userId the user ID
     * @return the count of achievements
     */
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        LOG.debug("Request to count achievements for user : {}", userId);
        return userAchievementRepository.findByAppUserId(userId).size();
    }
}
