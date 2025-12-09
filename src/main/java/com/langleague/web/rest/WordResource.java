package com.langleague.web.rest;

import com.langleague.repository.WordRepository;
import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.WordService;
import com.langleague.service.dto.WordDTO;
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
 * REST controller for managing {@link com.langleague.domain.Word}.
 */
@RestController
@RequestMapping("/api/words")
public class WordResource {

    private static final Logger LOG = LoggerFactory.getLogger(WordResource.class);

    private static final String ENTITY_NAME = "word";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WordService wordService;

    private final WordRepository wordRepository;

    public WordResource(WordService wordService, WordRepository wordRepository) {
        this.wordService = wordService;
        this.wordRepository = wordRepository;
    }

    /**
     * {@code POST  /words} : Create a new word.
     *
     * @param wordDTO the wordDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new wordDTO, or with status {@code 400 (Bad Request)} if the word has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<WordDTO> createWord(@Valid @RequestBody WordDTO wordDTO) throws URISyntaxException {
        LOG.debug("REST request to save Word : {}", wordDTO);
        if (wordDTO.getId() != null) {
            throw new BadRequestAlertException("A new word cannot already have an ID", ENTITY_NAME, "idexists");
        }
        wordDTO = wordService.save(wordDTO);
        return ResponseEntity.created(new URI("/api/words/" + wordDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, wordDTO.getId().toString()))
            .body(wordDTO);
    }

    /**
     * {@code PUT  /words/:id} : Updates an existing word.
     *
     * @param id the id of the wordDTO to save.
     * @param wordDTO the wordDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wordDTO,
     * or with status {@code 400 (Bad Request)} if the wordDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the wordDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<WordDTO> updateWord(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody WordDTO wordDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Word : {}, {}", id, wordDTO);
        if (wordDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, wordDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!wordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        wordDTO = wordService.update(wordDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wordDTO.getId().toString()))
            .body(wordDTO);
    }

    /**
     * {@code PATCH  /words/:id} : Partial updates given fields of an existing word, field will ignore if it is null
     *
     * @param id the id of the wordDTO to save.
     * @param wordDTO the wordDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated wordDTO,
     * or with status {@code 400 (Bad Request)} if the wordDTO is not valid,
     * or with status {@code 404 (Not Found)} if the wordDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the wordDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WordDTO> partialUpdateWord(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody WordDTO wordDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Word partially : {}, {}", id, wordDTO);
        if (wordDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, wordDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!wordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WordDTO> result = wordService.partialUpdate(wordDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, wordDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /words} : get all the words.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WordDTO>> getAllWords(
        @org.springframework.data.web.PageableDefault(
            size = 50,
            sort = "id"
        ) @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of Words");
        Page<WordDTO> page = wordService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /words/:id} : get the "id" word.
     *
     * @param id the id of the wordDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the wordDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WordDTO> getWord(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Word : {}", id);
        Optional<WordDTO> wordDTO = wordService.findOne(id);
        return ResponseUtil.wrapOrNotFound(wordDTO);
    }

    /**
     * {@code DELETE  /words/:id} : delete the "id" word.
     *
     * @param id the id of the wordDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Word : {}", id);
        wordService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /words/chapter/:chapterId} : get all words for a specific chapter.
     *
     * @param chapterId the chapter ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("/chapter/{chapterId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WordDTO>> getWordsByChapter(@PathVariable Long chapterId) {
        LOG.debug("REST request to get words by chapter : {}", chapterId);
        List<WordDTO> words = wordService.findByChapterId(chapterId);
        return ResponseEntity.ok().body(words);
    }
}
