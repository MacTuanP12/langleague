package com.langleague.web.rest;

import com.langleague.repository.BookReviewRepository;
import com.langleague.service.BookReviewService;
import com.langleague.service.dto.BookReviewDTO;
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
 * REST controller for managing {@link com.langleague.domain.BookReview}.
 */
@RestController
@RequestMapping("/api/book-reviews")
@PreAuthorize("isAuthenticated()")
public class BookReviewResource {

    private static final Logger LOG = LoggerFactory.getLogger(BookReviewResource.class);

    private static final String ENTITY_NAME = "bookReview";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookReviewService bookReviewService;

    private final BookReviewRepository bookReviewRepository;

    public BookReviewResource(BookReviewService bookReviewService, BookReviewRepository bookReviewRepository) {
        this.bookReviewService = bookReviewService;
        this.bookReviewRepository = bookReviewRepository;
    }

    /**
     * {@code POST  /book-reviews} : Create a new bookReview.
     *
     * @param bookReviewDTO the bookReviewDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookReviewDTO, or with status {@code 400 (Bad Request)} if the bookReview has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<BookReviewDTO> createBookReview(@Valid @RequestBody BookReviewDTO bookReviewDTO) throws URISyntaxException {
        LOG.debug("REST request to save BookReview : {}", bookReviewDTO);
        if (bookReviewDTO.getId() != null) {
            throw new BadRequestAlertException("A new bookReview cannot already have an ID", ENTITY_NAME, "idexists");
        }
        bookReviewDTO = bookReviewService.save(bookReviewDTO);
        return ResponseEntity.created(new URI("/api/book-reviews/" + bookReviewDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bookReviewDTO.getId().toString()))
            .body(bookReviewDTO);
    }

    /**
     * {@code PUT  /book-reviews/:id} : Updates an existing bookReview.
     *
     * @param id the id of the bookReviewDTO to save.
     * @param bookReviewDTO the bookReviewDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookReviewDTO,
     * or with status {@code 400 (Bad Request)} if the bookReviewDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookReviewDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookReviewDTO> updateBookReview(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BookReviewDTO bookReviewDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update BookReview : {}, {}", id, bookReviewDTO);
        if (bookReviewDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookReviewDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookReviewRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        bookReviewDTO = bookReviewService.update(bookReviewDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookReviewDTO.getId().toString()))
            .body(bookReviewDTO);
    }

    /**
     * {@code PATCH  /book-reviews/:id} : Partial updates given fields of an existing bookReview, field will ignore if it is null
     *
     * @param id the id of the bookReviewDTO to save.
     * @param bookReviewDTO the bookReviewDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookReviewDTO,
     * or with status {@code 400 (Bad Request)} if the bookReviewDTO is not valid,
     * or with status {@code 404 (Not Found)} if the bookReviewDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookReviewDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BookReviewDTO> partialUpdateBookReview(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BookReviewDTO bookReviewDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update BookReview partially : {}, {}", id, bookReviewDTO);
        if (bookReviewDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookReviewDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookReviewRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BookReviewDTO> result = bookReviewService.partialUpdate(bookReviewDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookReviewDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /book-reviews} : get all the bookReviews.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookReviews in body.
     */
    @GetMapping("")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<BookReviewDTO>> getAllBookReviews(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of BookReviews");
        Page<BookReviewDTO> page = bookReviewService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /book-reviews/:id} : get the "id" bookReview.
     *
     * @param id the id of the bookReviewDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookReviewDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookReviewDTO> getBookReview(@PathVariable("id") Long id) {
        LOG.debug("REST request to get BookReview : {}", id);
        Optional<BookReviewDTO> bookReviewDTO = bookReviewService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bookReviewDTO);
    }

    /**
     * {@code DELETE  /book-reviews/:id} : delete the "id" bookReview.
     *
     * @param id the id of the bookReviewDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookReview(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete BookReview : {}", id);
        bookReviewService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /book-reviews/rate} : Rate a book or update existing rating.
     * Use case 37: Like/Rate lesson
     *
     * @param bookId the id of the book to rate.
     * @param rating the rating (1-5).
     * @param content optional review content.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookReviewDTO.
     */
    @PostMapping("/rate")
    public ResponseEntity<BookReviewDTO> rateBook(
        @RequestParam("bookId") Long bookId,
        @RequestParam("rating") Integer rating,
        @RequestParam(value = "content", required = false) String content
    ) {
        LOG.debug("REST request to rate book {} with rating {}", bookId, rating);

        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        if (rating < 1 || rating > 5) {
            throw new BadRequestAlertException("Rating must be between 1 and 5", ENTITY_NAME, "invalidrating");
        }

        BookReviewDTO reviewDTO = bookReviewService.rateBook(bookId, userLogin, rating, content);
        return ResponseEntity.ok().body(reviewDTO);
    }

    /**
     * {@code GET  /book-reviews/book/:bookId/average} : Get average rating for a book.
     * Use case 37: Like/Rate lesson
     *
     * @param bookId the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and average rating in body.
     */
    @GetMapping("/book/{bookId}/average")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Double> getAverageRating(@PathVariable("bookId") Long bookId) {
        LOG.debug("REST request to get average rating for book : {}", bookId);
        Double averageRating = bookReviewService.getAverageRating(bookId);
        return ResponseEntity.ok().body(averageRating);
    }

    /**
     * {@code GET  /book-reviews/book/:bookId} : Get all reviews for a book.
     * Use case 37: Like/Rate lesson
     *
     * @param bookId the id of the book.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reviews in body.
     */
    @GetMapping("/book/{bookId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<BookReviewDTO>> getReviewsByBook(
        @PathVariable("bookId") Long bookId,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get reviews for book : {}", bookId);
        Page<BookReviewDTO> page = bookReviewService.getReviewsByBook(bookId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
