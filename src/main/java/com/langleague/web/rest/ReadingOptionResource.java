package com.langleague.web.rest;

import com.langleague.repository.ReadingOptionRepository;
import com.langleague.service.ReadingOptionService;
import com.langleague.service.dto.ReadingOptionDTO;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.langleague.domain.ReadingOption}.
 */
@RestController
@RequestMapping("/api/reading-options")
public class ReadingOptionResource {

    private static final Logger LOG = LoggerFactory.getLogger(ReadingOptionResource.class);

    private static final String ENTITY_NAME = "readingOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReadingOptionService readingOptionService;

    private final ReadingOptionRepository readingOptionRepository;

    public ReadingOptionResource(ReadingOptionService readingOptionService, ReadingOptionRepository readingOptionRepository) {
        this.readingOptionService = readingOptionService;
        this.readingOptionRepository = readingOptionRepository;
    }

    /**
     * {@code POST  /reading-options} : Create a new readingOption.
     *
     * @param readingOptionDTO the readingOptionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new readingOptionDTO, or with status {@code 400 (Bad Request)} if the readingOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReadingOptionDTO> createReadingOption(@Valid @RequestBody ReadingOptionDTO readingOptionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ReadingOption : {}", readingOptionDTO);
        if (readingOptionDTO.getId() != null) {
            throw new BadRequestAlertException("A new readingOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        readingOptionDTO = readingOptionService.save(readingOptionDTO);
        return ResponseEntity.created(new URI("/api/reading-options/" + readingOptionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, readingOptionDTO.getId().toString()))
            .body(readingOptionDTO);
    }

    /**
     * {@code PUT  /reading-options/:id} : Updates an existing readingOption.
     *
     * @param id the id of the readingOptionDTO to save.
     * @param readingOptionDTO the readingOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated readingOptionDTO,
     * or with status {@code 400 (Bad Request)} if the readingOptionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the readingOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReadingOptionDTO> updateReadingOption(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ReadingOptionDTO readingOptionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ReadingOption : {}, {}", id, readingOptionDTO);
        if (readingOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, readingOptionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!readingOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        readingOptionDTO = readingOptionService.update(readingOptionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, readingOptionDTO.getId().toString()))
            .body(readingOptionDTO);
    }

    /**
     * {@code PATCH  /reading-options/:id} : Partial updates given fields of an existing readingOption, field will ignore if it is null
     *
     * @param id the id of the readingOptionDTO to save.
     * @param readingOptionDTO the readingOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated readingOptionDTO,
     * or with status {@code 400 (Bad Request)} if the readingOptionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the readingOptionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the readingOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReadingOptionDTO> partialUpdateReadingOption(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ReadingOptionDTO readingOptionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ReadingOption partially : {}, {}", id, readingOptionDTO);
        if (readingOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, readingOptionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!readingOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReadingOptionDTO> result = readingOptionService.partialUpdate(readingOptionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, readingOptionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reading-options} : get all the readingOptions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of readingOptions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ReadingOptionDTO>> getAllReadingOptions(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of ReadingOptions");
        Page<ReadingOptionDTO> page = readingOptionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reading-options/:id} : get the "id" readingOption.
     *
     * @param id the id of the readingOptionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the readingOptionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReadingOptionDTO> getReadingOption(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ReadingOption : {}", id);
        Optional<ReadingOptionDTO> readingOptionDTO = readingOptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(readingOptionDTO);
    }

    /**
     * {@code DELETE  /reading-options/:id} : delete the "id" readingOption.
     *
     * @param id the id of the readingOptionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReadingOption(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ReadingOption : {}", id);
        readingOptionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
