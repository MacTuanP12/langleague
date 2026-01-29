package com.langleague.app.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.app.config.ApplicationProperties;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    private final Logger log = LoggerFactory.getLogger(AiService.class);
    private final ApplicationProperties applicationProperties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateContent(String prompt, String modelName) {
        // Validate prompt
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be null or empty");
        }

        String googleApiKey = applicationProperties.getAi().getGoogleKey();

        if (googleApiKey == null || googleApiKey.isEmpty()) {
            log.error("Google API Key is not configured in application.yml");
            throw new RuntimeException("Google API Key is not configured. Please configure it in application.yml");
        }

        log.info(
            "Using Google API Key: {}...{}",
            googleApiKey.substring(0, Math.min(10, googleApiKey.length())),
            googleApiKey.substring(Math.max(0, googleApiKey.length() - 4))
        );

        // Default to gemini-2.5-flash (stable, available on free tier)
        // Note: gemini-1.5-flash has been deprecated, use gemini-2.5-flash instead
        String model = (modelName != null && !modelName.isEmpty()) ? modelName : "gemini-2.5-flash";

        // Validate and map deprecated model names to current ones
        if ("gemini-1.5-flash".equals(model) || "gemini-1.5-flash-latest".equals(model)) {
            model = "gemini-2.5-flash";
            log.info("Mapped deprecated model '{}' to 'gemini-2.5-flash'", modelName);
        } else if ("gemini-1.5-pro".equals(model) || "gemini-1.5-pro-latest".equals(model)) {
            model = "gemini-2.5-pro";
            log.info("Mapped deprecated model '{}' to 'gemini-2.5-pro'", modelName);
        } else if ("gemini-2.0-flash-exp".equals(model)) {
            // Map experimental to stable
            model = "gemini-2.0-flash";
            log.info("Mapped experimental model '{}' to 'gemini-2.0-flash'", modelName);
        }

        // Validate model name format (basic validation)
        // Allow lowercase letters, numbers, hyphens, and dots (for versions like 1.5, 2.0)
        if (!model.matches("^[a-z0-9.-]+$")) {
            log.error("Invalid model name format: {}", model);
            throw new IllegalArgumentException("Invalid model name format: " + model);
        }

        // Use v1 API for stable production support (gemini-2.5-flash, gemini-2.0-flash, etc.)
        // v1 is the stable production version, v1beta is for experimental features
        // Both support gemini-2.5-flash, but v1 is recommended for production
        String url = "https://generativelanguage.googleapis.com/v1/models/" + model + ":generateContent?key=" + googleApiKey;

        // Construct Request Body using POJOs
        GeminiRequest requestBody = new GeminiRequest();
        GeminiContent content = new GeminiContent();
        GeminiPart part = new GeminiPart();
        part.setText(prompt);
        content.setParts(Collections.singletonList(part));
        requestBody.setContents(Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Log request for debugging
        try {
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            log.debug("Calling Gemini API: {}", url.replaceAll("key=[^&]+", "key=***"));
            log.debug("Request Body: {}", jsonBody);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize request body", e);
        }

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("Sending request to Gemini API with model: {}", model);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            log.info("Received response from Gemini API with status: {}", response.getStatusCode());

            if (response.getBody() == null || response.getBody().isEmpty()) {
                log.error("Empty response from Gemini API");
                throw new RuntimeException("Empty response from Gemini API");
            }

            JsonNode root = objectMapper.readTree(response.getBody());

            // Check for errors in response
            if (root.has("error")) {
                JsonNode error = root.get("error");
                String errorMessage = error.has("message") ? error.get("message").asText() : "Unknown error from Gemini API";
                int statusCode = error.has("code") ? error.get("code").asInt() : 500;
                log.error("Gemini API returned error: {} - {}", statusCode, errorMessage);
                throw new RuntimeException("Gemini API Error: " + errorMessage);
            }

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.size() == 0) {
                log.warn("No candidates in response from Gemini API");
                return "";
            }

            JsonNode firstCandidate = candidates.get(0);

            // Check for finish reason (safety filters, etc.)
            if (firstCandidate.has("finishReason")) {
                String finishReason = firstCandidate.get("finishReason").asText();
                if ("SAFETY".equals(finishReason)) {
                    log.warn("Response blocked by safety filters");
                    throw new RuntimeException("Response was blocked by safety filters. Please modify your prompt.");
                }
            }

            JsonNode contentNode = firstCandidate.path("content");
            JsonNode parts = contentNode.path("parts");
            if (parts.isArray() && parts.size() > 0) {
                String text = parts.get(0).path("text").asText();
                if (text == null || text.isEmpty()) {
                    log.warn("Empty text in response from Gemini API");
                    return "";
                }
                return text;
            }

            log.warn("No text content in response from Gemini API");
            return "";
        } catch (HttpClientErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            int statusCode = e.getStatusCode().value();

            log.error("Gemini API Client Error: {} - {}", statusCode, errorBody);

            // Parse error message from response if possible
            String errorMessage = "Gemini API Error";
            try {
                JsonNode errorNode = objectMapper.readTree(errorBody);
                if (errorNode.has("error") && errorNode.get("error").has("message")) {
                    errorMessage = errorNode.get("error").get("message").asText();
                }
            } catch (Exception parseException) {
                // If parsing fails, use default message
                if (statusCode == 400) {
                    errorMessage = "Invalid request to Gemini API";
                } else if (statusCode == 401 || statusCode == 403) {
                    errorMessage = "Invalid or unauthorized API key";
                } else if (statusCode == 429) {
                    errorMessage = "Rate limit exceeded. Please try again later.";
                } else {
                    errorMessage = "Client error: " + errorBody;
                }
            }

            throw new RuntimeException(errorMessage);
        } catch (HttpServerErrorException e) {
            int statusCode = e.getStatusCode().value();
            String errorBody = e.getResponseBodyAsString();
            log.error("Gemini API Server Error: {} - {}", statusCode, errorBody);
            throw new RuntimeException("Gemini API server error. Please try again later.");
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.error("Failed to parse Gemini API response", e);
            throw new RuntimeException("Failed to parse response from Gemini API");
        } catch (Exception e) {
            log.error("Gemini API Exception", e);
            throw new RuntimeException("Error calling Gemini API: " + (e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }

    // Inner DTO classes for Gemini Request
    public static class GeminiRequest {

        @JsonProperty("contents")
        private List<GeminiContent> contents;

        public List<GeminiContent> getContents() {
            return contents;
        }

        public void setContents(List<GeminiContent> contents) {
            this.contents = contents;
        }
    }

    public static class GeminiContent {

        @JsonProperty("parts")
        private List<GeminiPart> parts;

        public List<GeminiPart> getParts() {
            return parts;
        }

        public void setParts(List<GeminiPart> parts) {
            this.parts = parts;
        }
    }

    public static class GeminiPart {

        @JsonProperty("text")
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
