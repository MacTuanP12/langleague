package com.langleague.app.web.rest;

import com.langleague.app.service.AiService;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);
    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generate(@RequestBody Map<String, String> request) {
        // Validate request
        if (request == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Request body is required"));
        }

        String prompt = request.get("prompt");
        String model = request.get("model");

        // Validate prompt
        if (prompt == null || prompt.trim().isEmpty()) {
            log.warn("AI generation request with empty prompt");
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required and cannot be empty"));
        }

        // Validate model name if provided
        if (model != null && !model.trim().isEmpty()) {
            // Basic validation: model name should only contain lowercase letters, numbers, hyphens, and dots
            // Examples: gemini-1.5-flash-latest, gemini-2.0-flash-exp
            if (!model.matches("^[a-z0-9.-]+$")) {
                log.warn("Invalid model name format: {}", model);
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid model name format"));
            }
        }

        try {
            log.info(
                "Received AI generation request - Model: {}, Prompt length: {}",
                model != null ? model : "default",
                prompt != null ? prompt.length() : 0
            );

            String result = aiService.generateContent(prompt, model);

            // Check if result is empty (might indicate an issue)
            if (result == null || result.trim().isEmpty()) {
                log.warn("Empty result from AI service");
                return ResponseEntity.ok(Map.of("text", ""));
            }

            log.info("AI generation successful - Result length: {}", result.length());
            return ResponseEntity.ok(Map.of("text", result));
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument in AI generation request", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Invalid request"));
        } catch (RuntimeException e) {
            log.error("Error generating AI content", e);
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Internal server error";

            // Determine appropriate HTTP status based on error message
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            if (errorMessage.contains("API Key") || errorMessage.contains("unauthorized")) {
                status = HttpStatus.UNAUTHORIZED;
            } else if (errorMessage.contains("Rate limit") || errorMessage.contains("429")) {
                status = HttpStatus.TOO_MANY_REQUESTS;
            } else if (errorMessage.contains("Invalid") || errorMessage.contains("400")) {
                status = HttpStatus.BAD_REQUEST;
            }

            return ResponseEntity.status(status).body(Map.of("error", errorMessage));
        } catch (Exception e) {
            log.error("Unexpected error in AI generation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "An unexpected error occurred. Please try again later.")
            );
        }
    }
}
