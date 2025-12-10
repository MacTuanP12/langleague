package com.langleague.service;

import static com.langleague.domain.LearningStreak.createNewStreak;

import com.langleague.domain.AppUser;
import com.langleague.domain.LearningStreak;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.LearningStreakRepository;
import com.langleague.service.dto.LearningStreakDTO;
import com.langleague.service.mapper.LearningStreakMapper;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.LearningStreak}.
 */
@Service
@Transactional
public class LearningStreakService {

    private static final Logger LOG = LoggerFactory.getLogger(LearningStreakService.class);

    private final LearningStreakRepository learningStreakRepository;
    private final LearningStreakMapper learningStreakMapper;
    private final AppUserRepository appUserRepository;

    public LearningStreakService(
        LearningStreakRepository learningStreakRepository,
        LearningStreakMapper learningStreakMapper,
        AppUserRepository appUserRepository
    ) {
        this.learningStreakRepository = learningStreakRepository;
        this.learningStreakMapper = learningStreakMapper;
        this.appUserRepository = appUserRepository;
    }

    /**
     * Save a learningStreak.
     *
     * @param learningStreakDTO the entity to save.
     * @return the persisted entity.
     */
    public LearningStreakDTO save(LearningStreakDTO learningStreakDTO) {
        LOG.debug("Request to save LearningStreak : {}", learningStreakDTO);
        LearningStreak learningStreak = learningStreakMapper.toEntity(learningStreakDTO);
        learningStreak = learningStreakRepository.save(learningStreak);
        return learningStreakMapper.toDto(learningStreak);
    }

    /**
     * Update a learningStreak.
     *
     * @param learningStreakDTO the entity to save.
     * @return the persisted entity.
     */
    public LearningStreakDTO update(LearningStreakDTO learningStreakDTO) {
        LOG.debug("Request to update LearningStreak : {}", learningStreakDTO);
        LearningStreak learningStreak = learningStreakMapper.toEntity(learningStreakDTO);
        learningStreak = learningStreakRepository.save(learningStreak);
        return learningStreakMapper.toDto(learningStreak);
    }

    /**
     * Partially update a learningStreak.
     *
     * @param learningStreakDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LearningStreakDTO> partialUpdate(LearningStreakDTO learningStreakDTO) {
        LOG.debug("Request to partially update LearningStreak : {}", learningStreakDTO);

        return learningStreakRepository
            .findById(learningStreakDTO.getId())
            .map(existingLearningStreak -> {
                learningStreakMapper.partialUpdate(existingLearningStreak, learningStreakDTO);

                return existingLearningStreak;
            })
            .map(learningStreakRepository::save)
            .map(learningStreakMapper::toDto);
    }

    /**
     * Get all the learningStreaks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<LearningStreakDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all LearningStreaks");
        return learningStreakRepository.findAll(pageable).map(learningStreakMapper::toDto);
    }

    /**
     * Get one learningStreak by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LearningStreakDTO> findOne(Long id) {
        LOG.debug("Request to get LearningStreak : {}", id);
        return learningStreakRepository.findById(id).map(learningStreakMapper::toDto);
    }

    /**
     * Delete the learningStreak by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete LearningStreak : {}", id);
        learningStreakRepository.deleteById(id);
    }

    /**
     * Get current learning streak for a user.
     * Use case 39: Track learning streak
     *
     * @param userLogin the user login
     * @return current streak count
     */
    @Transactional(readOnly = true)
    public Integer getCurrentStreak(String userLogin) {
        LOG.debug("Request to get current streak for user : {}", userLogin);
        return learningStreakRepository
            .findTopByAppUser_InternalUser_LoginOrderByLastStudyDateDesc(userLogin)
            .map(LearningStreak::getCurrentStreak)
            .orElse(0);
    }

    /**
     * Get longest learning streak for a user.
     * Use case 39: Track learning streak
     *
     * @param userLogin the user login
     * @return longest streak count
     */
    @Transactional(readOnly = true)
    public Integer getLongestStreak(String userLogin) {
        LOG.debug("Request to get longest streak for user : {}", userLogin);
        return learningStreakRepository
            .findTopByAppUser_InternalUser_LoginOrderByLongestStreakDesc(userLogin)
            .map(LearningStreak::getLongestStreak)
            .orElse(0);
    }

    /**
     * Record study activity using Rich Domain Model pattern.
     * Use case 39: Track learning streak
     *
     * REFACTORED: All business logic is now encapsulated in Entity.
     * Service only orchestrates: find/create -> delegate to entity -> save
     *
     * @param userLogin the user login
     * @param userTimezone the user's timezone (e.g., "Asia/Ho_Chi_Minh", "UTC")
     */
    @Retryable(retryFor = { ObjectOptimisticLockingFailureException.class }, maxAttempts = 3, backoff = @Backoff(delay = 100))
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void recordStudyActivity(String userLogin, ZoneId userTimezone) {
        LOG.debug("Recording study activity for user: {} in timezone: {}", userLogin, userTimezone);

        // 1. Find or create streak
        AppUser appUser = appUserRepository
            .findByUser_Login(userLogin)
            .orElseThrow(() -> new RuntimeException("AppUser not found for login: " + userLogin));

        LearningStreak streak = learningStreakRepository.findByAppUserId(appUser.getId()).orElseGet(() -> createNewStreak(appUser));

        // 2. Delegate business logic to Entity (Rich Domain Model)
        LocalDate today = LocalDate.now(userTimezone);
        boolean updated = streak.recordActivity(today, userTimezone);

        if (!updated) {
            LOG.debug("Streak already recorded today for user: {}", userLogin);
            return;
        }

        // 3. Persist
        learningStreakRepository.save(streak);

        LOG.info("Streak updated for user: {}, current: {}, longest: {}", userLogin, streak.getCurrentStreak(), streak.getLongestStreak());
    }

    /**
     * Overloaded method for backward compatibility - defaults to UTC
     */
    public void recordStudyActivity(String userLogin) {
        recordStudyActivity(userLogin, ZoneId.of("UTC"));
    }

    /**
     * Check if user needs to study today to maintain streak.
     * Uses entity's business logic.
     */
    @Transactional(readOnly = true)
    public boolean needsStudyToday(String userLogin, ZoneId timezone) {
        return learningStreakRepository
            .findTopByAppUser_InternalUser_LoginOrderByLastStudyDateDesc(userLogin)
            .map(streak -> !streak.hasStudiedToday(timezone)) // Business logic in entity!
            .orElse(true); // No streak yet = needs to study
    }

    /**
     * Backward compatibility - defaults to UTC
     */
    public boolean needsStudyToday(String userLogin) {
        return needsStudyToday(userLogin, ZoneId.of("UTC"));
    }

    /**
     * Check if user's streak is still active.
     */
    @Transactional(readOnly = true)
    public boolean isStreakActive(String userLogin, ZoneId timezone) {
        return learningStreakRepository
            .findTopByAppUser_InternalUser_LoginOrderByLastStudyDateDesc(userLogin)
            .map(streak -> streak.isStreakActive(timezone)) // Business logic in entity!
            .orElse(false);
    }

    // Removed createNewStreak() - now it's a static factory method in entity
}
