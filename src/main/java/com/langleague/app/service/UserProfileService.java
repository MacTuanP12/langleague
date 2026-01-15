package com.langleague.app.service;

import com.langleague.app.domain.UserProfile;
import com.langleague.app.repository.UserProfileRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.dto.UserProfileDTO;
import com.langleague.app.service.mapper.UserProfileMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.app.domain.UserProfile}.
 */
@Service
@Transactional
public class UserProfileService {

    private static final Logger LOG = LoggerFactory.getLogger(UserProfileService.class);

    private final UserProfileRepository userProfileRepository;

    private final UserProfileMapper userProfileMapper;

    public UserProfileService(UserProfileRepository userProfileRepository, UserProfileMapper userProfileMapper) {
        this.userProfileRepository = userProfileRepository;
        this.userProfileMapper = userProfileMapper;
    }

    /**
     * Save a userProfile.
     *
     * @param userProfileDTO the entity to save.
     * @return the persisted entity.
     */
    public UserProfileDTO save(UserProfileDTO userProfileDTO) {
        LOG.debug("Request to save UserProfile : {}", userProfileDTO);
        UserProfile userProfile = userProfileMapper.toEntity(userProfileDTO);
        userProfile = userProfileRepository.save(userProfile);
        return userProfileMapper.toDto(userProfile);
    }

    /**
     * Update a userProfile.
     *
     * @param userProfileDTO the entity to save.
     * @return the persisted entity.
     */
    public UserProfileDTO update(UserProfileDTO userProfileDTO) {
        LOG.debug("Request to update UserProfile : {}", userProfileDTO);
        UserProfile userProfile = userProfileMapper.toEntity(userProfileDTO);
        userProfile = userProfileRepository.save(userProfile);
        return userProfileMapper.toDto(userProfile);
    }

    /**
     * Partially update a userProfile.
     *
     * @param userProfileDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserProfileDTO> partialUpdate(UserProfileDTO userProfileDTO) {
        LOG.debug("Request to partially update UserProfile : {}", userProfileDTO);

        return userProfileRepository
            .findById(userProfileDTO.getId())
            .map(existingUserProfile -> {
                userProfileMapper.partialUpdate(existingUserProfile, userProfileDTO);

                return existingUserProfile;
            })
            .map(userProfileRepository::save)
            .map(userProfileMapper::toDto);
    }

    /**
     * Get all the userProfiles.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UserProfileDTO> findAll() {
        LOG.debug("Request to get all UserProfiles");
        return userProfileRepository.findAll().stream().map(userProfileMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the userProfiles with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<UserProfileDTO> findAllWithEagerRelationships(Pageable pageable) {
        return userProfileRepository.findAllWithEagerRelationships(pageable).map(userProfileMapper::toDto);
    }

    /**
     * Get one userProfile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserProfileDTO> findOne(Long id) {
        LOG.debug("Request to get UserProfile : {}", id);
        return userProfileRepository.findOneWithEagerRelationships(id).map(userProfileMapper::toDto);
    }

    /**
     * Get the userProfile of the currently authenticated user.
     *
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserProfileDTO> findCurrentUserProfile() {
        LOG.debug("Request to get UserProfile for current user");
        return userProfileRepository.findOneByUserIsCurrentUser().map(userProfileMapper::toDto);
    }

    /**
     * Delete the userProfile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete UserProfile : {}", id);
        userProfileRepository.deleteById(id);
    }

    public Map<String, Object> syncStreak() {
        UserProfileDTO userProfileDTO = findCurrentUserProfile().orElseThrow(() -> new RuntimeException("Current user profile not found"));

        Map<String, Object> result = new HashMap<>();

        // Only count streak for students - Admin and Teacher should not have streak
        boolean isStudent = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.STUDENT);
        boolean isAdminOrTeacher = SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.ADMIN, AuthoritiesConstants.TEACHER);

        if (!isStudent || isAdminOrTeacher) {
            // Admin and Teacher don't count streak, just return current values
            result.put("streakCount", userProfileDTO.getStreakCount() != null ? userProfileDTO.getStreakCount() : 0);
            result.put("milestoneReached", false);
            result.put("skipped", true);
            result.put("reason", "Streak only applies to students");
            return result;
        }

        LocalDate today = LocalDate.now();
        Instant lastLearningDate = userProfileDTO.getLastLearningDate();
        int streakCount = userProfileDTO.getStreakCount() != null ? userProfileDTO.getStreakCount() : 0;

        if (lastLearningDate != null) {
            LocalDate lastDate = LocalDate.ofInstant(lastLearningDate, ZoneId.systemDefault());
            if (lastDate.isEqual(today)) {
                // Case 1: Same day, do nothing
            } else if (lastDate.plusDays(1).isEqual(today)) {
                // Case 2: Consecutive
                streakCount++;
            } else {
                // Case 3: Gap
                streakCount = 1;
            }
        } else {
            streakCount = 1;
        }

        userProfileDTO.setStreakCount(streakCount);
        userProfileDTO.setLastLearningDate(Instant.now());
        save(userProfileDTO);

        boolean milestoneReached = List.of(7, 15, 30, 50, 100).contains(streakCount);

        result.put("streakCount", streakCount);
        result.put("milestoneReached", milestoneReached);
        return result;
    }

    /**
     * Update theme preference for the currently authenticated user.
     *
     * @param theme the theme mode (LIGHT, DARK, or SYSTEM).
     * @return the updated entity.
     */
    public UserProfileDTO updateThemePreference(String theme) {
        LOG.debug("Request to update theme preference for current user: {}", theme);

        UserProfileDTO userProfileDTO = findCurrentUserProfile().orElseThrow(() -> new RuntimeException("Current user profile not found"));
        userProfileDTO.setTheme(com.langleague.app.domain.enumeration.ThemeMode.valueOf(theme.toUpperCase()));
        return save(userProfileDTO);
    }
}
