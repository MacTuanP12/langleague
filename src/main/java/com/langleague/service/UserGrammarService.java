package com.langleague.service;

import com.langleague.domain.AppUser;
import com.langleague.domain.Grammar;
import com.langleague.domain.UserGrammar;
import com.langleague.repository.AppUserRepository;
import com.langleague.repository.GrammarRepository;
import com.langleague.repository.UserGrammarRepository;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.GrammarStatisticsDTO;
import com.langleague.service.dto.UserGrammarDTO;
import com.langleague.service.mapper.UserGrammarMapper;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserGrammar}.
 */
@Service
@Transactional
public class UserGrammarService {

    private static final Logger LOG = LoggerFactory.getLogger(UserGrammarService.class);

    private final UserGrammarRepository userGrammarRepository;

    private final UserGrammarMapper userGrammarMapper;

    private final GrammarRepository grammarRepository;

    private final AppUserRepository appUserRepository;

    public UserGrammarService(
        UserGrammarRepository userGrammarRepository,
        UserGrammarMapper userGrammarMapper,
        GrammarRepository grammarRepository,
        AppUserRepository appUserRepository
    ) {
        this.userGrammarRepository = userGrammarRepository;
        this.userGrammarMapper = userGrammarMapper;
        this.grammarRepository = grammarRepository;
        this.appUserRepository = appUserRepository;
    }

    /**
     * Save a userGrammar.
     *
     * @param userGrammarDTO the entity to save.
     * @return the persisted entity.
     */
    public UserGrammarDTO save(UserGrammarDTO userGrammarDTO) {
        LOG.debug("Request to save UserGrammar : {}", userGrammarDTO);
        UserGrammar userGrammar = userGrammarMapper.toEntity(userGrammarDTO);
        userGrammar = userGrammarRepository.save(userGrammar);
        return userGrammarMapper.toDto(userGrammar);
    }

    /**
     * Update a userGrammar.
     *
     * @param userGrammarDTO the entity to save.
     * @return the persisted entity.
     */
    public UserGrammarDTO update(UserGrammarDTO userGrammarDTO) {
        LOG.debug("Request to update UserGrammar : {}", userGrammarDTO);

        // Validate required fields
        if (userGrammarDTO == null) {
            throw new IllegalArgumentException("UserGrammarDTO cannot be null");
        }
        if (userGrammarDTO.getId() == null) {
            throw new IllegalArgumentException("ID is required for update");
        }

        UserGrammar userGrammar = userGrammarMapper.toEntity(userGrammarDTO);
        userGrammar = userGrammarRepository.save(userGrammar);
        return userGrammarMapper.toDto(userGrammar);
    }

    /**
     * Partially update a userGrammar.
     *
     * @param userGrammarDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserGrammarDTO> partialUpdate(UserGrammarDTO userGrammarDTO) {
        LOG.debug("Request to partially update UserGrammar : {}", userGrammarDTO);

        return userGrammarRepository
            .findById(userGrammarDTO.getId())
            .map(existingUserGrammar -> {
                userGrammarMapper.partialUpdate(existingUserGrammar, userGrammarDTO);

                return existingUserGrammar;
            })
            .map(userGrammarRepository::save)
            .map(userGrammarMapper::toDto);
    }

    /**
     * Get all the userGrammars.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserGrammarDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all UserGrammars");
        return userGrammarRepository.findAll(pageable).map(userGrammarMapper::toDto);
    }

    /**
     * Get one userGrammar by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserGrammarDTO> findOne(Long id) {
        LOG.debug("Request to get UserGrammar : {}", id);
        return userGrammarRepository.findById(id).map(userGrammarMapper::toDto);
    }

    /**
     * Delete the userGrammar by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete UserGrammar : {}", id);
        userGrammarRepository.deleteById(id);
    }

    /**
     * Save a grammar to user's grammar list (flashcard).
     *
     * @param grammarId the grammar ID
     * @param userLogin the user login
     * @return the saved userGrammar
     */
    public UserGrammarDTO saveGrammar(Long grammarId, String userLogin) {
        LOG.debug("Request to save grammar {} for user {}", grammarId, userLogin);

        // Check if already saved
        Optional<UserGrammar> existing = userGrammarRepository.findByGrammar_IdAndAppUser_InternalUser_Login(grammarId, userLogin);
        if (existing.isPresent()) {
            LOG.info("Grammar {} already saved by user {}", grammarId, userLogin);
            return userGrammarMapper.toDto(existing.orElseThrow());
        }

        // Fetch entities
        Grammar grammar = grammarRepository.findById(grammarId).orElseThrow(() -> new RuntimeException("Grammar not found"));
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow(() -> new RuntimeException("User not found"));

        // Create new saved grammar
        UserGrammar userGrammar = new UserGrammar();
        userGrammar.setGrammar(grammar);
        userGrammar.setAppUser(appUser);
        userGrammar.setLastReviewed(Instant.now());
        userGrammar.setRemembered(false);
        userGrammar.setIsMemorized(false);
        userGrammar.setReviewCount(0);

        userGrammar = userGrammarRepository.save(userGrammar);
        LOG.info("Grammar {} saved by user {}", grammarId, userLogin);
        return userGrammarMapper.toDto(userGrammar);
    }

    /**
     * Get all saved grammars for current user.
     *
     * @param pageable pagination info
     * @return page of saved grammars
     */
    @Transactional(readOnly = true)
    public Page<UserGrammarDTO> getSavedGrammars(Pageable pageable) {
        LOG.debug("Request to get saved grammars for current user");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userGrammarRepository.findByAppUser_InternalUser_Login(userLogin, pageable).map(userGrammarMapper::toDto);
    }

    /**
     * Get memorized grammars for current user.
     *
     * @param isMemorized memorization status
     * @param pageable pagination info
     * @return page of memorized grammars
     */
    @Transactional(readOnly = true)
    public Page<UserGrammarDTO> getMemorizedGrammars(Boolean isMemorized, Pageable pageable) {
        LOG.debug("Request to get memorized grammars");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userGrammarRepository
            .findByAppUser_InternalUser_LoginAndIsMemorized(userLogin, isMemorized, pageable)
            .map(userGrammarMapper::toDto);
    }

    /**
     * Get grammars that need review.
     *
     * @param pageable pagination info
     * @return page of grammars to review
     */
    @Transactional(readOnly = true)
    public Page<UserGrammarDTO> getGrammarsToReview(Pageable pageable) {
        LOG.debug("Request to get grammars to review");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        Instant reviewDate = Instant.now().minusSeconds(24 * 60 * 60); // 1 day ago
        return userGrammarRepository.findGrammarsNeedReview(userLogin, reviewDate, pageable).map(userGrammarMapper::toDto);
    }

    /**
     * Update review result for grammar.
     *
     * @param grammarId the grammar ID
     * @param isMemorized whether user memorized it
     */
    public void updateReviewResult(Long grammarId, Boolean isMemorized) {
        LOG.debug("Request to update review result for grammar: {} with status: {}", grammarId, isMemorized);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        userGrammarRepository
            .findByGrammar_IdAndAppUser_InternalUser_Login(grammarId, userLogin)
            .ifPresent(grammar -> {
                int reviewCount = grammar.getReviewCount() != null ? grammar.getReviewCount() : 0;

                grammar.setIsMemorized(isMemorized);
                grammar.setLastReviewed(Instant.now());
                grammar.setReviewCount(reviewCount + 1);

                userGrammarRepository.save(grammar);
                LOG.info("Review result updated for grammar {} by user {}", grammarId, userLogin);
            });
    }

    /**
     * Remove a grammar from user's saved list.
     *
     * @param grammarId the grammar ID
     * @param userLogin the user login
     */
    public void unsaveGrammar(Long grammarId, String userLogin) {
        LOG.debug("Request to unsave grammar {} for user {}", grammarId, userLogin);
        userGrammarRepository
            .findByGrammar_IdAndAppUser_InternalUser_Login(grammarId, userLogin)
            .ifPresent(grammar -> {
                userGrammarRepository.delete(grammar);
                LOG.info("Grammar {} removed from saved grammars for user {}", grammarId, userLogin);
            });
    }

    /**
     * Get statistics for saved grammar.
     *
     * @return statistics DTO
     */
    @Transactional(readOnly = true)
    public GrammarStatisticsDTO getStatistics() {
        LOG.debug("Request to get grammar statistics");
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        GrammarStatisticsDTO stats = new GrammarStatisticsDTO();
        stats.setTotalGrammars(userGrammarRepository.countByAppUser_InternalUser_Login(userLogin));
        stats.setMemorizedGrammars(userGrammarRepository.countByAppUser_InternalUser_LoginAndIsMemorized(userLogin, true));

        return stats;
    }

    /**
     * Check if user has saved this grammar.
     *
     * @param grammarId the grammar ID
     * @return true if saved
     */
    @Transactional(readOnly = true)
    public boolean isSaved(Long grammarId) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));
        return userGrammarRepository.existsByGrammar_IdAndAppUser_InternalUser_Login(grammarId, userLogin);
    }
}
