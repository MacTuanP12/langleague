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
        UserProfile userProfileEntity = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("User profile not found"));

        Progress progress = progressRepository
            .findByUserIsCurrentUserAndUnitId(unitId)
            .map(existingProgress -> {
                existingProgress.setIsCompleted(true);
                existingProgress.setUpdatedAt(Instant.now());
                return existingProgress;
            })
            .orElseGet(() -> {
                Progress newProgress = new Progress();
                newProgress.setIsCompleted(true);
                newProgress.setUpdatedAt(Instant.now());
                newProgress.setUserProfile(userProfileEntity);
                Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new RuntimeException("Unit not found"));
                newProgress.setUnit(unit);
                return newProgress;
            });

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

    /**
     * Toggle bookmark status for a unit for the current user.
     * UC-49: Manual bookmark functionality.
     *
     * @param unitId the id of the unit.
     * @return the updated progress with new bookmark status.
     */
    public ProgressDTO toggleBookmark(Long unitId) {
        LOG.debug("Request to toggle bookmark for unit : {}", unitId);

        UserProfile userProfileEntity = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("User profile not found"));

        Progress progress = progressRepository
            .findByUserIsCurrentUserAndUnitId(unitId)
            .map(existingProgress -> {
                // Toggle the bookmark status
                existingProgress.setIsBookmarked(!Boolean.TRUE.equals(existingProgress.getIsBookmarked()));
                existingProgress.setUpdatedAt(Instant.now());
                return existingProgress;
            })
            .orElseGet(() -> {
                // Create new progress record with bookmark
                Progress newProgress = new Progress();
                newProgress.setIsCompleted(false);
                newProgress.setIsBookmarked(true);
                newProgress.setUpdatedAt(Instant.now());
                newProgress.setLastAccessedAt(Instant.now());
                newProgress.setCompletionPercentage(0);
                newProgress.setUserProfile(userProfileEntity);
                Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new RuntimeException("Unit not found"));
                newProgress.setUnit(unit);
                return newProgress;
            });

        progress = progressRepository.save(progress);
        return progressMapper.toDto(progress);
    }

    /**
     * Track unit access for auto-resume functionality.
     * UC-49: Automatic tracking of last accessed unit.
     *
     * @param unitId the id of the unit being accessed.
     * @return the updated progress.
     */
    public ProgressDTO trackUnitAccess(Long unitId) {
        LOG.debug("Request to track unit access : {}", unitId);

        UserProfile userProfileEntity = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("User profile not found"));

        Progress progress = progressRepository
            .findByUserIsCurrentUserAndUnitId(unitId)
            .map(existingProgress -> {
                existingProgress.setLastAccessedAt(Instant.now());
                existingProgress.setUpdatedAt(Instant.now());
                return existingProgress;
            })
            .orElseGet(() -> {
                // Create new progress record with access tracking
                Progress newProgress = new Progress();
                newProgress.setIsCompleted(false);
                newProgress.setIsBookmarked(false);
                newProgress.setUpdatedAt(Instant.now());
                newProgress.setLastAccessedAt(Instant.now());
                newProgress.setCompletionPercentage(0);
                newProgress.setIsVocabularyFinished(false);
                newProgress.setIsGrammarFinished(false);
                newProgress.setIsExerciseFinished(false);
                newProgress.setUserProfile(userProfileEntity);
                Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new RuntimeException("Unit not found"));
                newProgress.setUnit(unit);
                return newProgress;
            });

        progress = progressRepository.save(progress);
        return progressMapper.toDto(progress);
    }

    /**
     * Get all bookmarked units for the current user.
     * UC-49: Retrieve bookmarked units for review.
     *
     * @return the list of bookmarked progresses.
     */
    @Transactional(readOnly = true)
    public List<ProgressDTO> findBookmarkedByCurrentUser() {
        LOG.debug("Request to get all bookmarked units for current user");
        return progressRepository
            .findBookmarkedByCurrentUser()
            .stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get the most recently accessed unit for auto-resume functionality.
     * UC-49: Resume learning from last accessed unit.
     *
     * @return the most recently accessed progress.
     */
    @Transactional(readOnly = true)
    public Optional<ProgressDTO> findMostRecentlyAccessedByCurrentUser() {
        LOG.debug("Request to get most recently accessed unit for current user");
        List<Progress> progresses = progressRepository.findByCurrentUserOrderByLastAccessedAtDesc();
        if (!progresses.isEmpty()) {
            return Optional.of(progressMapper.toDto(progresses.get(0)));
        }
        return Optional.empty();
    }

    /**
     * Update progress section completion and recalculate percentage.
     * UC-49: Granular tracking of vocabulary, grammar, and exercise completion.
     *
     * @param unitId the id of the unit.
     * @param sectionType the type of section completed (VOCABULARY, GRAMMAR, EXERCISE).
     * @return the updated progress.
     */
    public ProgressDTO updateSectionProgress(Long unitId, String sectionType) {
        LOG.debug("Request to update section progress for unit {} : section {}", unitId, sectionType);

        UserProfile userProfileEntity = userProfileRepository
            .findOneByUserIsCurrentUser()
            .orElseThrow(() -> new RuntimeException("User profile not found"));

        Progress progress = progressRepository
            .findByUserIsCurrentUserAndUnitId(unitId)
            .orElseGet(() -> {
                // Create new progress if it doesn't exist
                Progress newProgress = new Progress();
                newProgress.setIsCompleted(false);
                newProgress.setIsBookmarked(false);
                newProgress.setUpdatedAt(Instant.now());
                newProgress.setLastAccessedAt(Instant.now());
                newProgress.setCompletionPercentage(0);
                newProgress.setIsVocabularyFinished(false);
                newProgress.setIsGrammarFinished(false);
                newProgress.setIsExerciseFinished(false);
                newProgress.setUserProfile(userProfileEntity);
                Unit unit = unitRepository.findById(unitId).orElseThrow(() -> new RuntimeException("Unit not found"));
                newProgress.setUnit(unit);
                return newProgress;
            });

        // Update section completion based on type
        switch (sectionType.toUpperCase()) {
            case "VOCABULARY":
                progress.setIsVocabularyFinished(true);
                break;
            case "GRAMMAR":
                progress.setIsGrammarFinished(true);
                break;
            case "EXERCISE":
                progress.setIsExerciseFinished(true);
                break;
            default:
                throw new IllegalArgumentException("Invalid section type: " + sectionType);
        }

        // Recalculate completion percentage
        int completedSections = 0;
        if (Boolean.TRUE.equals(progress.getIsVocabularyFinished())) completedSections++;
        if (Boolean.TRUE.equals(progress.getIsGrammarFinished())) completedSections++;
        if (Boolean.TRUE.equals(progress.getIsExerciseFinished())) completedSections++;

        int totalSections = 3; // Vocabulary, Grammar, Exercise
        int percentage = (completedSections * 100) / totalSections;
        progress.setCompletionPercentage(percentage);

        // Mark as completed if all sections are done
        if (percentage == 100) {
            progress.setIsCompleted(true);
        }

        progress.setUpdatedAt(Instant.now());
        progress = progressRepository.save(progress);
        return progressMapper.toDto(progress);
    }

    /**
     * Get system-wide completion rate.
     *
     * @return the completion rate percentage.
     */
    @Transactional(readOnly = true)
    public int getSystemCompletionRate() {
        LOG.debug("Request to get system completion rate");
        long total = progressRepository.count();
        if (total == 0) {
            return 0;
        }
        long completed = progressRepository.countByIsCompletedTrue();
        return (int) Math.round(((double) completed / total) * 100);
    }
}
