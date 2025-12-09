package com.langleague.web.rest;

import com.langleague.repository.ChapterRepository;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.ChapterService;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.dto.ChapterDetailDTO;
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
 * REST controller for managing {@link com.langleague.domain.Chapter}.
 * Use case 16: View assigned lessons
 * Use case 17: View lesson details
 * Use case 18: Search lessons
 * Use case 43: Create lesson (Staff/Admin)
 */
@Tag(name = "Chapters", description = "Lesson/Chapter management")
@RestController
@RequestMapping("/api/chapters")
public class ChapterResource {

    private static final Logger LOG = LoggerFactory.getLogger(ChapterResource.class);

    private static final String ENTITY_NAME = "chapter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChapterService chapterService;

    private final ChapterRepository chapterRepository;

    public ChapterResource(ChapterService chapterService, ChapterRepository chapterRepository) {
        this.chapterService = chapterService;
        this.chapterRepository = chapterRepository;
    }

    /**
     * {@code POST  /chapters} : Create a new chapter.
     * Use case 43: Create lesson (Staff/Admin only)
     *
     * @param chapterDTO the chapterDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chapterDTO, or with status {@code 400 (Bad Request)} if the chapter has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PostMapping("")
    public ResponseEntity<ChapterDTO> createChapter(@Valid @RequestBody ChapterDTO chapterDTO) throws URISyntaxException {
        LOG.debug("REST request to save Chapter : {}", chapterDTO);
        if (chapterDTO.getId() != null) {
            throw new BadRequestAlertException("A new chapter cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Validate that order index is not duplicated for the same book
        if (chapterDTO.getBook() != null && chapterDTO.getOrderIndex() != null) {
            if (chapterService.existsByBookIdAndOrderIndex(chapterDTO.getBook().getId(), chapterDTO.getOrderIndex())) {
                throw new BadRequestAlertException(
                    "A chapter with this order index already exists for this book",
                    ENTITY_NAME,
                    "orderindexexists"
                );
            }
        }

        chapterDTO = chapterService.save(chapterDTO);
        return ResponseEntity.created(new URI("/api/chapters/" + chapterDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, chapterDTO.getId().toString()))
            .body(chapterDTO);
    }

    /**
     * {@code PUT  /chapters/:id} : Updates an existing chapter.
     * Use case 43: Create lesson (Staff/Admin only)
     *
     * @param id the id of the chapterDTO to save.
     * @param chapterDTO the chapterDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookDTO,
     * or with status {@code 400 (Bad Request)} if the chapterDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chapterDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PutMapping("/{id}")
    public ResponseEntity<ChapterDTO> updateChapter(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChapterDTO chapterDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Chapter : {}, {}", id, chapterDTO);
        if (chapterDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chapterDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chapterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        chapterDTO = chapterService.update(chapterDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chapterDTO.getId().toString()))
            .body(chapterDTO);
    }

    /**
     * {@code PATCH  /chapters/:id} : Partial updates given fields of an existing chapter, field will ignore if it is null
     * Use case 43: Create lesson (Staff/Admin only)
     *
     * @param id the id of the chapterDTO to save.
     * @param chapterDTO the chapterDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chapterDTO,
     * or with status {@code 400 (Bad Request)} if the chapterDTO is not valid,
     * or with status {@code 404 (Not Found)} if the chapterDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the chapterDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChapterDTO> partialUpdateChapter(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChapterDTO chapterDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Chapter partially : {}, {}", id, chapterDTO);
        if (chapterDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chapterDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chapterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChapterDTO> result = chapterService.partialUpdate(chapterDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chapterDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /chapters} : get all the chapters.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chapters in body.
     */
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChapterDTO>> getAllChapters(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Chapters");
        Page<ChapterDTO> page = chapterService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chapters/:id} : get the "id" chapter.
     *
     * @param id the id of the chapterDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chapterDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChapterDTO> getChapter(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Chapter : {}", id);
        Optional<ChapterDTO> chapterDTO = chapterService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chapterDTO);
    }

    /**
     * {@code DELETE  /chapters/:id} : delete the "id" chapter.
     * Use case 43: Create lesson (Staff/Admin only)
     *
     * @param id the id of the chapterDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Chapter : {}", id);
        chapterService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /chapters/book/:bookId} : get all chapters for a specific book.
     * Use case 16: View assigned lessons
     *
     * @param bookId the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chapters in body.
     */
    @GetMapping("/book/{bookId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChapterDTO>> getChaptersByBook(@PathVariable("bookId") Long bookId) {
        LOG.debug("REST request to get Chapters by book id : {}", bookId);
        List<ChapterDTO> chapters = chapterService.findByBookId(bookId);
        return ResponseEntity.ok().body(chapters);
    }

    /**
     * {@code GET  /chapters/:id/details} : get chapter with all details (exercises, words, grammar).
     * Use case 17: View lesson details
     *
     * @param id the id of the chapter.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chapterDetailDTO with details, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}/details")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChapterDetailDTO> getChapterWithDetails(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Chapter with details : {}", id);
        Optional<ChapterDetailDTO> chapterDetailDTO = chapterService.findOneWithDetails(id);
        return ResponseUtil.wrapOrNotFound(chapterDetailDTO);
    }

    /**
     * {@code GET  /chapters/:id/words} : get all words for a specific chapter.
     * This is an alias for /words/chapter/:chapterId for frontend compatibility
     *
     * @param id the id of the chapter.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("/{id}/words")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<java.util.List<com.langleague.service.dto.WordDTO>> getChapterWords(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Words for Chapter : {}", id);
        try {
            java.util.List<com.langleague.service.dto.WordDTO> words = chapterService.findWordsByChapterId(id);
            return ResponseEntity.ok().body(words);
        } catch (Exception e) {
            LOG.error("Error getting words for chapter {}: {}", id, e.getMessage());
            return ResponseEntity.ok().body(java.util.Collections.emptyList());
        }
    }

    /**
     * {@code GET  /chapters/search} : search chapters by keyword.
     * Use case 18: Search lessons
     *
     * @param keyword the search keyword.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matching chapters in body.
     */
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChapterDTO>> searchChapters(
        @RequestParam(required = false) String keyword,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to search Chapters with keyword : {}", keyword);
        Page<ChapterDTO> page = chapterService.searchChapters(keyword, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chapters/count/book/:bookId} : get the count of chapters for a specific book.
     *
     * @param bookId the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count/book/{bookId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> countChaptersByBook(@PathVariable("bookId") Long bookId) {
        LOG.debug("REST request to count Chapters by book id : {}", bookId);
        long count = chapterService.countByBookId(bookId);
        return ResponseEntity.ok().body(count);
    }

    /**
     * {@code PUT  /chapters/reorder} : Reorder chapters for a book.
     * Use case 43: Create lesson (Staff/Admin only)
     *
     * @param chapterDTOs the list of chapters with updated order indices.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chapters.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PutMapping("/reorder")
    public ResponseEntity<List<ChapterDTO>> reorderChapters(@Valid @RequestBody List<ChapterDTO> chapterDTOs) {
        LOG.debug("REST request to reorder {} Chapters", chapterDTOs.size());
        List<ChapterDTO> updatedChapters = chapterService.reorderChapters(chapterDTOs);
        return ResponseEntity.ok().body(updatedChapters);
    }

    /**
     * {@code GET  /chapters/:id/next} : get the next chapter in sequence.
     *
     * @param id the id of the current chapter.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the next chapterDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}/next")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChapterDTO> getNextChapter(@PathVariable("id") Long id) {
        LOG.debug("REST request to get next Chapter after chapter id : {}", id);
        Optional<ChapterDTO> nextChapter = chapterService.findNextChapter(id);
        return ResponseUtil.wrapOrNotFound(nextChapter);
    }

    /**
     * {@code GET  /chapters/:id/previous} : get the previous chapter in sequence.
     *
     * @param id the id of the current chapter.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the previous chapterDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}/previous")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChapterDTO> getPreviousChapter(@PathVariable("id") Long id) {
        LOG.debug("REST request to get previous Chapter before chapter id : {}", id);
        Optional<ChapterDTO> previousChapter = chapterService.findPreviousChapter(id);
        return ResponseUtil.wrapOrNotFound(previousChapter);
    }
}
