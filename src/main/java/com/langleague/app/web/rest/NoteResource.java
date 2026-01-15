package com.langleague.app.web.rest;

import com.langleague.app.repository.NoteRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.service.NoteService;
import com.langleague.app.service.dto.NoteDTO;
import com.langleague.app.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.langleague.app.domain.Note}.
 * UC-57 to UC-60: Student note-taking functionality.
 * Only STUDENT role can create, read, update, and delete their own notes.
 */
@RestController
@RequestMapping("/api/notes")
public class NoteResource {

    private static final Logger LOG = LoggerFactory.getLogger(NoteResource.class);

    private static final String ENTITY_NAME = "note";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NoteService noteService;

    private final NoteRepository noteRepository;

    public NoteResource(NoteService noteService, NoteRepository noteRepository) {
        this.noteService = noteService;
        this.noteRepository = noteRepository;
    }

    /**
     * {@code POST  /notes} : Create a new note.
     * Only students can create notes for their own learning.
     *
     * @param noteDTO the noteDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new noteDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<NoteDTO> createNote(@Valid @RequestBody NoteDTO noteDTO) throws URISyntaxException {
        LOG.debug("REST request to save Note : {}", noteDTO);
        if (noteDTO.getId() != null) {
            throw new BadRequestAlertException("A new note cannot already have an ID", ENTITY_NAME, "idexists");
        }
        noteDTO = noteService.save(noteDTO);
        return ResponseEntity.created(new URI("/api/notes/" + noteDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, noteDTO.getId().toString()))
            .body(noteDTO);
    }

    /**
     * {@code PUT  /notes/:id} : Updates an existing note.
     * Only students can update their own notes.
     *
     * @param id the id of the noteDTO to save.
     * @param noteDTO the noteDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated noteDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<NoteDTO> updateNote(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody NoteDTO noteDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Note : {}, {}", id, noteDTO);
        if (noteDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, noteDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!noteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        noteDTO = noteService.update(noteDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, noteDTO.getId().toString()))
            .body(noteDTO);
    }

    /**
     * {@code PATCH  /notes/:id} : Partial updates given fields of an existing note.
     * Only students can update their own notes.
     *
     * @param id the id of the noteDTO to save.
     * @param noteDTO the noteDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated noteDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<NoteDTO> partialUpdateNote(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody NoteDTO noteDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Note partially : {}, {}", id, noteDTO);
        if (noteDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, noteDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!noteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NoteDTO> result = noteService.partialUpdate(noteDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, noteDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /notes} : get all the notes.
     * Students can only see their own notes, filtered by unitId if provided.
     *
     * @param pageable the pagination information.
     * @param unitId the unit id to filter by (optional).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notes in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<List<NoteDTO>> getAllNotes(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "unitId.equals", required = false) Long unitId
    ) {
        LOG.debug("REST request to get a page of Notes for current user, unitId: {}", unitId);
        Page<NoteDTO> page;
        if (unitId != null) {
            page = noteService.findAllByCurrentUserAndUnit(unitId, pageable);
        } else {
            page = noteService.findAllByCurrentUser(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /notes/:id} : get the "id" note.
     * Students can only view their own notes.
     *
     * @param id the id of the noteDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the noteDTO.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<NoteDTO> getNote(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Note : {}", id);
        Optional<NoteDTO> noteDTO = noteService.findOne(id);
        return ResponseUtil.wrapOrNotFound(noteDTO);
    }

    /**
     * {@code DELETE  /notes/:id} : delete the "id" note.
     * Only students can delete their own notes.
     *
     * @param id the id of the noteDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<Void> deleteNote(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Note : {}", id);
        noteService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /notes/check-unit/:unitId} : Check if current user has a note for the unit.
     *
     * @param unitId the unit id to check.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and boolean in body.
     */
    @GetMapping("/check-unit/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<Boolean> hasNoteForUnit(@PathVariable("unitId") Long unitId) {
        LOG.debug("REST request to check if current user has note for unit : {}", unitId);
        boolean hasNote = noteService.hasNoteForUnit(unitId);
        return ResponseEntity.ok(hasNote);
    }

    /**
     * {@code GET  /notes/by-unit/:unitId} : Get the note for current user and unit.
     *
     * @param unitId the unit id.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the noteDTO, or 404 if not found.
     */
    @GetMapping("/by-unit/{unitId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.STUDENT + "')")
    public ResponseEntity<NoteDTO> getNoteByUnit(@PathVariable("unitId") Long unitId) {
        LOG.debug("REST request to get Note for current user and unit : {}", unitId);
        Optional<NoteDTO> noteDTO = noteService.findNoteByCurrentUserAndUnit(unitId);
        return ResponseUtil.wrapOrNotFound(noteDTO);
    }
}
