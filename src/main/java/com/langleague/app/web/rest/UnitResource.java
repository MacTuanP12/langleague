package com.langleague.app.web.rest;

import com.langleague.app.domain.Book;
import com.langleague.app.domain.Unit;
import com.langleague.app.repository.BookRepository;
import com.langleague.app.repository.UnitRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.UnitService;
import com.langleague.app.service.dto.UnitDTO;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.app.domain.Unit}.
 */
@RestController
@RequestMapping("/api/units")
@Transactional
public class UnitResource {

    private static final Logger LOG = LoggerFactory.getLogger(UnitResource.class);

    private static final String ENTITY_NAME = "unit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnitService unitService;

    private final UnitRepository unitRepository;

    private final BookRepository bookRepository;

    public UnitResource(UnitService unitService, UnitRepository unitRepository, BookRepository bookRepository) {
        this.unitService = unitService;
        this.unitRepository = unitRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * {@code POST  /units} : Create a new unit.
     *
     * @param unitDTO the unitDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new unitDTO, or with status {@code 400 (Bad Request)} if the unit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<UnitDTO> createUnit(@Valid @RequestBody UnitDTO unitDTO) throws URISyntaxException {
        LOG.debug("REST request to save Unit : {}", unitDTO);
        if (unitDTO.getId() != null) {
            throw new BadRequestAlertException("A new unit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (unitDTO.getBookId() == null) {
            throw new BadRequestAlertException("A new unit must belong to a book", ENTITY_NAME, "booknull");
        }
        Book book = bookRepository
            .findById(unitDTO.getBookId())
            .orElseThrow(() -> new BadRequestAlertException("Book not found", ENTITY_NAME, "booknotfound"));
        SecurityUtils.checkOwnership(book);

        unitDTO = unitService.save(unitDTO);
        return ResponseEntity.created(new URI("/api/units/" + unitDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, unitDTO.getId().toString()))
            .body(unitDTO);
    }

    /**
     * {@code PUT  /units/:id} : Updates an existing unit.
     *
     * @param id the id of the unitDTO to save.
     * @param unitDTO the unitDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unitDTO,
     * or with status {@code 400 (Bad Request)} if the unitDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the unitDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<UnitDTO> updateUnit(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UnitDTO unitDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Unit : {}, {}", id, unitDTO);
        if (unitDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unitDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        // Single findById call instead of existsById + findById (Performance fix)
        Unit unit = unitRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(unit.getBook());

        unitDTO = unitService.update(unitDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unitDTO.getId().toString()))
            .body(unitDTO);
    }

    /**
     * {@code PATCH  /units/:id} : Partial updates given fields of an existing unit, field will ignore if it is null
     *
     * @param id the id of the unitDTO to save.
     * @param unitDTO the unitDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unitDTO,
     * or with status {@code 400 (Bad Request)} if the unitDTO is not valid,
     * or with status {@code 404 (Not Found)} if the unitDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the unitDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<UnitDTO> partialUpdateUnit(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UnitDTO unitDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Unit partially : {}, {}", id, unitDTO);
        if (unitDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unitDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        // Single findById call instead of existsById + findById (Performance fix)
        Unit unit = unitRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(unit.getBook());

        Optional<UnitDTO> result = unitService.partialUpdate(unitDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unitDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /units} : get all the units.
     * This endpoint is generally not used - units are fetched by book.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of units in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<List<UnitDTO>> getAllUnits(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Units");
        Page<UnitDTO> page = unitService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /units/by-book/:bookId} : get all the units by bookId.
     * Students and Teachers can view units.
     *
     * @param bookId the id of the book.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of units in body.
     */
    @GetMapping("/by-book/{bookId}")
    @PreAuthorize("permitAll()")
    public List<UnitDTO> getAllUnitsByBook(@PathVariable Long bookId) {
        LOG.debug("REST request to get all Utilities by bookId : {}", bookId);
        return unitService.findAllByBookId(bookId);
    }

    /**
     * {@code GET  /units/:id} : get the "id" unit.
     *
     * @param id the id of the unitDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the unitDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UnitDTO> getUnit(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Unit : {}", id);
        Optional<UnitDTO> unitDTO = unitService.findOne(id);
        return ResponseUtil.wrapOrNotFound(unitDTO);
    }

    /**
     * {@code DELETE  /units/:id} : delete the "id" unit.
     *
     * @param id the id of the unitDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<Void> deleteUnit(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Unit : {}", id);

        Unit unit = unitRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        SecurityUtils.checkOwnership(unit.getBook());

        unitService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
