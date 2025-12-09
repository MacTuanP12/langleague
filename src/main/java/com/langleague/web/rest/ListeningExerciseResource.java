package com.langleague.web.rest;

import com.langleague.repository.ListeningExerciseRepository;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.ListeningExerciseService;
import com.langleague.service.dto.ListeningExerciseDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link com.langleague.domain.ListeningExercise}.
 * Use case 23: Do quizzes/games
 * Use case 45: Attach quizzes/games (Staff/Admin)
 */
@Tag(name = "Exercises - Listening", description = "Listening exercises and comprehension")
@RestController
@RequestMapping("/api/listening-exercises")
public class ListeningExerciseResource {

    private static final Logger LOG = LoggerFactory.getLogger(ListeningExerciseResource.class);

    private static final String ENTITY_NAME = "listeningExercise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ListeningExerciseService listeningExerciseService;

    private final ListeningExerciseRepository listeningExerciseRepository;

    public ListeningExerciseResource(
        ListeningExerciseService listeningExerciseService,
        ListeningExerciseRepository listeningExerciseRepository
    ) {
        this.listeningExerciseService = listeningExerciseService;
        this.listeningExerciseRepository = listeningExerciseRepository;
    }

    /**
     * {@code POST  /listening-exercises} : Create a new listeningExercise.
     * Use case 45: Attach quizzes/games (Staff/Admin only)
     *
     * @param listeningExerciseDTO the listeningExerciseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new listeningExerciseDTO, or with status {@code 400 (Bad Request)} if the listeningExercise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PostMapping("")
    public ResponseEntity<ListeningExerciseDTO> createListeningExercise(@Valid @RequestBody ListeningExerciseDTO listeningExerciseDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ListeningExercise : {}", listeningExerciseDTO);
        if (listeningExerciseDTO.getId() != null) {
            throw new BadRequestAlertException("A new listeningExercise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        listeningExerciseDTO = listeningExerciseService.save(listeningExerciseDTO);
        return ResponseEntity.created(new URI("/api/listening-exercises/" + listeningExerciseDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, listeningExerciseDTO.getId().toString()))
            .body(listeningExerciseDTO);
    }

    /**
     * {@code PUT  /listening-exercises/:id} : Updates an existing listeningExercise.
     *
     * @param id the id of the listeningExerciseDTO to save.
     * @param listeningExerciseDTO the listeningExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listeningExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the listeningExerciseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the listeningExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ListeningExerciseDTO> updateListeningExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ListeningExerciseDTO listeningExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ListeningExercise : {}, {}", id, listeningExerciseDTO);
        if (listeningExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listeningExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listeningExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        listeningExerciseDTO = listeningExerciseService.update(listeningExerciseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, listeningExerciseDTO.getId().toString()))
            .body(listeningExerciseDTO);
    }

    /**
     * {@code PATCH  /listening-exercises/:id} : Partial updates given fields of an existing listeningExercise, field will ignore if it is null
     *
     * @param id the id of the listeningExerciseDTO to save.
     * @param listeningExerciseDTO the listeningExerciseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listeningExerciseDTO,
     * or with status {@code 400 (Bad Request)} if the listeningExerciseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the listeningExerciseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the listeningExerciseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ListeningExerciseDTO> partialUpdateListeningExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ListeningExerciseDTO listeningExerciseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ListeningExercise partially : {}, {}", id, listeningExerciseDTO);
        if (listeningExerciseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listeningExerciseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listeningExerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ListeningExerciseDTO> result = listeningExerciseService.partialUpdate(listeningExerciseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, listeningExerciseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /listening-exercises} : get all the listeningExercises.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of listeningExercises in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ListeningExerciseDTO>> getAllListeningExercises(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of ListeningExercises");
        Page<ListeningExerciseDTO> page = listeningExerciseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /listening-exercises/:id} : get the "id" listeningExercise.
     *
     * @param id the id of the listeningExerciseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the listeningExerciseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListeningExerciseDTO> getListeningExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ListeningExercise : {}", id);
        Optional<ListeningExerciseDTO> listeningExerciseDTO = listeningExerciseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(listeningExerciseDTO);
    }

    /**
     * {@code DELETE  /listening-exercises/:id} : delete the "id" listeningExercise.
     *
     * @param id the id of the listeningExerciseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListeningExercise(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ListeningExercise : {}", id);
        listeningExerciseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /listening-exercises/chapter/:chapterId} : get all listening exercises for a specific chapter.
     * Use case 23: Do quizzes/games
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exercises in body.
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<ListeningExerciseDTO>> getListeningExercisesByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get listening exercises by chapter : {}", chapterId);
        List<ListeningExerciseDTO> exercises = listeningExerciseService.findByChapterId(chapterId);
        return ResponseEntity.ok().body(exercises);
    }
}
