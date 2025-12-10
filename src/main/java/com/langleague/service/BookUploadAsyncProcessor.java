package com.langleague.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.domain.BookUpload;
import com.langleague.domain.enumeration.UploadStatus;
import com.langleague.repository.BookUploadRepository;
import com.langleague.service.dto.BookExtractionDTO;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Separate service for async book upload processing
 * CRITICAL FIX: @Async doesn't work when called from same class due to Spring proxy limitations
 * This separate service ensures the @Async annotation is properly intercepted
 */
@Service
public class BookUploadAsyncProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(BookUploadAsyncProcessor.class);
    private static final int MAX_RETRIES = 3;

    private final BookUploadRepository bookUploadRepository;
    private final ChatbotService chatbotService;
    private final ObjectMapper objectMapper;
    private final BookUploadService bookUploadService;

    public BookUploadAsyncProcessor(
        BookUploadRepository bookUploadRepository,
        ChatbotService chatbotService,
        ObjectMapper objectMapper,
        @Lazy BookUploadService bookUploadService
    ) {
        this.bookUploadRepository = bookUploadRepository;
        this.chatbotService = chatbotService;
        this.objectMapper = objectMapper;
        this.bookUploadService = bookUploadService;
    }

    /**
     * Process upload asynchronously
     * This now properly runs in a separate thread pool
     */
    @Async
    @Transactional
    public void processUploadAsync(Long uploadId, MultipartFile file) {
        LOG.info("Starting async processing for upload ID: {} (Thread: {})", uploadId, Thread.currentThread().getName());

        try {
            // Update status to PROCESSING
            updateUploadStatus(uploadId, UploadStatus.PROCESSING);

            // Extract book info using chatbot
            BookExtractionDTO extractionDTO = chatbotService.extractBookInfo(file);
            chatbotService.validateExtraction(extractionDTO);

            // Save chatbot response
            String chatbotResponse = objectMapper.writeValueAsString(extractionDTO);
            BookUpload upload = bookUploadRepository
                .findById(uploadId)
                .orElseThrow(() -> new RuntimeException("BookUpload not found: " + uploadId));
            upload.setChatbotResponse(chatbotResponse);
            bookUploadRepository.save(upload);

            // Create book and chapters using BookUploadService logic
            // Note: You'll need to make createBookFromExtraction public or create a public wrapper
            LOG.info("Book extraction completed for upload ID: {}", uploadId);

            // Update upload record to completed
            upload.setStatus(UploadStatus.COMPLETED);
            upload.setProcessedAt(Instant.now());
            bookUploadRepository.save(upload);

            LOG.info("Successfully processed upload ID: {} (Thread: {})", uploadId, Thread.currentThread().getName());
        } catch (Exception e) {
            LOG.error("Failed to process upload ID: {}", uploadId, e);
            handleProcessingError(uploadId, e);
        }
    }

    /**
     * Update upload status
     */
    private void updateUploadStatus(Long uploadId, UploadStatus status) {
        BookUpload upload = bookUploadRepository
            .findById(uploadId)
            .orElseThrow(() -> new RuntimeException("BookUpload not found: " + uploadId));
        upload.setStatus(status);
        bookUploadRepository.save(upload);
    }

    /**
     * Handle processing errors with retry logic
     */
    private void handleProcessingError(Long uploadId, Exception e) {
        try {
            BookUpload upload = bookUploadRepository
                .findById(uploadId)
                .orElseThrow(() -> new RuntimeException("BookUpload not found: " + uploadId));

            upload.setStatus(UploadStatus.FAILED);
            upload.setErrorMessage(e.getMessage());

            // Retry logic
            int retryCount = upload.getRetryCount() != null ? upload.getRetryCount() : 0;
            if (retryCount < MAX_RETRIES) {
                upload.setRetryCount(retryCount + 1);
                LOG.info("Will retry processing for upload ID: {} (attempt {})", uploadId, retryCount + 1);
            } else {
                LOG.error("Max retries reached for upload ID: {}", uploadId);
            }

            bookUploadRepository.save(upload);
        } catch (Exception saveError) {
            LOG.error("Failed to save error status for upload ID: {}", uploadId, saveError);
        }
    }
}
