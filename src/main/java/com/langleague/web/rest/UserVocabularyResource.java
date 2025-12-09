package com.langleague.web.rest;

import com.langleague.repository.UserVocabularyRepository;
import com.langleague.service.UserVocabularyService;
import com.langleague.service.dto.LearningProgressDTO;
import com.langleague.service.dto.UserVocabularyDTO;
import com.langleague.service.dto.VocabularyStatisticsDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.UserVocabulary}.
 */
@RestController
@RequestMapping("/api/user-vocabularies")
public class UserVocabularyResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserVocabularyResource.class);

    private static final String ENTITY_NAME = "userVocabulary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserVocabularyService userVocabularyService;

    private final UserVocabularyRepository userVocabularyRepository;

    public UserVocabularyResource(UserVocabularyService userVocabularyService, UserVocabularyRepository userVocabularyRepository) {
        this.userVocabularyService = userVocabularyService;
        this.userVocabularyRepository = userVocabularyRepository;
    }

    /**
     * {@code POST  /user-vocabularies} : Create a new userVocabulary.
     *
     * @param userVocabularyDTO the userVocabularyDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userVocabularyDTO, or with status {@code 400 (Bad Request)} if the userVocabulary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserVocabularyDTO> createUserVocabulary(@Valid @RequestBody UserVocabularyDTO userVocabularyDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save UserVocabulary : {}", userVocabularyDTO);
        if (userVocabularyDTO.getId() != null) {
            throw new BadRequestAlertException("A new userVocabulary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userVocabularyDTO = userVocabularyService.save(userVocabularyDTO);
        return ResponseEntity.created(new URI("/api/user-vocabularies/" + userVocabularyDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userVocabularyDTO.getId().toString()))
            .body(userVocabularyDTO);
    }

    /**
     * {@code PUT  /user-vocabularies/:id} : Updates an existing userVocabulary.
     *
     * @param id the id of the userVocabularyDTO to save.
     * @param userVocabularyDTO the userVocabularyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userVocabularyDTO,
     * or with status {@code 400 (Bad Request)} if the userVocabularyDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userVocabularyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserVocabularyDTO> updateUserVocabulary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserVocabularyDTO userVocabularyDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update UserVocabulary : {}, {}", id, userVocabularyDTO);
        if (userVocabularyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userVocabularyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userVocabularyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        userVocabularyDTO = userVocabularyService.update(userVocabularyDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userVocabularyDTO.getId().toString()))
            .body(userVocabularyDTO);
    }

    /**
     * {@code PATCH  /user-vocabularies/:id} : Partial updates given fields of an existing userVocabulary, field will ignore if it is null
     *
     * @param id the id of the userVocabularyDTO to save.
     * @param userVocabularyDTO the userVocabularyDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userVocabularyDTO,
     * or with status {@code 400 (Bad Request)} if the userVocabularyDTO is not valid,
     * or with status {@code 404 (Not Found)} if the userVocabularyDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the userVocabularyDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserVocabularyDTO> partialUpdateUserVocabulary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserVocabularyDTO userVocabularyDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update UserVocabulary partially : {}, {}", id, userVocabularyDTO);
        if (userVocabularyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userVocabularyDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userVocabularyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserVocabularyDTO> result = userVocabularyService.partialUpdate(userVocabularyDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userVocabularyDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /user-vocabularies} : get all the userVocabularies.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userVocabularies in body.
     */
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserVocabularyDTO>> getAllUserVocabularies(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of UserVocabularies");
        Page<UserVocabularyDTO> page = userVocabularyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-vocabularies/:id} : get the "id" userVocabulary.
     *
     * @param id the id of the userVocabularyDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userVocabularyDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserVocabularyDTO> getUserVocabulary(@PathVariable("id") Long id) {
        LOG.debug("REST request to get UserVocabulary : {}", id);
        Optional<UserVocabularyDTO> userVocabularyDTO = userVocabularyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userVocabularyDTO);
    }

    /**
     * {@code DELETE  /user-vocabularies/:id} : delete the "id" userVocabulary.
     *
     * @param id the id of the userVocabularyDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUserVocabulary(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete UserVocabulary : {}", id);
        userVocabularyService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /user-vocabularies/save-word} : Save a word to user's vocabulary list.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId the id of the word to save.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the saved userVocabularyDTO.
     */
    @PostMapping("/save-word")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserVocabularyDTO> saveWord(@RequestParam("wordId") Long wordId) {
        LOG.debug("REST request to save word : {}", wordId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        UserVocabularyDTO result = userVocabularyService.saveWord(wordId, userLogin);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /user-vocabularies/saved} : Get all saved words for the logged-in user.
     * {@code GET  /user-vocabularies/my-words} : Alias for /saved
     * Use case 21: Interact with vocabulary
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of saved words in body.
     */
    @GetMapping({ "/saved", "/my-words" })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserVocabularyDTO>> getSavedWords(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get saved words");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        Page<UserVocabularyDTO> page = userVocabularyService.getSavedWords(userLogin, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code PUT  /user-vocabularies/word/:wordId/status} : Update memorization status for a saved word.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId the id of the word.
     * @param isMemorized the new memorized status.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/word/{wordId}/memorized")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateMemorizationStatus(
        @PathVariable("wordId") Long wordId,
        @RequestParam("isMemorized") Boolean isMemorized
    ) {
        LOG.debug("REST request to update word {} memorized status to {}", wordId, isMemorized);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        userVocabularyService.updateMemorizationStatus(wordId, userLogin, isMemorized);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code DELETE  /user-vocabularies/word/:wordId} : Remove a word from user's saved vocabulary.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId the id of the word to remove.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/word/{wordId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unsaveWord(@PathVariable("wordId") Long wordId) {
        LOG.debug("REST request to unsave word : {}", wordId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        userVocabularyService.unsaveWord(wordId, userLogin);
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code GET  /user-vocabularies/my-words/memorized} : Get memorized words for current user.
     *
     * @param isMemorized memorization status
     * @param pageable pagination info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("/my-words/memorized")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserVocabularyDTO>> getMemorizedWords(
        @RequestParam(defaultValue = "true") Boolean isMemorized,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get memorized words");
        Page<UserVocabularyDTO> page = userVocabularyService.getMemorizedWords(isMemorized, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-vocabularies/my-words/review-today} : Get words to review today (SRS).
     *
     * @param pageable pagination info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("/my-words/review-today")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserVocabularyDTO>> getWordsToReview(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get words to review today");
        Page<UserVocabularyDTO> page = userVocabularyService.getWordsToReview(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-vocabularies/my-words/chapter/:chapterId} : Get saved words by chapter.
     *
     * @param chapterId the chapter ID
     * @param pageable pagination info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("/my-words/chapter/{chapterId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserVocabularyDTO>> getSavedWordsByChapter(
        @PathVariable Long chapterId,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get saved words by chapter: {}", chapterId);
        Page<UserVocabularyDTO> page = userVocabularyService.getSavedWordsByChapter(chapterId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code PUT  /user-vocabularies/review/:wordId} : Update review result (SRS algorithm).
     *
     * @param wordId the word ID
     * @param quality quality of recall (0-5)
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/review/{wordId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateReviewResult(@PathVariable Long wordId, @RequestParam Integer quality) {
        LOG.debug("REST request to update review result for word: {} with quality: {}", wordId, quality);
        if (quality < 0 || quality > 5) {
            throw new BadRequestAlertException("Quality must be between 0 and 5", ENTITY_NAME, "invalidquality");
        }
        userVocabularyService.updateReviewResult(wordId, quality);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code POST  /user-vocabularies/save/:wordId} : Save a word (alternative endpoint).
     *
     * @param wordId the word ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the saved userVocabularyDTO.
     */
    @PostMapping("/save/{wordId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserVocabularyDTO> saveWordById(@PathVariable Long wordId) {
        LOG.debug("REST request to save word by ID: {}", wordId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        UserVocabularyDTO result = userVocabularyService.saveWord(wordId, userLogin);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code DELETE  /user-vocabularies/unsave/:wordId} : Remove a word (alternative endpoint).
     *
     * @param wordId the word ID
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/unsave/{wordId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unsaveWordById(@PathVariable Long wordId) {
        LOG.debug("REST request to unsave word by ID: {}", wordId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        userVocabularyService.unsaveWord(wordId, userLogin);
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code GET  /user-vocabularies/statistics} : Get vocabulary statistics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the statistics in body.
     */
    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VocabularyStatisticsDTO> getStatistics() {
        LOG.debug("REST request to get vocabulary statistics");
        VocabularyStatisticsDTO stats = userVocabularyService.getStatistics();
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /user-vocabularies/is-saved/:wordId} : Check if user has saved this word.
     * Use case 21: Interact with vocabulary
     *
     * @param wordId the word ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and true/false in body.
     */
    @GetMapping("/is-saved/{wordId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isSaved(@PathVariable Long wordId) {
        LOG.debug("REST request to check if word is saved: {}", wordId);
        boolean saved = userVocabularyService.isSaved(wordId);
        return ResponseEntity.ok().body(saved);
    }

    /**
     * {@code GET  /user-vocabularies/my-words/progress} : Get learning progress statistics by difficulty.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and progress data in body.
     */
    @GetMapping("/my-words/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LearningProgressDTO> getLearningProgress() {
        LOG.debug("REST request to get learning progress");
        LearningProgressDTO progress = userVocabularyService.getLearningProgress();
        return ResponseEntity.ok().body(progress);
    }

    /**
     * {@code POST  /user-vocabularies/batch-save} : Save multiple words at once.
     * Use case 21: Interact with vocabulary
     *
     * @param wordIds list of word IDs
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PostMapping("/batch-save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> batchSaveWords(@RequestBody List<Long> wordIds) {
        LOG.debug("REST request to batch save words: {}", wordIds);

        try {
            String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
                new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
            );

            userVocabularyService.batchSaveWords(wordIds, userLogin);
            return ResponseEntity.ok().build();
        } catch (BadRequestAlertException e) {
            throw e;
        } catch (Exception e) {
            LOG.error("Error batch saving words: {}", e.getMessage(), e);
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "batchsavefailed");
        }
    }

    /**
     * {@code GET  /user-vocabularies/count} : Get count of saved words for current user.
     * Use case: Dashboard statistics
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and count in body.
     */
    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> countMyVocabulary() {
        LOG.debug("REST request to count my vocabulary");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        Long count = userVocabularyService.countByUserLogin(userLogin);
        return ResponseEntity.ok().body(count);
    }
}
