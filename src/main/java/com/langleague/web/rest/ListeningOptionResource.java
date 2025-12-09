package com.langleague.web.rest;

import com.langleague.repository.ListeningOptionRepository;
import com.langleague.service.ListeningOptionService;
import com.langleague.service.dto.ListeningOptionDTO;
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
 * REST controller for managing {@link com.langleague.domain.ListeningOption}.
 */
@RestController
@RequestMapping("/api/listening-options")
public class ListeningOptionResource {

    private static final Logger LOG = LoggerFactory.getLogger(ListeningOptionResource.class);

    private static final String ENTITY_NAME = "listeningOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ListeningOptionService listeningOptionService;

    private final ListeningOptionRepository listeningOptionRepository;

    public ListeningOptionResource(ListeningOptionService listeningOptionService, ListeningOptionRepository listeningOptionRepository) {
        this.listeningOptionService = listeningOptionService;
        this.listeningOptionRepository = listeningOptionRepository;
    }

    /**
     * {@code POST  /listening-options} : Create a new listeningOption.
     *
     * @param listeningOptionDTO the listeningOptionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new listeningOptionDTO, or with status {@code 400 (Bad Request)} if the listeningOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ListeningOptionDTO> createListeningOption(@Valid @RequestBody ListeningOptionDTO listeningOptionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ListeningOption : {}", listeningOptionDTO);
        if (listeningOptionDTO.getId() != null) {
            throw new BadRequestAlertException("A new listeningOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        listeningOptionDTO = listeningOptionService.save(listeningOptionDTO);
        return ResponseEntity.created(new URI("/api/listening-options/" + listeningOptionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, listeningOptionDTO.getId().toString()))
            .body(listeningOptionDTO);
    }

    /**
     * {@code PUT  /listening-options/:id} : Updates an existing listeningOption.
     *
     * @param id the id of the listeningOptionDTO to save.
     * @param listeningOptionDTO the listeningOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listeningOptionDTO,
     * or with status {@code 400 (Bad Request)} if the listeningOptionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the listeningOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ListeningOptionDTO> updateListeningOption(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ListeningOptionDTO listeningOptionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ListeningOption : {}, {}", id, listeningOptionDTO);
        if (listeningOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listeningOptionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listeningOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        listeningOptionDTO = listeningOptionService.update(listeningOptionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, listeningOptionDTO.getId().toString()))
            .body(listeningOptionDTO);
    }

    /**
     * {@code PATCH  /listening-options/:id} : Partial updates given fields of an existing listeningOption, field will ignore if it is null
     *
     * @param id the id of the listeningOptionDTO to save.
     * @param listeningOptionDTO the listeningOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listeningOptionDTO,
     * or with status {@code 400 (Bad Request)} if the listeningOptionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the listeningOptionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the listeningOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ListeningOptionDTO> partialUpdateListeningOption(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ListeningOptionDTO listeningOptionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ListeningOption partially : {}, {}", id, listeningOptionDTO);
        if (listeningOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listeningOptionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listeningOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ListeningOptionDTO> result = listeningOptionService.partialUpdate(listeningOptionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, listeningOptionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /listening-options} : get all the listeningOptions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of listeningOptions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ListeningOptionDTO>> getAllListeningOptions(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of ListeningOptions");
        Page<ListeningOptionDTO> page = listeningOptionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /listening-options/:id} : get the "id" listeningOption.
     *
     * @param id the id of the listeningOptionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the listeningOptionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListeningOptionDTO> getListeningOption(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ListeningOption : {}", id);
        Optional<ListeningOptionDTO> listeningOptionDTO = listeningOptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(listeningOptionDTO);
    }

    /**
     * {@code DELETE  /listening-options/:id} : delete the "id" listeningOption.
     *
     * @param id the id of the listeningOptionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListeningOption(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ListeningOption : {}", id);
        listeningOptionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
