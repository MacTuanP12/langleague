package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.UserVocabulary;
import com.langleague.domain.Word;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.UserVocabularyRepository;
import com.langleague.repository.WordRepository;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.LearningProgressDTO;
import com.langleague.service.dto.UserVocabularyDTO;
import com.langleague.service.dto.VocabularyStatisticsDTO;
import com.langleague.service.mapper.UserVocabularyMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.langleague.domain.UserVocabulary}.
 */
@Service
@Transactional
public class UserVocabularyService {

    private static final Logger LOG = LoggerFactory.getLogger(UserVocabularyService.class);

    private final UserVocabularyRepository userVocabularyRepository;

    private final UserVocabularyMapper userVocabularyMapper;

    private final WordRepository wordRepository;

    private final AppUserRepository appUserRepository;

    public UserVocabularyService(
        UserVocabularyRepository userVocabularyRepository,
        UserVocabularyMapper userVocabularyMapper,
        WordRepository wordRepository,
        AppUserRepository appUserRepository
    ) {
        this.userVocabularyRepository = userVocabularyRepository;
        this.userVocabularyMapper = userVocabularyMapper;
        this.wordRepository = wordRepository;
        this.appUserRepository = appUserRepository;
    }

    /**
     * Save a userVocabulary.
     *
     * @param userVocabularyDTO the entity to save.
     * @return the persisted entity.
     */
    public UserVocabularyDTO save(UserVocabularyDTO userVocabularyDTO) {
        LOG.debug("Request to save UserVocabulary : {}", userVocabularyDTO);
        UserVocabulary userVocabulary = userVocabularyMapper.toEntity(userVocabularyDTO);
        userVocabulary = userVocabularyRepository.save(userVocabulary);
        return userVocabularyMapper.toDto(userVocabulary);
    }

    /**
     * Update a userVocabulary.
     *
     * @param userVocabularyDTO the entity to save.
     * @return the persisted entity.
     */
    public UserVocabularyDTO update(UserVocabularyDTO userVocabularyDTO) {
        LOG.debug("Request to update UserVocabulary : {}", userVocabularyDTO);

        // Validate required fields
        if (userVocabularyDTO == null) {
            throw new IllegalArgumentException("UserVocabularyDTO cannot be null");
        }
        if (userVocabularyDTO.getId() == null) {
            throw new IllegalArgumentException("ID is required for update");
        }

        UserVocabulary userVocabulary = userVocabularyMapper.toEntity(userVocabularyDTO);
        userVocabulary = userVocabularyRepository.save(userVocabulary);
        return userVocabularyMapper.toDto(userVocabulary);
    }

    /**
     * Partially update a userVocabulary.
     *
     * @param userVocabularyDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserVocabularyDTO> partialUpdate(UserVocabularyDTO userVocabularyDTO) {
        LOG.debug("Request to partially update UserVocabulary : {}", userVocabularyDTO);

        return userVocabularyRepository
            .findById(userVocabularyDTO.getId())
            .map(existingUserVocabulary -> {
                userVocabularyMapper.partialUpdate(existingUserVocabulary, userVocabularyDTO);

                return existingUserVocabulary;
            })
            .map(userVocabularyRepository::save)
            .map(userVocabularyMapper::toDto);
    }

    /**
     * Get all the userVocabularies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserVocabularyDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all UserVocabularies");
        return userVocabularyRepository.findAll(pageable).map(userVocabularyMapper::toDto);
    }

    /**
     * Get one userVocabulary by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserVocabularyDTO> findOne(Long id) {
        LOG.debug("Request to get UserVocabulary : {}", id);
        return userVocabularyRepository.findById(id).map(userVocabularyMapper::toDto);
    }

    /**
     * Delete the userVocabulary by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete UserVocabulary : {}", id);
        userVocabularyRepository.deleteById(id);
    }

    /**
     * Save a word to user's vocabulary list.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId    the word ID
     * @param userLogin the user login
     * @return the saved userVocabulary
     */
    public UserVocabularyDTO saveWord(Long wordId, String userLogin) {
        LOG.debug("Request to save word {} for user {}", wordId, userLogin);

        // Check if already saved
        Optional<UserVocabulary> existing = userVocabularyRepository.findByWord_IdAndAppUser_InternalUser_Login(wordId, userLogin);
        if (existing.isPresent()) {
            LOG.info("Word {} already saved by user {}", wordId, userLogin);
            return userVocabularyMapper.toDto(existing.orElseThrow());
        }

        // Fetch entities
        Word word = wordRepository.findById(wordId).orElseThrow(() -> new RuntimeException("Word not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        // Create new saved word
        UserVocabulary userVocabulary = new UserVocabulary();
        userVocabulary.setWord(word);
        userVocabulary.setAppUser(appUser);
        userVocabulary.setLastReviewed(Instant.now());
        userVocabulary.setRemembered(false);
        userVocabulary.setIsMemorized(false);
        userVocabulary.setReviewCount(0);
        userVocabulary.setEaseFactor(250); // Default 2.5
        userVocabulary.setIntervalDays(0);
        userVocabulary.setNextReviewDate(LocalDate.now());

        userVocabulary = userVocabularyRepository.save(userVocabulary);
        LOG.info("Word {} saved by user {}", wordId, userLogin);
        return userVocabularyMapper.toDto(userVocabulary);
    }

    /**
     * Get all saved words for a user.
     * Use case 21: Interact with vocabulary
     *
     * @param userLogin the user login
     * @param pageable  pagination info
     * @return page of saved words
     */
    @Transactional(readOnly = true)
    public Page<UserVocabularyDTO> getSavedWords(String userLogin, Pageable pageable) {
        LOG.debug("Request to get saved words for user : {}", userLogin);
        return userVocabularyRepository.findByAppUser_InternalUser_Login(userLogin, pageable).map(userVocabularyMapper::toDto);
    }

    /**
     * Get memorized words for current user.
     *
     * @param isMemorized memorization status
     * @param pageable    pagination info
     * @return page of memorized words
     */
    @Transactional(readOnly = true)
    public Page<UserVocabularyDTO> getMemorizedWords(Boolean isMemorized, Pageable pageable) {
        LOG.debug("Request to get memorized words");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userVocabularyRepository
            .findByAppUser_InternalUser_LoginAndIsMemorized(userLogin, isMemorized, pageable)
            .map(userVocabularyMapper::toDto);
    }

    /**
     * Get words that need review today (SRS).
     *
     * @param pageable pagination info
     * @return page of words to review
     */
    @Transactional(readOnly = true)
    public Page<UserVocabularyDTO> getWordsToReview(Pageable pageable) {
        LOG.debug("Request to get words to review");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userVocabularyRepository
            .findByAppUser_InternalUser_LoginAndNextReviewDateLessThanEqual(userLogin, LocalDate.now(), pageable)
            .map(userVocabularyMapper::toDto);
    }

    /**
     * Get saved words by chapter.
     *
     * @param chapterId the chapter ID
     * @param pageable  pagination info
     * @return page of saved words
     */
    @Transactional(readOnly = true)
    public Page<UserVocabularyDTO> getSavedWordsByChapter(Long chapterId, Pageable pageable) {
        LOG.debug("Request to get saved words by chapter: {}", chapterId);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userVocabularyRepository.findByUserAndChapter(userLogin, chapterId, pageable).map(userVocabularyMapper::toDto);
    }

    /**
     * Update review result (SRS algorithm).
     *
     * @param wordId  the word ID
     * @param quality quality of recall (0-5)
     */
    public void updateReviewResult(Long wordId, Integer quality) {
        LOG.debug("Request to update review result for word: {} with quality: {}", wordId, quality);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        userVocabularyRepository
            .findByWord_IdAndAppUser_InternalUser_Login(wordId, userLogin)
            .ifPresent(vocab -> {
                // SM-2 algorithm (SuperMemo 2)
                int easeFactor = vocab.getEaseFactor() != null ? vocab.getEaseFactor() : 250;
                int intervalDays = vocab.getIntervalDays() != null ? vocab.getIntervalDays() : 0;
                int reviewCount = vocab.getReviewCount() != null ? vocab.getReviewCount() : 0;

                // Update ease factor
                easeFactor = Math.max(130, easeFactor + (10 * (5 - quality) - 8 * quality + 25));

                // Calculate new interval
                if (quality < 3) {
                    intervalDays = 1; // Reset
                } else {
                    if (reviewCount == 0) {
                        intervalDays = 1;
                    } else if (reviewCount == 1) {
                        intervalDays = 6;
                    } else {
                        intervalDays = (int) Math.round((intervalDays * easeFactor) / 100.0);
                    }
                }

                vocab.setEaseFactor(easeFactor);
                vocab.setIntervalDays(intervalDays);
                vocab.setNextReviewDate(LocalDate.now().plusDays(intervalDays));
                vocab.setLastReviewed(Instant.now());
                vocab.setReviewCount(reviewCount + 1);
                vocab.setIsMemorized(quality >= 4);

                userVocabularyRepository.save(vocab);
                LOG.info("Review result updated for word {} by user {}", wordId, userLogin);
            });
    }

    /**
     * Get statistics for saved vocabulary.
     *
     * @return statistics DTO
     */
    @Transactional(readOnly = true)
    public VocabularyStatisticsDTO getStatistics() {
        LOG.debug("Request to get vocabulary statistics");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        VocabularyStatisticsDTO stats = new VocabularyStatisticsDTO();
        stats.setTotalWords(userVocabularyRepository.countByAppUser_InternalUser_Login(userLogin));
        stats.setMemorizedWords(userVocabularyRepository.countByAppUser_InternalUser_LoginAndIsMemorized(userLogin, true));
        stats.setWordsToReviewToday(
            userVocabularyRepository.countByAppUser_InternalUser_LoginAndNextReviewDateLessThanEqual(userLogin, LocalDate.now())
        );

        return stats;
    }

    /**
     * Update memorization status for a saved word.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId      the word ID
     * @param userLogin   the user login
     * @param isMemorized new memorized status
     */
    public void updateMemorizationStatus(Long wordId, String userLogin, Boolean isMemorized) {
        LOG.debug("Request to update word {} memorized status to {} for user {}", wordId, isMemorized, userLogin);
        userVocabularyRepository
            .findByWord_IdAndAppUser_InternalUser_Login(wordId, userLogin)
            .ifPresent(vocab -> {
                vocab.setIsMemorized(isMemorized);
                vocab.setLastReviewed(java.time.Instant.now());
                if (isMemorized) {
                    vocab.setReviewCount(vocab.getReviewCount() != null ? vocab.getReviewCount() + 1 : 1);
                }
                userVocabularyRepository.save(vocab);
                LOG.info("Word {} memorized status updated to {} for user {}", wordId, isMemorized, userLogin);
            });
    }

    /**
     * Remove a word from user's saved vocabulary.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId    the word ID
     * @param userLogin the user login
     */
    public void unsaveWord(Long wordId, String userLogin) {
        LOG.debug("Request to unsave word {} for user {}", wordId, userLogin);
        userVocabularyRepository
            .findByWord_IdAndAppUser_InternalUser_Login(wordId, userLogin)
            .ifPresent(vocab -> {
                userVocabularyRepository.delete(vocab);
                LOG.info("Word {} removed from saved words for user {}", wordId, userLogin);
            });
    }

    /**
     * Check if user has saved this word.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId the word ID
     * @return true if saved, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isSaved(Long wordId) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userVocabularyRepository.existsByWord_IdAndAppUser_InternalUser_Login(wordId, userLogin);
    }

    /**
     * Get learning progress statistics.
     *
     * @return learning progress DTO
     */
    @Transactional(readOnly = true)
    public LearningProgressDTO getLearningProgress() {
        LOG.debug("Request to get learning progress");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        LearningProgressDTO progress = new LearningProgressDTO();

        long total = userVocabularyRepository.countByAppUser_InternalUser_Login(userLogin);
        long memorized = userVocabularyRepository.countByAppUser_InternalUser_LoginAndIsMemorized(userLogin, true);
        long learning = total - memorized;

        progress.setTotalWords(total);
        progress.setMemorizedWords(memorized);
        progress.setLearningWords(learning);
        progress.setMemorizedPercentage(total > 0 ? (int) ((memorized * 100) / total) : 0);

        return progress;
    }

    /**
     * Batch save multiple words for a user.
     * Use case 21: Interact with vocabulary
     *
     * @param wordIds   list of word IDs
     * @param userLogin the user login
     */
    public void batchSaveWords(java.util.List<Long> wordIds, String userLogin) {
        LOG.debug("Request to batch save {} words for user {}", wordIds.size(), userLogin);

        try {
            if (wordIds == null || wordIds.isEmpty()) {
                LOG.warn("Empty word IDs list provided");
                return;
            }

            AppUser appUser = appUserRepository
                .findByInternalUser_Login(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found"));

            int savedCount = 0;
            int skippedCount = 0;

            for (Long wordId : wordIds) {
                try {
                    // Check if already saved
                    if (!userVocabularyRepository.existsByWord_IdAndAppUser_InternalUser_Login(wordId, userLogin)) {
                        Word word = wordRepository.findById(wordId).orElse(null);
                        if (word != null) {
                            UserVocabulary userVocabulary = new UserVocabulary();
                            userVocabulary.setWord(word);
                            userVocabulary.setAppUser(appUser);
                            userVocabulary.setLastReviewed(Instant.now());
                            userVocabulary.setRemembered(false);
                            userVocabulary.setIsMemorized(false);
                            userVocabulary.setReviewCount(0);
                            userVocabulary.setEaseFactor(250);
                            userVocabulary.setIntervalDays(0);
                            userVocabulary.setNextReviewDate(LocalDate.now());
                            userVocabularyRepository.save(userVocabulary);
                            savedCount++;
                        } else {
                            LOG.warn("Word with ID {} not found", wordId);
                            skippedCount++;
                        }
                    } else {
                        skippedCount++;
                    }
                } catch (Exception e) {
                    LOG.error("Error saving word with ID {}: {}", wordId, e.getMessage());
                    // Continue with next word instead of failing entire batch
                }
            }
            LOG.info("Batch save completed for user {}: {} saved, {} skipped", userLogin, savedCount, skippedCount);
        } catch (Exception e) {
            LOG.error("Error in batch save words for user {}: {}", userLogin, e.getMessage(), e);
            throw new RuntimeException("Failed to batch save words: " + e.getMessage(), e);
        }
    }

    /**
     * Count saved words for a user.
     * Use case: Dashboard statistics
     *
     * @param userLogin the user login
     * @return count of saved words
     */
    @Transactional(readOnly = true)
    public Long countByUserLogin(String userLogin) {
        LOG.debug("Request to count vocabulary for user: {}", userLogin);
        return userVocabularyRepository.countByAppUser_InternalUser_Login(userLogin);
    }
}
