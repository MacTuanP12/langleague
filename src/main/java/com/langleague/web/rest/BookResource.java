package com.langleague.web.rest;

import com.langleague.repository.BookRepository;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.BookService;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.dto.ChapterDTO;
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
 * REST controller for managing {@link com.langleague.domain.Book}.
 * Use case 4: View homepage (public books)
 * Use case 16: View assigned lessons
 * Use case 18: Search lessons
 * Use case 27: Get lesson recommendation
 * Use case 43: Create lesson (Staff/Admin)
 * Use case 44: Categorize lessons (Staff/Admin)
 * Use case 49: Manage book sets/grades (Staff/Admin)
 * Use case 62: Upload/update textbook content (Staff/Admin)
 */
@Tag(name = "Books", description = "Textbook and course management")
@RestController
@RequestMapping("/api/books")
public class BookResource {

    private static final Logger LOG = LoggerFactory.getLogger(BookResource.class);

    private static final String ENTITY_NAME = "book";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookService bookService;

    private final BookRepository bookRepository;

    public BookResource(BookService bookService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
    }

    /**
     * {@code POST  /books} : Create a new book.
     * Use case 43: Create lesson (Staff/Admin only)
     *
     * @param bookDTO the bookDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookDTO, or with status {@code 400 (Bad Request)} if the book has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PostMapping("")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody BookDTO bookDTO) throws URISyntaxException {
        LOG.debug("REST request to save Book : {}", bookDTO);
        if (bookDTO.getId() != null) {
            throw new BadRequestAlertException("A new book cannot already have an ID", ENTITY_NAME, "idexists");
        }
        bookDTO = bookService.save(bookDTO);
        return ResponseEntity.created(new URI("/api/books/" + bookDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bookDTO.getId().toString()))
            .body(bookDTO);
    }

    /**
     * {@code PUT  /books/:id} : Updates an existing book.
     * Use case 62: Upload/update textbook content (Staff/Admin only)
     *
     * @param id the id of the bookDTO to save.
     * @param bookDTO the bookDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookDTO,
     * or with status {@code 400 (Bad Request)} if the bookDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BookDTO bookDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Book : {}, {}", id, bookDTO);
        if (bookDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        bookDTO = bookService.update(bookDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookDTO.getId().toString()))
            .body(bookDTO);
    }

    /**
     * {@code PATCH  /books/:id} : Partial updates given fields of an existing book, field will ignore if it is null
     * Use case 62: Upload/update textbook content (Staff/Admin only)
     *
     * @param id the id of the bookDTO to save.
     * @param bookDTO the bookDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookDTO,
     * or with status {@code 400 (Bad Request)} if the bookDTO is not valid,
     * or with status {@code 404 (Not Found)} if the bookDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BookDTO> partialUpdateBook(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BookDTO bookDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Book partially : {}, {}", id, bookDTO);
        if (bookDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BookDTO> result = bookService.partialUpdate(bookDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /books} : get all the books.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookDTO>> getAllBooks(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Books");
        Page<BookDTO> page = bookService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/active} : get all active books.
     * Use case 4: View homepage (public books)
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of active books in body.
     */
    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookDTO>> getActiveBooks(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of active Books");
        Page<BookDTO> page = bookService.findAllActive(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/inactive} : get all inactive books for admin review (ADMIN ONLY).
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inactive books in body.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @GetMapping("/inactive")
    public ResponseEntity<List<BookDTO>> getInactiveBooks(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get inactive Books for admin review");
        Page<BookDTO> page = bookService.findInactive(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/:id} : get the "id" book.
     *
     * @param id the id of the bookDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookDTO> getBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Book : {}", id);
        Optional<BookDTO> bookDTO = bookService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bookDTO);
    }

    /**
     * {@code GET  /books/:id/details} : get the "id" book with complete details.
     * Use case 16: View assigned lessons with complete details
     *
     * @param id the id of the book to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookDetailDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}/details")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<com.langleague.service.dto.BookDetailDTO> getBookDetails(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Book details : {}", id);
        Optional<com.langleague.service.dto.BookDetailDTO> bookDetailDTO = bookService.findOneWithDetails(id);
        return ResponseUtil.wrapOrNotFound(bookDetailDTO);
    }

    /**
     * {@code DELETE  /books/:id} : delete the "id" book.
     * Use case 49: Manage book sets/grades (Staff/Admin only)
     *
     * @param id the id of the bookDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Book : {}", id);
        bookService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code PUT  /books/:id/restore} : restore a soft-deleted book (Staff/Admin only).
     * Use case: Restore accidentally deleted books
     *
     * @param id the id of the book to restore.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the restored bookDTO.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @PutMapping("/{id}/restore")
    public ResponseEntity<BookDTO> restoreBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to restore Book : {}", id);
        try {
            BookDTO result = bookService.restore(id);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "bookManagement.restored", id.toString()))
                .body(result);
        } catch (IllegalStateException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "alreadyactive");
        }
    }

    /**
     * {@code DELETE  /books/:id/hard} : permanently delete the "id" book (ADMIN ONLY).
     * WARNING: This permanently deletes the book and all related data.
     *
     * @param id the id of the bookDTO to delete.
     * @param force if true, delete even if there are chapters/reviews
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDeleteBook(
        @PathVariable("id") Long id,
        @RequestParam(required = false, defaultValue = "false") boolean force
    ) {
        LOG.debug("REST request to hard delete Book : {} (force={})", id, force);
        try {
            bookService.hardDelete(id, force);
            return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
        } catch (IllegalStateException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "hasreferences");
        }
    }

    /**
     * {@code GET  /books/search} : search books by keyword.
     * Use case 18: Search lessons
     *
     * @param keyword the search keyword.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matching books in body.
     */
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookDTO>> searchBooks(
        @RequestParam(required = false) String keyword,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to search Books with keyword : {}", keyword);
        Page<BookDTO> page = bookService.searchBooks(keyword, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/level/:level} : get books by level.
     * Use case 27: Get lesson recommendation
     *
     * @param level the book level.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("/level/{level}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookDTO>> getBooksByLevel(@PathVariable("level") String level) {
        LOG.debug("REST request to get Books by level : {}", level);
        List<BookDTO> books = bookService.findByLevel(level);
        return ResponseEntity.ok().body(books);
    }

    /**
     * {@code GET  /books/by-level/:level} : get books by level (alternative endpoint for frontend compatibility).
     * Use case 27: Get lesson recommendation
     *
     * @param level the book level.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("/by-level/{level}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookDTO>> getBooksByLevelAlt(@PathVariable("level") String level) {
        LOG.debug("REST request to get Books by level (alt endpoint) : {}", level);
        List<BookDTO> books = bookService.findByLevel(level);
        return ResponseEntity.ok().body(books);
    }

    /**
     * {@code GET  /books/:id/chapters} : get all chapters for a book.
     * Use case 16: View assigned lessons
     *
     * @param id the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chapters in body.
     */
    @GetMapping("/{id}/chapters")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChapterDTO>> getBookChapters(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Chapters for Book : {}", id);
        List<ChapterDTO> chapters = bookService.findChaptersByBookId(id);
        return ResponseEntity.ok().body(chapters);
    }

    /**
     * {@code GET  /books/check-title} : check if book title exists.
     * Use case: Prevent duplicate book titles
     *
     * @param title the book title to check.
     * @param excludeId optional book ID to exclude from check (for updates).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and boolean in body.
     */
    @GetMapping("/check-title")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> checkBookTitle(@RequestParam String title, @RequestParam(required = false) Long excludeId) {
        LOG.debug("REST request to check if Book title exists : {}", title);
        boolean exists;
        if (excludeId != null) {
            exists = bookService.existsByTitleAndIdNot(title, excludeId);
        } else {
            exists = bookService.existsByTitle(title);
        }
        return ResponseEntity.ok().body(exists);
    }

    /**
     * {@code GET  /books/statistics/count-by-level} : get book count by level.
     * Use case: Statistics and analytics (Staff/Admin only)
     *
     * @param level the book level.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and count in body.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @GetMapping("/statistics/count-by-level")
    public ResponseEntity<Long> countBooksByLevel(@RequestParam String level) {
        LOG.debug("REST request to count Books by level : {}", level);
        try {
            com.langleague.domain.enumeration.Level levelEnum = com.langleague.domain.enumeration.Level.valueOf(level.toUpperCase());
            long count = bookService.countByLevel(levelEnum);
            return ResponseEntity.ok().body(count);
        } catch (IllegalArgumentException e) {
            throw new BadRequestAlertException("Invalid level value", ENTITY_NAME, "invalidlevel");
        }
    }

    /**
     * {@code GET  /books/recommendations} : get book recommendations by multiple levels.
     * Use case 27: Advanced lesson recommendation
     *
     * @param levels comma-separated list of levels.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("/recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookDTO>> getBookRecommendations(@RequestParam String levels) {
        LOG.debug("REST request to get Book recommendations for levels : {}", levels);
        try {
            String[] levelArray = levels.split(",");
            List<com.langleague.domain.enumeration.Level> levelEnums = new java.util.ArrayList<>();
            for (String level : levelArray) {
                levelEnums.add(com.langleague.domain.enumeration.Level.valueOf(level.trim().toUpperCase()));
            }
            List<BookDTO> books = bookService.findByLevels(levelEnums);
            return ResponseEntity.ok().body(books);
        } catch (IllegalArgumentException e) {
            throw new BadRequestAlertException("Invalid level value", ENTITY_NAME, "invalidlevel");
        }
    }

    /**
     * {@code PUT  /books/:id/approve} : approve and activate a book (ADMIN ONLY).
     *
     * @param id the id of the book to approve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the approved bookDTO.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookDTO> approveBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to approve Book : {}", id);
        BookDTO result = bookService.approve(id);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert(applicationName, "bookManagement.approved", id.toString())).body(result);
    }

    /**
     * {@code PUT  /books/:id/reject} : reject and deactivate a book (ADMIN ONLY).
     *
     * @param id the id of the book to reject.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to reject Book : {}", id);
        bookService.reject(id);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert(applicationName, "bookManagement.rejected", id.toString())).build();
    }
}
