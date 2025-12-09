package com.langleague.web.rest;

import com.langleague.repository.UserGrammarRepository;
import com.langleague.service.UserGrammarService;
import com.langleague.service.dto.GrammarStatisticsDTO;
import com.langleague.service.dto.UserGrammarDTO;
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
 * REST controller for managing {@link com.langleague.domain.UserGrammar}.
 */
@RestController
@RequestMapping("/api/user-grammars")
public class UserGrammarResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserGrammarResource.class);

    private static final String ENTITY_NAME = "userGrammar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserGrammarService userGrammarService;

    private final UserGrammarRepository userGrammarRepository;

    public UserGrammarResource(UserGrammarService userGrammarService, UserGrammarRepository userGrammarRepository) {
        this.userGrammarService = userGrammarService;
        this.userGrammarRepository = userGrammarRepository;
    }

    /**
     * {@code POST  /user-grammars} : Create a new userGrammar.
     *
     * @param userGrammarDTO the userGrammarDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userGrammarDTO, or with status {@code 400 (Bad Request)} if the userGrammar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserGrammarDTO> createUserGrammar(@Valid @RequestBody UserGrammarDTO userGrammarDTO) throws URISyntaxException {
        LOG.debug("REST request to save UserGrammar : {}", userGrammarDTO);
        if (userGrammarDTO.getId() != null) {
            throw new BadRequestAlertException("A new userGrammar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userGrammarDTO = userGrammarService.save(userGrammarDTO);
        return ResponseEntity.created(new URI("/api/user-grammars/" + userGrammarDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userGrammarDTO.getId().toString()))
            .body(userGrammarDTO);
    }

    /**
     * {@code PUT  /user-grammars/:id} : Updates an existing userGrammar.
     *
     * @param id the id of the userGrammarDTO to save.
     * @param userGrammarDTO the userGrammarDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGrammarDTO,
     * or with status {@code 400 (Bad Request)} if the userGrammarDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userGrammarDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserGrammarDTO> updateUserGrammar(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserGrammarDTO userGrammarDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update UserGrammar : {}, {}", id, userGrammarDTO);
        if (userGrammarDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGrammarDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGrammarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        userGrammarDTO = userGrammarService.update(userGrammarDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGrammarDTO.getId().toString()))
            .body(userGrammarDTO);
    }

    /**
     * {@code PATCH  /user-grammars/:id} : Partial updates given fields of an existing userGrammar, field will ignore if it is null
     *
     * @param id the id of the userGrammarDTO to save.
     * @param userGrammarDTO the userGrammarDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGrammarDTO,
     * or with status {@code 400 (Bad Request)} if the userGrammarDTO is not valid,
     * or with status {@code 404 (Not Found)} if the userGrammarDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the userGrammarDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserGrammarDTO> partialUpdateUserGrammar(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserGrammarDTO userGrammarDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update UserGrammar partially : {}, {}", id, userGrammarDTO);
        if (userGrammarDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGrammarDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGrammarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserGrammarDTO> result = userGrammarService.partialUpdate(userGrammarDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGrammarDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /user-grammars} : get all the userGrammars.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userGrammars in body.
     */
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserGrammarDTO>> getAllUserGrammars(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of UserGrammars");
        Page<UserGrammarDTO> page = userGrammarService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-grammars/:id} : get the "id" userGrammar.
     *
     * @param id the id of the userGrammarDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userGrammarDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserGrammarDTO> getUserGrammar(@PathVariable("id") Long id) {
        LOG.debug("REST request to get UserGrammar : {}", id);
        Optional<UserGrammarDTO> userGrammarDTO = userGrammarService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userGrammarDTO);
    }

    /**
     * {@code DELETE  /user-grammars/:id} : delete the "id" userGrammar.
     *
     * @param id the id of the userGrammarDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUserGrammar(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete UserGrammar : {}", id);
        userGrammarService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /user-grammars/save/:grammarId} : Save a grammar to flashcard.
     *
     * @param grammarId the grammar ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the saved userGrammarDTO.
     */
    @PostMapping("/save/{grammarId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserGrammarDTO> saveGrammar(@PathVariable Long grammarId) {
        LOG.debug("REST request to save grammar: {}", grammarId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        UserGrammarDTO result = userGrammarService.saveGrammar(grammarId, userLogin);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /user-grammars/my-grammars} : Get all saved grammars for current user.
     *
     * @param pageable pagination info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("/my-grammars")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserGrammarDTO>> getSavedGrammars(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get saved grammars for current user");
        Page<UserGrammarDTO> page = userGrammarService.getSavedGrammars(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-grammars/my-grammars/memorized} : Get memorized grammars for current user.
     *
     * @param isMemorized memorization status
     * @param pageable pagination info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("/my-grammars/memorized")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserGrammarDTO>> getMemorizedGrammars(
        @RequestParam(defaultValue = "true") Boolean isMemorized,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get memorized grammars");
        Page<UserGrammarDTO> page = userGrammarService.getMemorizedGrammars(isMemorized, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-grammars/my-grammars/review} : Get grammars that need review.
     *
     * @param pageable pagination info
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grammars in body.
     */
    @GetMapping("/my-grammars/review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserGrammarDTO>> getGrammarsToReview(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get grammars to review");
        Page<UserGrammarDTO> page = userGrammarService.getGrammarsToReview(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code PUT  /user-grammars/review/:grammarId} : Update review result for grammar.
     *
     * @param grammarId the grammar ID
     * @param isMemorized whether user memorized it
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/review/{grammarId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateReviewResult(@PathVariable Long grammarId, @RequestParam Boolean isMemorized) {
        LOG.debug("REST request to update review result for grammar: {} with status: {}", grammarId, isMemorized);
        userGrammarService.updateReviewResult(grammarId, isMemorized);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code DELETE  /user-grammars/unsave/:grammarId} : Remove a grammar from saved list.
     *
     * @param grammarId the grammar ID
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/unsave/{grammarId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unsaveGrammar(@PathVariable Long grammarId) {
        LOG.debug("REST request to unsave grammar: {}", grammarId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        userGrammarService.unsaveGrammar(grammarId, userLogin);
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code GET  /user-grammars/is-saved/:grammarId} : Check if user has saved this grammar.
     *
     * @param grammarId the grammar ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and true/false in body.
     */
    @GetMapping("/is-saved/{grammarId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isSaved(@PathVariable Long grammarId) {
        LOG.debug("REST request to check if grammar is saved: {}", grammarId);
        boolean saved = userGrammarService.isSaved(grammarId);
        return ResponseEntity.ok().body(saved);
    }

    /**
     * {@code GET  /user-grammars/statistics} : Get grammar statistics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the statistics in body.
     */
    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GrammarStatisticsDTO> getStatistics() {
        LOG.debug("REST request to get grammar statistics");
        GrammarStatisticsDTO stats = userGrammarService.getStatistics();
        return ResponseEntity.ok().body(stats);
    }
}
