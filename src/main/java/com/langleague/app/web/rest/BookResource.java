package com.langleague.app.web.rest;

import com.langleague.app.repository.BookRepository;
import com.langleague.app.service.BookService;
import com.langleague.app.service.UnitService;
import com.langleague.app.service.dto.BookDTO;
import com.langleague.app.service.dto.UnitDTO;
import com.langleague.app.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
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
 * REST controller for managing {@link com.langleague.app.domain.Book}.
 */
@RestController
@RequestMapping("/api/books")
public class BookResource {

    private static final Logger LOG = LoggerFactory.getLogger(BookResource.class);

    private static final String ENTITY_NAME = "book";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookService bookService;

    private final BookRepository bookRepository;

    private final UnitService unitService;

    public BookResource(BookService bookService, BookRepository bookRepository, UnitService unitService) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
        this.unitService = unitService;
    }

    /**
     * {@code POST  /books} : Create a new book.
     *
     * @param bookDTO the bookDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookDTO, or with status {@code 400 (Bad Request)} if the book has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
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
     *
     * @param id the id of the bookDTO to save.
     * @param bookDTO the bookDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookDTO,
     * or with status {@code 400 (Bad Request)} if the bookDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
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
     *
     * @param id the id of the bookDTO to save.
     * @param bookDTO the bookDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookDTO,
     * or with status {@code 400 (Bad Request)} if the bookDTO is not valid,
     * or with status {@code 404 (Not Found)} if the bookDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
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
     * @param filter the filter to apply (enrolled, not-enrolled).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("")
    public ResponseEntity<List<BookDTO>> getAllBooks(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        LOG.debug("REST request to get a page of Books");
        Page<BookDTO> page;
        if (filter != null) {
            page = bookService.findAll(filter, pageable);
        } else {
            page = bookService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/public} : get all public books.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("/public")
    public ResponseEntity<List<BookDTO>> getAllPublicBooks(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Public Books");
        Page<BookDTO> page = bookService.findAllPublic(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /books/my-books} : get all books created by the current teacher.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of books in body.
     */
    @GetMapping("/my-books")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<List<BookDTO>> getMyBooks(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of My Books");
        Page<BookDTO> page = bookService.findAllMyBooks(pageable);
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
    public ResponseEntity<BookDTO> getBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Book : {}", id);
        Optional<BookDTO> bookDTO = bookService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bookDTO);
    }

    /**
     * {@code GET  /books/:id/units} : get all units for the "id" book.
     *
     * @param id the id of the book.
     * @return the list of units.
     */
    @GetMapping("/{id}/units")
    public List<UnitDTO> getBookUnits(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Units for Book : {}", id);
        return unitService.findAllByBookId(id);
    }

    /**
     * {@code PUT  /books/:id/units/reorder} : Reorder units for the "id" book.
     *
     * @param id the id of the book.
     * @param request the request containing unitIds in new order.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/{id}/units/reorder")
    public ResponseEntity<Void> reorderUnits(@PathVariable("id") Long id, @RequestBody Map<String, List<Long>> request) {
        LOG.debug("REST request to reorder Units for Book : {}", id);
        List<Long> unitIds = request.get("unitIds");
        if (unitIds != null && !unitIds.isEmpty()) {
            unitService.reorderUnits(id, unitIds);
        }
        return ResponseEntity.ok().build();
    }

    /**
     * {@code DELETE  /books/:id} : delete the "id" book.
     *
     * @param id the id of the bookDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Book : {}", id);
        bookService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
