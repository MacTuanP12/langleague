package com.langleague.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.domain.enumeration.Level;
import com.langleague.service.dto.BookExtractionDTO;
import com.langleague.service.dto.BookExtractionDTO.ChapterExtractionDTO;
import com.langleague.service.dto.BookExtractionDTO.ExerciseExtractionDTO;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for interacting with chatbot API to extract book information
 */
@Service
public class ChatbotService {

    private static final Logger LOG = LoggerFactory.getLogger(ChatbotService.class);
    private static final int MAX_RETRIES = 3;
    private static final Duration RETRY_DELAY = Duration.ofSeconds(2);

    @Value("${application.chatbot.api-url:http://localhost:5000/api/extract-book}")
    private String chatbotApiUrl;

    @Value("${application.chatbot.api-key:}")
    private String chatbotApiKey;

    @Value("${application.chatbot.timeout:120000}")
    private int chatbotTimeout;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public ChatbotService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Extract book information from file using chatbot API
     *
     * @param file the file to extract
     * @return BookExtractionDTO containing extracted information
     * @throws Exception if extraction fails
     */
    public BookExtractionDTO extractBookInfo(MultipartFile file) throws Exception {
        LOG.info("Starting book extraction for file: {}", file.getOriginalFilename());

        int retryCount = 0;
        Exception lastException = null;

        while (retryCount < MAX_RETRIES) {
            try {
                return performExtraction(file);
            } catch (Exception e) {
                lastException = e;
                retryCount++;
                LOG.warn("Extraction attempt {} failed: {}", retryCount, e.getMessage());

                if (retryCount < MAX_RETRIES) {
                    Thread.sleep(RETRY_DELAY.toMillis());
                }
            }
        }

        LOG.error("Book extraction failed after {} retries", MAX_RETRIES);
        throw new Exception("Failed to extract book information after " + MAX_RETRIES + " retries", lastException);
    }

    /**
     * Perform the actual extraction by calling chatbot API
     */
    private BookExtractionDTO performExtraction(MultipartFile file) throws Exception {
        // Prepare multipart request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        if (chatbotApiKey != null && !chatbotApiKey.isEmpty()) {
            headers.set("X-API-Key", chatbotApiKey);
        }

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Call chatbot API
        ResponseEntity<String> response = restTemplate.exchange(chatbotApiUrl, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new Exception("Chatbot API returned status: " + response.getStatusCode());
        }

        // Parse response
        return parseResponse(response.getBody());
    }

    /**
     * Parse chatbot response to BookExtractionDTO
     */
    private BookExtractionDTO parseResponse(String responseBody) throws Exception {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            BookExtractionDTO dto = new BookExtractionDTO();

            // Parse book info
            dto.setTitle(root.path("title").asText());
            dto.setLevel(Level.valueOf(root.path("level").asText("BEGINNER")));
            dto.setDescription(root.path("description").asText(null));
            dto.setThumbnailUrl(root.path("thumbnail_url").asText(null));

            // Parse chapters
            List<ChapterExtractionDTO> chapters = new ArrayList<>();
            JsonNode chaptersNode = root.path("chapters");

            if (chaptersNode.isArray()) {
                int chapterIndex = 0;
                for (JsonNode chapterNode : chaptersNode) {
                    ChapterExtractionDTO chapter = new ChapterExtractionDTO();
                    chapter.setTitle(chapterNode.path("title").asText());
                    chapter.setDescription(chapterNode.path("description").asText(null));
                    chapter.setOrderIndex(chapterIndex++);

                    // Parse exercises
                    List<ExerciseExtractionDTO> exercises = new ArrayList<>();
                    JsonNode exercisesNode = chapterNode.path("exercises");

                    if (exercisesNode.isArray()) {
                        int exerciseIndex = 0;
                        for (JsonNode exerciseNode : exercisesNode) {
                            ExerciseExtractionDTO exercise = new ExerciseExtractionDTO();
                            exercise.setType(exerciseNode.path("type").asText());
                            exercise.setTitle(exerciseNode.path("title").asText(null));
                            exercise.setContent(exerciseNode.path("content").asText());
                            exercise.setOrderIndex(exerciseIndex++);
                            exercises.add(exercise);
                        }
                    }

                    chapter.setExercises(exercises);
                    chapters.add(chapter);
                }
            }

            dto.setChapters(chapters);

            LOG.info("Successfully parsed book extraction: {} with {} chapters", dto.getTitle(), chapters.size());
            return dto;
        } catch (Exception e) {
            LOG.error("Failed to parse chatbot response: {}", e.getMessage());
            throw new Exception("Failed to parse chatbot response", e);
        }
    }

    /**
     * Validate extracted book information
     */
    public void validateExtraction(BookExtractionDTO dto) throws Exception {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new Exception("Book title is required");
        }

        if (dto.getLevel() == null) {
            throw new Exception("Book level is required");
        }

        if (dto.getChapters() == null || dto.getChapters().isEmpty()) {
            throw new Exception("At least one chapter is required");
        }
    }
}
