package com.langleague.web.rest;

import com.langleague.repository.UserAchievementRepository;
import com.langleague.service.UserAchievementService;
import com.langleague.service.dto.UserAchievementDTO;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.UserAchievement}.
 */
@RestController
@RequestMapping("/api/user-achievements")
public class UserAchievementResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserAchievementResource.class);

    private static final String ENTITY_NAME = "userAchievement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserAchievementService userAchievementService;

    private final UserAchievementRepository userAchievementRepository;

    public UserAchievementResource(UserAchievementService userAchievementService, UserAchievementRepository userAchievementRepository) {
        this.userAchievementService = userAchievementService;
        this.userAchievementRepository = userAchievementRepository;
    }

    /**
     * {@code POST  /user-achievements} : Create a new userAchievement.
     *
     * @param userAchievementDTO the userAchievementDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userAchievementDTO, or with status {@code 400 (Bad Request)} if the userAchievement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<UserAchievementDTO> createUserAchievement(@Valid @RequestBody UserAchievementDTO userAchievementDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save UserAchievement : {}", userAchievementDTO);
        if (userAchievementDTO.getId() != null) {
            throw new BadRequestAlertException("A new userAchievement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userAchievementDTO = userAchievementService.save(userAchievementDTO);
        return ResponseEntity.created(new URI("/api/user-achievements/" + userAchievementDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userAchievementDTO.getId().toString()))
            .body(userAchievementDTO);
    }

    /**
     * {@code PUT  /user-achievements/:id} : Updates an existing userAchievement.
     *
     * @param id the id of the userAchievementDTO to save.
     * @param userAchievementDTO the userAchievementDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userAchievementDTO,
     * or with status {@code 400 (Bad Request)} if the userAchievementDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userAchievementDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserAchievementDTO> updateUserAchievement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserAchievementDTO userAchievementDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update UserAchievement : {}, {}", id, userAchievementDTO);
        if (userAchievementDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userAchievementDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userAchievementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        userAchievementDTO = userAchievementService.update(userAchievementDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userAchievementDTO.getId().toString()))
            .body(userAchievementDTO);
    }

    /**
     * {@code PATCH  /user-achievements/:id} : Partial updates given fields of an existing userAchievement, field will ignore if it is null
     *
     * @param id the id of the userAchievementDTO to save.
     * @param userAchievementDTO the userAchievementDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userAchievementDTO,
     * or with status {@code 400 (Bad Request)} if the userAchievementDTO is not valid,
     * or with status {@code 404 (Not Found)} if the userAchievementDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the userAchievementDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserAchievementDTO> partialUpdateUserAchievement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserAchievementDTO userAchievementDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update UserAchievement partially : {}, {}", id, userAchievementDTO);
        if (userAchievementDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userAchievementDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userAchievementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserAchievementDTO> result = userAchievementService.partialUpdate(userAchievementDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userAchievementDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /user-achievements} : get all the userAchievements.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userAchievements in body.
     */
    @GetMapping("")
    public ResponseEntity<List<UserAchievementDTO>> getAllUserAchievements(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of UserAchievements");
        Page<UserAchievementDTO> page = userAchievementService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-achievements/:id} : get the "id" userAchievement.
     *
     * @param id the id of the userAchievementDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userAchievementDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserAchievementDTO> getUserAchievement(@PathVariable("id") Long id) {
        LOG.debug("REST request to get UserAchievement : {}", id);
        Optional<UserAchievementDTO> userAchievementDTO = userAchievementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userAchievementDTO);
    }

    /**
     * {@code DELETE  /user-achievements/:id} : delete the "id" userAchievement.
     *
     * @param id the id of the userAchievementDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAchievement(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete UserAchievement : {}", id);
        userAchievementService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /user-achievements/user/:userId} : get all achievements for a user.
     *
     * @param userId the user ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of achievements in body.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAchievementDTO>> getUserAchievementsByUserId(@PathVariable Long userId) {
        LOG.debug("REST request to get achievements for user : {}", userId);
        List<UserAchievementDTO> achievements = userAchievementService.findByUserId(userId);
        return ResponseEntity.ok().body(achievements);
    }

    /**
     * {@code GET  /user-achievements/user/:userId/count} : count achievements for a user.
     *
     * @param userId the user ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countUserAchievements(@PathVariable Long userId) {
        LOG.debug("REST request to count achievements for user : {}", userId);
        long count = userAchievementService.countByUserId(userId);
        return ResponseEntity.ok().body(count);
    }

    /**
     * {@code GET  /user-achievements/check/:userId/:achievementId} : check if user has achievement.
     *
     * @param userId the user ID
     * @param achievementId the achievement ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and boolean in body.
     */
    @GetMapping("/check/{userId}/{achievementId}")
    public ResponseEntity<Boolean> checkUserHasAchievement(@PathVariable Long userId, @PathVariable Long achievementId) {
        LOG.debug("REST request to check if user {} has achievement {}", userId, achievementId);
        boolean hasAchievement = userAchievementService.hasAchievement(userId, achievementId);
        return ResponseEntity.ok().body(hasAchievement);
    }
}
