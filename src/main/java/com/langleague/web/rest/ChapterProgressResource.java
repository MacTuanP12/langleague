package com.langleague.web.rest;

import com.langleague.repository.ChapterProgressRepository;
import com.langleague.service.ChapterProgressService;
import com.langleague.service.dto.ChapterProgressDTO;
import com.langleague.service.dto.MyChapterDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.langleague.domain.ChapterProgress}.
 */
@RestController
@RequestMapping("/api/chapter-progresses")
@PreAuthorize("isAuthenticated()")
public class ChapterProgressResource {

    private static final Logger LOG = LoggerFactory.getLogger(ChapterProgressResource.class);

    private static final String ENTITY_NAME = "chapterProgress";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChapterProgressService chapterProgressService;

    private final ChapterProgressRepository chapterProgressRepository;

    public ChapterProgressResource(ChapterProgressService chapterProgressService, ChapterProgressRepository chapterProgressRepository) {
        this.chapterProgressService = chapterProgressService;
        this.chapterProgressRepository = chapterProgressRepository;
    }

    /**
     * {@code POST  /chapter-progresses} : Create a new chapterProgress.
     *
     * @param chapterProgressDTO the chapterProgressDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chapterProgressDTO, or with status {@code 400 (Bad Request)} if the chapterProgress has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ChapterProgressDTO> createChapterProgress(@Valid @RequestBody ChapterProgressDTO chapterProgressDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ChapterProgress : {}", chapterProgressDTO);
        if (chapterProgressDTO.getId() != null) {
            throw new BadRequestAlertException("A new chapterProgress cannot already have an ID", ENTITY_NAME, "idexists");
        }
        chapterProgressDTO = chapterProgressService.save(chapterProgressDTO);
        return ResponseEntity.created(new URI("/api/chapter-progresses/" + chapterProgressDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, chapterProgressDTO.getId().toString()))
            .body(chapterProgressDTO);
    }

    /**
     * {@code PUT  /chapter-progresses/:id} : Updates an existing chapterProgress.
     *
     * @param id the id of the chapterProgressDTO to save.
     * @param chapterProgressDTO the chapterProgressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chapterProgressDTO,
     * or with status {@code 400 (Bad Request)} if the chapterProgressDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chapterProgressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ChapterProgressDTO> updateChapterProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChapterProgressDTO chapterProgressDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ChapterProgress : {}, {}", id, chapterProgressDTO);
        if (chapterProgressDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chapterProgressDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chapterProgressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        chapterProgressDTO = chapterProgressService.update(chapterProgressDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chapterProgressDTO.getId().toString()))
            .body(chapterProgressDTO);
    }

    /**
     * {@code PATCH  /chapter-progresses/:id} : Partial updates given fields of an existing chapterProgress, field will ignore if it is null
     *
     * @param id the id of the chapterProgressDTO to save.
     * @param chapterProgressDTO the chapterProgressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chapterProgressDTO,
     * or with status {@code 400 (Bad Request)} if the chapterProgressDTO is not valid,
     * or with status {@code 404 (Not Found)} if the chapterProgressDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the chapterProgressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChapterProgressDTO> partialUpdateChapterProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChapterProgressDTO chapterProgressDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ChapterProgress partially : {}, {}", id, chapterProgressDTO);
        if (chapterProgressDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chapterProgressDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chapterProgressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChapterProgressDTO> result = chapterProgressService.partialUpdate(chapterProgressDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chapterProgressDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /chapter-progresses} : get all the chapterProgresses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chapterProgresses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ChapterProgressDTO>> getAllChapterProgresses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of ChapterProgresses");
        Page<ChapterProgressDTO> page = chapterProgressService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chapter-progresses/:id} : get the "id" chapterProgress.
     *
     * @param id the id of the chapterProgressDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chapterProgressDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChapterProgressDTO> getChapterProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ChapterProgress : {}", id);
        Optional<ChapterProgressDTO> chapterProgressDTO = chapterProgressService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chapterProgressDTO);
    }

    /**
     * {@code DELETE  /chapter-progresses/:id} : delete the "id" chapterProgress.
     *
     * @param id the id of the chapterProgress to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapterProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ChapterProgress : {}", id);
        chapterProgressService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /chapter-progresses/chapter/:chapterId/complete} : Mark a chapter as completed.
     * Use case 24: Mark lesson as completed
     *
     * @param chapterId the id of the chapter to mark as completed.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PostMapping("/chapter/{chapterId}/complete")
    public ResponseEntity<Void> markChapterComplete(@PathVariable("chapterId") Long chapterId) {
        LOG.debug("REST request to mark Chapter as completed : {}", chapterId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );
        chapterProgressService.markAsCompleted(chapterId, userLogin);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code PUT  /chapter-progresses/chapter/:chapterId/progress} : Update progress for a chapter.
     * Use case 25: Save progress
     *
     * @param chapterId the id of the chapter.
     * @param percent the completion percentage (0-100).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/chapter/{chapterId}/progress")
    public ResponseEntity<Void> updateChapterProgress(@PathVariable("chapterId") Long chapterId, @RequestParam("percent") Integer percent) {
        LOG.debug("REST request to update progress for Chapter {} to {}%", chapterId, percent);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        if (percent < 0 || percent > 100) {
            throw new BadRequestAlertException("Percent must be between 0 and 100", ENTITY_NAME, "invalidpercent");
        }

        chapterProgressService.updateProgress(chapterId, userLogin, percent);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code GET  /chapter-progresses/book/:bookId} : Get all progress for chapters in a book.
     * Use case 26: View learning progress
     *
     * @param bookId the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of progress in body.
     */
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ChapterProgressDTO>> getProgressByBook(@PathVariable("bookId") Long bookId) {
        LOG.debug("REST request to get progress for book : {}", bookId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<ChapterProgressDTO> progress = chapterProgressService.getProgressByBook(bookId, userLogin);
        return ResponseEntity.ok().body(progress);
    }

    /**
     * {@code GET  /chapter-progresses/book/:bookId/completion} : Get overall completion percentage for a book.
     * Use case 26: View learning progress
     *
     * @param bookId the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and completion percentage in body.
     */
    @GetMapping("/book/{bookId}/completion")
    public ResponseEntity<Double> getBookCompletion(@PathVariable("bookId") Long bookId) {
        LOG.debug("REST request to get completion for book : {}", bookId);
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        Double completion = chapterProgressService.getBookCompletionPercentage(bookId, userLogin);
        return ResponseEntity.ok().body(completion);
    }

    /**
     * {@code GET  /chapter-progresses/my-chapters} : Get all chapters that the user has saved and is learning.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chapters with progress in body.
     */
    @GetMapping("/my-chapters")
    public ResponseEntity<List<MyChapterDTO>> getMyChapters() {
        LOG.debug("REST request to get my chapters");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<MyChapterDTO> chapters = chapterProgressService.getMyChapters(userLogin);
        return ResponseEntity.ok().body(chapters);
    }

    /**
     * {@code GET  /chapter-progresses/my-chapters/in-progress} : Get chapters that the user is currently learning.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of in-progress chapters in body.
     */
    @GetMapping("/my-chapters/in-progress")
    public ResponseEntity<List<MyChapterDTO>> getMyInProgressChapters() {
        LOG.debug("REST request to get my in-progress chapters");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<MyChapterDTO> chapters = chapterProgressService.getMyInProgressChapters(userLogin);
        return ResponseEntity.ok().body(chapters);
    }

    /**
     * {@code GET  /chapter-progresses/my-chapters/completed} : Get chapters that the user has completed.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of completed chapters in body.
     */
    @GetMapping("/my-chapters/completed")
    public ResponseEntity<List<MyChapterDTO>> getMyCompletedChapters() {
        LOG.debug("REST request to get my completed chapters");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        List<MyChapterDTO> chapters = chapterProgressService.getMyCompletedChapters(userLogin);
        return ResponseEntity.ok().body(chapters);
    }
}
