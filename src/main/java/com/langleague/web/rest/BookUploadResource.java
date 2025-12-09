package com.langleague.web.rest;

import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.BookUploadService;
import com.langleague.service.dto.BookMetadataDTO;
import com.langleague.service.dto.BookUploadDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;

/**
 * REST controller for book upload by staff
 */
@Tag(name = "Book Upload (Staff)", description = "Staff uploads books and processes with chatbot")
@RestController
@RequestMapping("/api/staff/book-uploads")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.STAFF + "\") or hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class BookUploadResource {

    private static final Logger LOG = LoggerFactory.getLogger(BookUploadResource.class);
    private static final String ENTITY_NAME = "bookUpload";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookUploadService bookUploadService;

    public BookUploadResource(BookUploadService bookUploadService) {
        this.bookUploadService = bookUploadService;
    }

    /**
     * POST /api/staff/book-uploads : Upload a book file (AI mode - default)
     *
     * @param file the file to upload
     * @return the ResponseEntity with status 201 (Created) and the upload details
     */
    @PostMapping
    public ResponseEntity<BookUploadDTO> uploadBook(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload book file: {}", file.getOriginalFilename());

        try {
            BookUploadDTO result = bookUploadService.initiateUpload(file);
            return ResponseEntity.status(HttpStatus.CREATED)
                .headers(HeaderUtil.createAlert(applicationName, "Book upload initiated successfully", ENTITY_NAME))
                .body(result);
        } catch (Exception e) {
            LOG.error("Error uploading book: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "uploadfailed", e.getMessage()))
                .build();
        }
    }

    /**
     * POST /api/staff/book-uploads/manual : Upload a book with manual metadata (no AI)
     *
     * @param file the file to upload
     * @param title book title
     * @param level book level
     * @param description book description
     * @param thumbnailUrl book thumbnail URL
     * @return the ResponseEntity with status 201 (Created) and the upload details
     */
    @PostMapping("/manual")
    public ResponseEntity<BookUploadDTO> uploadBookManual(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam("level") String level,
        @RequestParam(value = "description", required = false) String description,
        @RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl
    ) {
        LOG.debug("REST request to upload book file manually: {}", file.getOriginalFilename());

        try {
            // Create metadata DTO
            BookMetadataDTO metadata = new BookMetadataDTO();
            metadata.setTitle(title);
            metadata.setLevel(com.langleague.domain.enumeration.Level.valueOf(level.toUpperCase()));
            metadata.setDescription(description);
            metadata.setThumbnailUrl(thumbnailUrl);

            // Upload with manual metadata (no AI)
            BookUploadDTO result = bookUploadService.initiateUpload(file, metadata, false);

            return ResponseEntity.status(HttpStatus.CREATED)
                .headers(HeaderUtil.createAlert(applicationName, "Book created successfully from manual input", ENTITY_NAME))
                .body(result);
        } catch (Exception e) {
            LOG.error("Error uploading book manually: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "uploadfailed", e.getMessage()))
                .build();
        }
    }

    /**
     * GET /api/staff/book-uploads : Get all uploads for current staff
     *
     * @return the ResponseEntity with status 200 (OK) and list of uploads
     */
    @GetMapping
    public ResponseEntity<List<BookUploadDTO>> getMyUploads() {
        LOG.debug("REST request to get my book uploads");
        List<BookUploadDTO> uploads = bookUploadService.getMyUploads();
        return ResponseEntity.ok(uploads);
    }

    /**
     * GET /api/staff/book-uploads/:id : Get upload by ID
     *
     * @param id the ID of the upload
     * @return the ResponseEntity with status 200 (OK) and the upload details
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookUploadDTO> getUpload(@PathVariable Long id) {
        LOG.debug("REST request to get BookUpload : {}", id);
        return bookUploadService.getUploadById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/staff/book-uploads/:id/retry : Retry failed upload
     *
     * @param id the ID of the upload to retry
     * @return the ResponseEntity with status 200 (OK)
     */
    @PostMapping("/{id}/retry")
    public ResponseEntity<Void> retryUpload(@PathVariable Long id) {
        LOG.debug("REST request to retry BookUpload : {}", id);

        try {
            bookUploadService.retryUpload(id);
            return ResponseEntity.ok().headers(HeaderUtil.createAlert(applicationName, "Upload queued for retry", ENTITY_NAME)).build();
        } catch (Exception e) {
            LOG.error("Error retrying upload: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "retryfailed", e.getMessage()))
                .build();
        }
    }
}
