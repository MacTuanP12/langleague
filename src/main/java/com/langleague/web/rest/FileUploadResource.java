package com.langleague.web.rest;

import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.FileStorageService;
import com.langleague.web.rest.errors.BadRequestAlertException;
import com.langleague.web.rest.vm.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller for file upload and download operations.
 * Supports: avatars, audio files, images, documents
 * Use cases: UC 13 (Change avatar), UC 62 (Upload content)
 */
@Tag(name = "File Upload", description = "File upload and download management")
@RestController
@RequestMapping("/api/files")
public class FileUploadResource {

    private static final Logger LOG = LoggerFactory.getLogger(FileUploadResource.class);

    private static final String ENTITY_NAME = "fileUpload";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileStorageService fileStorageService;

    public FileUploadResource(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * {@code POST  /files/upload/avatar} : Upload user avatar.
     * Use case 13: Change avatar
     *
     * @param file the avatar file to upload (max 5MB, jpg/png only).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and file URL in body.
     */
    @PostMapping("/upload/avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload avatar file: {}", file.getOriginalFilename());

        try {
            // Validate file
            validateImageFile(file, 5 * 1024 * 1024); // 5MB max

            // Get current user
            String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
                new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
            );

            // Store file
            String fileName = fileStorageService.storeFile(file, "avatars", userLogin);
            String fileUrl = "/api/files/download/avatars/" + fileName;

            Map<String, String> result = new HashMap<>();
            result.put("fileName", fileName);
            result.put("fileUrl", fileUrl);
            result.put("fileType", file.getContentType());
            result.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(ApiResponse.success(result, "Avatar uploaded successfully"));
        } catch (Exception e) {
            LOG.error("Error uploading avatar: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload avatar: " + e.getMessage(), "UPLOAD_FAILED"));
        }
    }

    /**
     * {@code POST  /files/upload/avatar-url} : Set avatar from URL.
     * Use case 13: Change avatar (from web URL)
     *
     * @param request containing imageUrl
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and file URL in body.
     */
    @PostMapping("/upload/avatar-url")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatarFromUrl(@RequestBody Map<String, String> request) {
        String imageUrl = request.get("imageUrl");
        LOG.debug("REST request to set avatar from URL: {}", imageUrl);

        try {
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                throw new BadRequestAlertException("Image URL is required", ENTITY_NAME, "imageurlrequired");
            }

            // Validate URL format
            if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                throw new BadRequestAlertException("Invalid URL format", ENTITY_NAME, "invalidurl");
            }

            Map<String, String> result = new HashMap<>();
            result.put("imageUrl", imageUrl);

            return ResponseEntity.ok(ApiResponse.success(result, "Avatar URL set successfully"));
        } catch (Exception e) {
            LOG.error("Error setting avatar URL: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to set avatar URL: " + e.getMessage(), "UPLOAD_FAILED"));
        }
    }

    /**
     * {@code POST  /files/upload/audio} : Upload audio file for exercises.
     * Use case 62: Upload textbook content
     *
     * @param file the audio file to upload (max 20MB, mp3/wav only).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and file URL in body.
     */
    @PostMapping("/upload/audio")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAudio(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload audio file: {}", file.getOriginalFilename());

        try {
            // Validate file
            validateAudioFile(file, 20 * 1024 * 1024); // 20MB max

            // Store file
            String fileName = fileStorageService.storeFile(file, "audio", null);
            String fileUrl = "/api/files/download/audio/" + fileName;

            Map<String, String> result = new HashMap<>();
            result.put("fileName", fileName);
            result.put("fileUrl", fileUrl);
            result.put("fileType", file.getContentType());
            result.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(ApiResponse.success(result, "Audio file uploaded successfully"));
        } catch (Exception e) {
            LOG.error("Error uploading audio: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload audio: " + e.getMessage(), "UPLOAD_FAILED"));
        }
    }

    /**
     * {@code POST  /files/upload/image} : Upload image file.
     * Use case 62: Upload textbook content
     *
     * @param file the image file to upload (max 10MB).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and file URL in body.
     */
    @PostMapping("/upload/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload image file: {}", file.getOriginalFilename());

        try {
            // Validate file
            validateImageFile(file, 10 * 1024 * 1024); // 10MB max

            // Store file
            String fileName = fileStorageService.storeFile(file, "images", null);
            String fileUrl = "/api/files/download/images/" + fileName;

            Map<String, String> result = new HashMap<>();
            result.put("fileName", fileName);
            result.put("fileUrl", fileUrl);
            result.put("fileType", file.getContentType());
            result.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(ApiResponse.success(result, "Image uploaded successfully"));
        } catch (Exception e) {
            LOG.error("Error uploading image: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload image: " + e.getMessage(), "UPLOAD_FAILED"));
        }
    }

    /**
     * {@code POST  /files/upload/document} : Upload document file.
     *
     * @param file the document file to upload (max 200MB, pdf/doc/docx/epub/txt).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and file URL in body.
     */
    @PostMapping("/upload/document")
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.STAFF + "')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadDocument(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload document file: {}", file.getOriginalFilename());

        try {
            // Validate file
            validateDocumentFile(file, 200 * 1024 * 1024); // 200MB max

            // Store file
            String fileName = fileStorageService.storeFile(file, "documents", null);
            String fileUrl = "/api/files/download/documents/" + fileName;

            Map<String, String> result = new HashMap<>();
            result.put("fileName", fileName);
            result.put("fileUrl", fileUrl);
            result.put("fileType", file.getContentType());
            result.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(ApiResponse.success(result, "Document uploaded successfully"));
        } catch (Exception e) {
            LOG.error("Error uploading document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload document: " + e.getMessage(), "UPLOAD_FAILED"));
        }
    }

    /**
     * {@code GET  /files/download/{folder}/{fileName}} : Download a file.
     *
     * @param folder the folder name (avatars, audio, images, documents).
     * @param fileName the name of the file to download.
     * @return the {@link ResponseEntity} with file content.
     */
    @GetMapping("/download/{folder}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String folder, @PathVariable String fileName) {
        LOG.debug("REST request to download file: {}/{}", folder, fileName);

        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName, folder);

            // Determine content type
            String contentType = "application/octet-stream";
            if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.endsWith(".png")) {
                contentType = "image/png";
            } else if (fileName.endsWith(".mp3")) {
                contentType = "audio/mpeg";
            } else if (fileName.endsWith(".wav")) {
                contentType = "audio/wav";
            } else if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (Exception e) {
            LOG.error("Error downloading file: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * {@code DELETE  /files/delete/{folder}/{fileName}} : Delete a file.
     *
     * @param folder the folder name.
     * @param fileName the name of the file to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/delete/{folder}/{fileName:.+}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String folder, @PathVariable String fileName) {
        LOG.debug("REST request to delete file: {}/{}", folder, fileName);

        try {
            fileStorageService.deleteFile(fileName, folder);
            return ResponseEntity.ok(ApiResponse.success("File deleted successfully"));
        } catch (Exception e) {
            LOG.error("Error deleting file: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete file: " + e.getMessage(), "DELETE_FAILED"));
        }
    }

    // Validation methods

    private void validateImageFile(MultipartFile file, long maxSize) {
        if (file.isEmpty()) {
            throw new BadRequestAlertException("File is empty", ENTITY_NAME, "fileempty");
        }

        if (file.getSize() > maxSize) {
            throw new BadRequestAlertException("File size exceeds maximum allowed size", ENTITY_NAME, "filetoobig");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new BadRequestAlertException("Only JPEG and PNG images are allowed", ENTITY_NAME, "invalidfiletype");
        }
    }

    private void validateAudioFile(MultipartFile file, long maxSize) {
        if (file.isEmpty()) {
            throw new BadRequestAlertException("File is empty", ENTITY_NAME, "fileempty");
        }

        if (file.getSize() > maxSize) {
            throw new BadRequestAlertException("File size exceeds maximum allowed size", ENTITY_NAME, "filetoobig");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("audio/mpeg") && !contentType.equals("audio/wav"))) {
            throw new BadRequestAlertException("Only MP3 and WAV audio files are allowed", ENTITY_NAME, "invalidfiletype");
        }
    }

    private void validateDocumentFile(MultipartFile file, long maxSize) {
        if (file.isEmpty()) {
            throw new BadRequestAlertException("File is empty", ENTITY_NAME, "fileempty");
        }

        if (file.getSize() > maxSize) {
            throw new BadRequestAlertException("File size exceeds maximum allowed size", ENTITY_NAME, "filetoobig");
        }

        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        boolean isValidType =
            contentType != null &&
            (contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/epub+zip") ||
                contentType.equals("text/plain"));

        // Fallback to file extension check for epub and txt
        if (!isValidType && fileName != null) {
            String lowerFileName = fileName.toLowerCase();
            isValidType =
                lowerFileName.endsWith(".pdf") ||
                lowerFileName.endsWith(".doc") ||
                lowerFileName.endsWith(".docx") ||
                lowerFileName.endsWith(".epub") ||
                lowerFileName.endsWith(".txt");
        }

        if (!isValidType) {
            throw new BadRequestAlertException("Only PDF, Word, EPUB and TXT documents are allowed", ENTITY_NAME, "invalidfiletype");
        }
    }
}
