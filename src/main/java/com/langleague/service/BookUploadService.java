package com.langleague.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.domain.*;
import com.langleague.domain.enumeration.UploadStatus;
import com.langleague.repository.*;
import com.langleague.security.SecurityUtils;
import com.langleague.service.dto.*;
import com.langleague.service.dto.BookExtractionDTO.ChapterExtractionDTO;
import com.langleague.service.dto.BookExtractionDTO.ExerciseExtractionDTO;
import com.langleague.service.mapper.BookUploadMapper;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for processing book uploads from staff
 */
@Service
@Transactional
public class BookUploadService {

    private static final Logger LOG = LoggerFactory.getLogger(BookUploadService.class);
    private static final int MAX_RETRIES = 3;
    private static final String UPLOAD_FOLDER = "documents";

    private final BookUploadRepository bookUploadRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final AppUserRepository appUserRepository;
    private final ListeningExerciseRepository listeningExerciseRepository;
    private final ReadingExerciseRepository readingExerciseRepository;
    private final SpeakingExerciseRepository speakingExerciseRepository;
    private final WritingExerciseRepository writingExerciseRepository;
    private final FileStorageService fileStorageService;
    private final ChatbotService chatbotService;
    private final ObjectMapper objectMapper;
    private final BookUploadMapper bookUploadMapper;
    private final BookUploadAsyncProcessor asyncProcessor;

    public BookUploadService(
        BookUploadRepository bookUploadRepository,
        BookRepository bookRepository,
        ChapterRepository chapterRepository,
        AppUserRepository appUserRepository,
        ListeningExerciseRepository listeningExerciseRepository,
        ReadingExerciseRepository readingExerciseRepository,
        SpeakingExerciseRepository speakingExerciseRepository,
        WritingExerciseRepository writingExerciseRepository,
        FileStorageService fileStorageService,
        ChatbotService chatbotService,
        ObjectMapper objectMapper,
        BookUploadMapper bookUploadMapper,
        BookUploadAsyncProcessor asyncProcessor
    ) {
        this.bookUploadRepository = bookUploadRepository;
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.appUserRepository = appUserRepository;
        this.listeningExerciseRepository = listeningExerciseRepository;
        this.readingExerciseRepository = readingExerciseRepository;
        this.speakingExerciseRepository = speakingExerciseRepository;
        this.writingExerciseRepository = writingExerciseRepository;
        this.fileStorageService = fileStorageService;
        this.chatbotService = chatbotService;
        this.objectMapper = objectMapper;
        this.bookUploadMapper = bookUploadMapper;
        this.asyncProcessor = asyncProcessor;
    }

    /**
     * Upload a file and create BookUpload record (AI mode)
     */
    public BookUploadDTO initiateUpload(MultipartFile file) throws Exception {
        return initiateUpload(file, null, true);
    }

    /**
     * Upload a file with manual metadata (Hybrid mode)
     *
     * @param file the file to upload
     * @param metadata manual metadata (null if using AI)
     * @param useAI true to use AI extraction, false for manual input
     */
    public BookUploadDTO initiateUpload(MultipartFile file, BookMetadataDTO metadata, boolean useAI) throws Exception {
        LOG.info("Initiating book upload for file: {} (useAI: {})", file.getOriginalFilename(), useAI);

        // Validate file
        validateFile(file);

        // Get current user
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new Exception("Current user login not found"));

        // Store file
        String fileName = fileStorageService.storeFile(file, UPLOAD_FOLDER, userLogin);
        String fileUrl = "/uploads/" + UPLOAD_FOLDER + "/" + fileName;

        // Get AppUser
        AppUser appUser = appUserRepository
            .findByInternalUser_Login(userLogin)
            .orElseThrow(() -> new Exception("AppUser not found for login: " + userLogin));

        // Create BookUpload record
        BookUpload bookUpload = new BookUpload();
        bookUpload.setOriginalFileName(file.getOriginalFilename());
        bookUpload.setFileUrl(fileUrl);
        bookUpload.setStatus(UploadStatus.PENDING);
        bookUpload.setUploadedBy(appUser);
        bookUpload.setUploadedAt(Instant.now());
        bookUpload.setRetryCount(0);
        bookUpload.setUseAI(useAI);

        bookUpload = bookUploadRepository.save(bookUpload);

        if (useAI) {
            // CRITICAL FIX: Call async processor from separate service
            // This ensures @Async annotation works properly (external call through proxy)
            // Internal calls within same class don't trigger Spring AOP proxy
            asyncProcessor.processUploadAsync(bookUpload.getId(), file);
        } else {
            // Create book directly from manual metadata
            if (metadata == null) {
                throw new Exception("Metadata is required when not using AI");
            }
            createBookFromManualInput(bookUpload.getId(), metadata);
        }

        return bookUploadMapper.toDto(bookUpload);
    }

    /**
     * REMOVED: processUploadAsync method moved to BookUploadAsyncProcessor
     * Reason: @Async doesn't work when called from same class (internal call)
     * See: BookUploadAsyncProcessor.processUploadAsync()
     */

    /**
     * Create Book and Chapters from extraction DTO
     */
    private Book createBookFromExtraction(BookExtractionDTO extractionDTO, BookUpload upload) {
        LOG.info("Creating book from extraction: {} for upload ID: {}", extractionDTO.getTitle(), upload.getId());

        // Create Book
        Book book = new Book();
        book.setTitle(extractionDTO.getTitle());
        book.setLevel(extractionDTO.getLevel());
        book.setDescription(extractionDTO.getDescription());
        book.setThumbnail(extractionDTO.getThumbnailUrl());
        book.setIsActive(true);
        book.setAverageRating(0.0);
        book.setTotalReviews(0L);

        book = bookRepository.save(book);

        // Create Chapters
        if (extractionDTO.getChapters() != null) {
            for (ChapterExtractionDTO chapterDTO : extractionDTO.getChapters()) {
                createChapter(chapterDTO, book);
            }
        }

        return book;
    }

    /**
     * Create Chapter from extraction DTO
     */
    private void createChapter(ChapterExtractionDTO chapterDTO, Book book) {
        Chapter chapter = new Chapter();
        chapter.setTitle(chapterDTO.getTitle());

        // chapter.setDescription(chapterDTO.getDescription());
        chapter.setOrderIndex(chapterDTO.getOrderIndex());
        chapter.setBook(book);

        chapter = chapterRepository.save(chapter);

        // Create Exercises
        if (chapterDTO.getExercises() != null) {
            for (ExerciseExtractionDTO exerciseDTO : chapterDTO.getExercises()) {
                createExercise(exerciseDTO, chapter);
            }
        }
    }

    /**
     * Create Exercise based on type
     * Note: This is a simplified implementation. You may need to adjust fields based on actual entity structure
     */
    private void createExercise(ExerciseExtractionDTO exerciseDTO, Chapter chapter) {
        String type = exerciseDTO.getType().toUpperCase();

        try {
            switch (type) {
                case "LISTENING":
                    ListeningExercise listeningExercise = new ListeningExercise();
                    listeningExercise.setAudioPath(exerciseDTO.getContent()); // Using content as audio path
                    listeningExercise.setQuestion(exerciseDTO.getTitle() != null ? exerciseDTO.getTitle() : "Listening exercise");
                    listeningExercise.setMaxScore(100);
                    listeningExercise.setChapter(chapter);
                    listeningExerciseRepository.save(listeningExercise);
                    break;
                case "READING":
                    ReadingExercise readingExercise = new ReadingExercise();
                    readingExercise.setPassage(exerciseDTO.getContent());
                    readingExercise.setQuestion(exerciseDTO.getTitle() != null ? exerciseDTO.getTitle() : "Reading exercise");
                    readingExercise.setMaxScore(100);
                    readingExercise.setChapter(chapter);
                    readingExerciseRepository.save(readingExercise);
                    break;
                case "SPEAKING":
                    SpeakingExercise speakingExercise = new SpeakingExercise();
                    speakingExercise.setPrompt(exerciseDTO.getContent());
                    speakingExercise.setMaxScore(100);
                    speakingExercise.setChapter(chapter);
                    speakingExerciseRepository.save(speakingExercise);
                    break;
                case "WRITING":
                    WritingExercise writingExercise = new WritingExercise();
                    writingExercise.setPrompt(exerciseDTO.getContent());
                    writingExercise.setMaxScore(100);
                    writingExercise.setChapter(chapter);
                    writingExerciseRepository.save(writingExercise);
                    break;
                default:
                    LOG.warn("Unknown exercise type: {}", type);
            }
        } catch (Exception e) {
            LOG.error("Failed to create exercise of type {}: {}", type, e.getMessage());
            // Continue processing other exercises
        }
    }

    /**
     * Create book directly from manual metadata (no AI)
     */
    private void createBookFromManualInput(Long uploadId, BookMetadataDTO metadata) {
        LOG.info("Creating book from manual input for upload ID: {}", uploadId);

        try {
            BookUpload upload = bookUploadRepository.findById(uploadId).orElseThrow();

            // Update status to PROCESSING
            upload.setStatus(UploadStatus.PROCESSING);
            bookUploadRepository.save(upload);

            // Create Book
            Book book = new Book();
            book.setTitle(metadata.getTitle());
            book.setLevel(metadata.getLevel());
            book.setDescription(metadata.getDescription());
            book.setThumbnail(metadata.getThumbnailUrl());
            book.setIsActive(false); // Admin review required
            book.setAverageRating(0.0);
            book.setTotalReviews(0L);

            book = bookRepository.save(book);

            // Update upload record
            upload.setCreatedBook(book);
            upload.setStatus(UploadStatus.COMPLETED);
            upload.setProcessedAt(Instant.now());
            upload.setChatbotResponse("Manual input - no AI used");
            bookUploadRepository.save(upload);

            LOG.info("Successfully created book from manual input. Upload ID: {}, Book ID: {}", uploadId, book.getId());
        } catch (Exception e) {
            LOG.error("Failed to create book from manual input: {}", e.getMessage());
            handleProcessingError(uploadId, e);
        }
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new Exception("File is empty");
        }

        // Check file size (max 200MB)
        long maxSize = 200 * 1024 * 1024; // 200MB
        if (file.getSize() > maxSize) {
            throw new Exception("File size exceeds maximum limit of 200MB");
        }

        // Check file type - support more formats
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();

        List<String> allowedTypes = List.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/msword", // .doc
            "application/epub+zip", // .epub
            "text/plain" // .txt
        );

        // Validate by content type
        if (contentType != null && allowedTypes.contains(contentType)) {
            return;
        }

        // Fallback: validate by file extension
        if (fileName != null) {
            String lowerFileName = fileName.toLowerCase();
            if (
                lowerFileName.endsWith(".pdf") ||
                lowerFileName.endsWith(".docx") ||
                lowerFileName.endsWith(".doc") ||
                lowerFileName.endsWith(".epub") ||
                lowerFileName.endsWith(".txt")
            ) {
                return;
            }
        }

        throw new Exception("Invalid file type. Allowed types: PDF, DOCX, DOC, EPUB, TXT (max 200MB)");
    }

    /**
     * Update upload status
     */
    private void updateUploadStatus(Long uploadId, UploadStatus status) {
        bookUploadRepository
            .findById(uploadId)
            .ifPresent(upload -> {
                upload.setStatus(status);
                bookUploadRepository.save(upload);
            });
    }

    /**
     * Handle processing error with retry logic
     */
    private void handleProcessingError(Long uploadId, Exception e) {
        bookUploadRepository
            .findById(uploadId)
            .ifPresent(upload -> {
                int retryCount = upload.getRetryCount() != null ? upload.getRetryCount() : 0;

                if (retryCount < MAX_RETRIES) {
                    upload.setRetryCount(retryCount + 1);
                    upload.setStatus(UploadStatus.PENDING);
                    upload.setErrorMessage("Retry " + (retryCount + 1) + ": " + e.getMessage());
                } else {
                    upload.setStatus(UploadStatus.FAILED);
                    upload.setErrorMessage("Failed after " + MAX_RETRIES + " retries: " + e.getMessage());
                    upload.setProcessedAt(Instant.now());
                }

                bookUploadRepository.save(upload);
            });
    }

    /**
     * Get all uploads for current staff
     */
    @Transactional(readOnly = true)
    public List<BookUploadDTO> getMyUploads() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow();
        AppUser appUser = appUserRepository.findByInternalUser_Login(userLogin).orElseThrow();

        return bookUploadRepository
            .findByUploadedBy_IdOrderByUploadedAtDesc(appUser.getId())
            .stream()
            .map(bookUploadMapper::toDto)
            .toList();
    }

    /**
     * Get upload by ID
     */
    @Transactional(readOnly = true)
    public Optional<BookUploadDTO> getUploadById(Long id) {
        return bookUploadRepository.findById(id).map(bookUploadMapper::toDto);
    }

    /**
     * Retry failed upload
     */
    public void retryUpload(Long uploadId) throws Exception {
        BookUpload upload = bookUploadRepository.findById(uploadId).orElseThrow(() -> new Exception("Upload not found"));

        if (upload.getStatus() != UploadStatus.FAILED) {
            throw new Exception("Only failed uploads can be retried");
        }

        upload.setStatus(UploadStatus.PENDING);
        upload.setRetryCount(0);
        upload.setErrorMessage(null);
        bookUploadRepository.save(upload);

        // TODO: Reload file and process again
        LOG.info("Upload {} queued for retry", uploadId);
    }
}
