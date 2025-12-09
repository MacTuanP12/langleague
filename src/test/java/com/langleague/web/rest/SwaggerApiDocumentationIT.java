package com.langleague.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.langleague.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration tests for Swagger/OpenAPI documentation.
 * Tests the availability and structure of API documentation endpoints.
 */
@AutoConfigureMockMvc
@IntegrationTest
class SwaggerApiDocumentationIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testApiDocsEndpointIsAccessible() throws Exception {
        mockMvc
            .perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testApiDocsContainsBasicInfo() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        // Verify OpenAPI version
        assertThat(rootNode.has("openapi")).isTrue();
        assertThat(rootNode.get("openapi").asText()).startsWith("3.0");

        // Verify API info
        assertThat(rootNode.has("info")).isTrue();
        JsonNode info = rootNode.get("info");
        assertThat(info.get("title").asText()).isEqualTo("Langleague API");
        assertThat(info.get("description").asText()).isEqualTo("Langleague API documentation");
        assertThat(info.get("version").asText()).isEqualTo("0.0.1");
        assertThat(info.get("license").get("name").asText()).isEqualTo("unlicensed");
    }

    @Test
    void testApiDocsContainsServerInfo() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        // Verify servers
        assertThat(rootNode.has("servers")).isTrue();
        JsonNode servers = rootNode.get("servers");
        assertThat(servers.isArray()).isTrue();
        assertThat(servers.size()).isGreaterThan(0);
    }

    @Test
    void testApiDocsContainsBooksEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Books endpoints
        assertThat(paths.has("/api/books")).isTrue();
        assertThat(paths.has("/api/books/{id}")).isTrue();
        assertThat(paths.has("/api/books/{id}/details")).isTrue();
        assertThat(paths.has("/api/books/{id}/chapters")).isTrue();
        assertThat(paths.has("/api/books/statistics/count-by-level")).isTrue();
        assertThat(paths.has("/api/books/search")).isTrue();
        assertThat(paths.has("/api/books/recommendations")).isTrue();
        assertThat(paths.has("/api/books/level/{level}")).isTrue();
        assertThat(paths.has("/api/books/check-title")).isTrue();
        assertThat(paths.has("/api/books/active")).isTrue();
        assertThat(paths.has("/api/books/{id}/restore")).isTrue();
        assertThat(paths.has("/api/books/{id}/hard")).isTrue();
    }

    @Test
    void testApiDocsContainsChaptersEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Chapters endpoints
        assertThat(paths.has("/api/chapters")).isTrue();
        assertThat(paths.has("/api/chapters/{id}")).isTrue();
        assertThat(paths.has("/api/chapters/{id}/details")).isTrue();
        assertThat(paths.has("/api/chapters/{id}/previous")).isTrue();
        assertThat(paths.has("/api/chapters/{id}/next")).isTrue();
        assertThat(paths.has("/api/chapters/reorder")).isTrue();
        assertThat(paths.has("/api/chapters/search")).isTrue();
        assertThat(paths.has("/api/chapters/count/book/{bookId}")).isTrue();
        assertThat(paths.has("/api/chapters/book/{bookId}")).isTrue();
    }

    @Test
    void testApiDocsContainsAuthenticationEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Authentication endpoints
        assertThat(paths.has("/api/authenticate")).isTrue();
    }

    @Test
    void testApiDocsContainsAccountEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Account endpoints
        assertThat(paths.has("/api/account")).isTrue();
        assertThat(paths.has("/api/account/profile")).isTrue();
        assertThat(paths.has("/api/account/avatar")).isTrue();
        assertThat(paths.has("/api/register")).isTrue();
        assertThat(paths.has("/api/account/reset-password/init")).isTrue();
        assertThat(paths.has("/api/account/reset-password/finish")).isTrue();
        assertThat(paths.has("/api/account/change-password")).isTrue();
        assertThat(paths.has("/api/activate")).isTrue();
        assertThat(paths.has("/api/account/lock")).isTrue();
        assertThat(paths.has("/api/account/unlock")).isTrue();
    }

    @Test
    void testApiDocsContainsExercisesEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Listening exercises
        assertThat(paths.has("/api/listening-exercises")).isTrue();
        assertThat(paths.has("/api/listening-exercises/{id}")).isTrue();
        assertThat(paths.has("/api/listening-exercises/chapter/{chapterId}")).isTrue();

        // Verify Reading exercises
        assertThat(paths.has("/api/reading-exercises")).isTrue();
        assertThat(paths.has("/api/reading-exercises/{id}")).isTrue();
        assertThat(paths.has("/api/reading-exercises/chapter/{chapterId}")).isTrue();

        // Verify Speaking exercises
        assertThat(paths.has("/api/speaking-exercises")).isTrue();
        assertThat(paths.has("/api/speaking-exercises/{id}")).isTrue();
        assertThat(paths.has("/api/speaking-exercises/chapter/{chapterId}")).isTrue();

        // Verify Writing exercises
        assertThat(paths.has("/api/writing-exercises")).isTrue();
        assertThat(paths.has("/api/writing-exercises/{id}")).isTrue();
        assertThat(paths.has("/api/writing-exercises/chapter/{chapterId}")).isTrue();
    }

    @Test
    void testApiDocsContainsNotificationsEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Notifications endpoints
        assertThat(paths.has("/api/notifications")).isTrue();
        assertThat(paths.has("/api/notifications/{id}/read")).isTrue();
        assertThat(paths.has("/api/notifications/mark-all-read")).isTrue();
        assertThat(paths.has("/api/notifications/broadcast")).isTrue();
        assertThat(paths.has("/api/notifications/unread")).isTrue();
        assertThat(paths.has("/api/notifications/count-unread")).isTrue();
    }

    @Test
    void testApiDocsContainsFileUploadEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify File Upload endpoints
        assertThat(paths.has("/api/files/upload/image")).isTrue();
        assertThat(paths.has("/api/files/upload/document")).isTrue();
        assertThat(paths.has("/api/files/upload/avatar")).isTrue();
        assertThat(paths.has("/api/files/upload/audio")).isTrue();
        assertThat(paths.has("/api/files/download/{folder}/{fileName}")).isTrue();
        assertThat(paths.has("/api/files/delete/{folder}/{fileName}")).isTrue();
    }

    @Test
    void testApiDocsContainsCommentsEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Comments endpoints
        assertThat(paths.has("/api/comments")).isTrue();
        assertThat(paths.has("/api/comments/{id}")).isTrue();
        assertThat(paths.has("/api/comments/chapter/{chapterId}")).isTrue();
    }

    @Test
    void testApiDocsContainsBulkOperationsEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Bulk Operations endpoints
        assertThat(paths.has("/api/bulk/words")).isTrue();
        assertThat(paths.has("/api/bulk/grammars")).isTrue();
        assertThat(paths.has("/api/bulk/exercises/reading")).isTrue();
        assertThat(paths.has("/api/bulk/exercises/listening")).isTrue();
        assertThat(paths.has("/api/bulk/achievements/assign")).isTrue();
        assertThat(paths.has("/api/bulk/notifications/send")).isTrue();
        assertThat(paths.has("/api/bulk/import/csv")).isTrue();
    }

    @Test
    void testApiDocsContainsVocabularyEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Word endpoints
        assertThat(paths.has("/api/words")).isTrue();
        assertThat(paths.has("/api/words/{id}")).isTrue();
        assertThat(paths.has("/api/words/chapter/{chapterId}")).isTrue();

        // Verify User Vocabulary endpoints
        assertThat(paths.has("/api/user-vocabularies")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/{id}")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/save/{wordId}")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/save-word")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/batch-save")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/word/{wordId}/memorized")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/review/{wordId}")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/statistics")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/my-words")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/my-words/review-today")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/my-words/progress")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/my-words/memorized")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/saved")).isTrue();
        assertThat(paths.has("/api/user-vocabularies/is-saved/{wordId}")).isTrue();
    }

    @Test
    void testApiDocsContainsGrammarEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Grammar endpoints
        assertThat(paths.has("/api/grammars")).isTrue();
        assertThat(paths.has("/api/grammars/{id}")).isTrue();
        assertThat(paths.has("/api/grammars/chapter/{chapterId}")).isTrue();

        // Verify User Grammar endpoints
        assertThat(paths.has("/api/user-grammars")).isTrue();
        assertThat(paths.has("/api/user-grammars/{id}")).isTrue();
        assertThat(paths.has("/api/user-grammars/save/{grammarId}")).isTrue();
        assertThat(paths.has("/api/user-grammars/review/{grammarId}")).isTrue();
        assertThat(paths.has("/api/user-grammars/statistics")).isTrue();
        assertThat(paths.has("/api/user-grammars/my-grammars")).isTrue();
        assertThat(paths.has("/api/user-grammars/my-grammars/review")).isTrue();
        assertThat(paths.has("/api/user-grammars/my-grammars/memorized")).isTrue();
        assertThat(paths.has("/api/user-grammars/is-saved/{grammarId}")).isTrue();
    }

    @Test
    void testApiDocsContainsProgressEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Book Progress endpoints
        assertThat(paths.has("/api/book-progresses")).isTrue();
        assertThat(paths.has("/api/book-progresses/{id}")).isTrue();
        assertThat(paths.has("/api/book-progresses/book/{bookId}")).isTrue();
        assertThat(paths.has("/api/book-progresses/my-books")).isTrue();

        // Verify Chapter Progress endpoints
        assertThat(paths.has("/api/chapter-progresses")).isTrue();
        assertThat(paths.has("/api/chapter-progresses/{id}")).isTrue();
        assertThat(paths.has("/api/chapter-progresses/chapter/{chapterId}/progress")).isTrue();
        assertThat(paths.has("/api/chapter-progresses/chapter/{chapterId}/complete")).isTrue();
        assertThat(paths.has("/api/chapter-progresses/book/{bookId}")).isTrue();
        assertThat(paths.has("/api/chapter-progresses/book/{bookId}/completion")).isTrue();
    }

    @Test
    void testApiDocsContainsReviewEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Book Review endpoints
        assertThat(paths.has("/api/book-reviews")).isTrue();
        assertThat(paths.has("/api/book-reviews/{id}")).isTrue();
        assertThat(paths.has("/api/book-reviews/rate")).isTrue();
        assertThat(paths.has("/api/book-reviews/book/{bookId}")).isTrue();
        assertThat(paths.has("/api/book-reviews/book/{bookId}/average")).isTrue();
    }

    @Test
    void testApiDocsContainsExerciseResultEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Exercise Result endpoints
        assertThat(paths.has("/api/exercise-results")).isTrue();
        assertThat(paths.has("/api/exercise-results/{id}")).isTrue();
        assertThat(paths.has("/api/exercise-results/submit")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-statistics")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-statistics/by-chapter/{chapterId}")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-results")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-results/recent")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-results/by-type")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-results/by-chapter/{chapterId}")).isTrue();
        assertThat(paths.has("/api/exercise-results/my-results/by-chapter/{chapterId}/by-type")).isTrue();
    }

    @Test
    void testApiDocsContainsAchievementEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Achievement endpoints
        assertThat(paths.has("/api/achievements")).isTrue();
        assertThat(paths.has("/api/achievements/{id}")).isTrue();
        assertThat(paths.has("/api/achievements/stats/{userId}")).isTrue();

        // Verify User Achievement endpoints
        assertThat(paths.has("/api/user-achievements")).isTrue();
        assertThat(paths.has("/api/user-achievements/{id}")).isTrue();
        assertThat(paths.has("/api/user-achievements/user/{userId}")).isTrue();
        assertThat(paths.has("/api/user-achievements/user/{userId}/count")).isTrue();
        assertThat(paths.has("/api/user-achievements/check/{userId}/{achievementId}")).isTrue();
    }

    @Test
    void testApiDocsContainsLearningStreakEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Learning Streak endpoints
        assertThat(paths.has("/api/learning-streaks/record")).isTrue();
        assertThat(paths.has("/api/learning-streaks/longest")).isTrue();
        assertThat(paths.has("/api/learning-streaks/current")).isTrue();

        // Verify Streak Milestone endpoints
        assertThat(paths.has("/api/streak-milestones")).isTrue();
        assertThat(paths.has("/api/streak-milestones/{id}")).isTrue();
        assertThat(paths.has("/api/streak-milestones/next")).isTrue();
        assertThat(paths.has("/api/streak-milestones/achieved")).isTrue();

        // Verify Streak Icon endpoints
        assertThat(paths.has("/api/streak-icons")).isTrue();
        assertThat(paths.has("/api/streak-icons/{id}")).isTrue();
        assertThat(paths.has("/api/streak-icons/unlocked")).isTrue();
        assertThat(paths.has("/api/streak-icons/next")).isTrue();
        assertThat(paths.has("/api/streak-icons/locked")).isTrue();
        assertThat(paths.has("/api/streak-icons/current")).isTrue();
    }

    @Test
    void testApiDocsContainsLearningReportEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Learning Report endpoints
        assertThat(paths.has("/api/learning-reports/my-progress")).isTrue();
        assertThat(paths.has("/api/learning-reports/history")).isTrue();
        assertThat(paths.has("/api/learning-reports/export")).isTrue();
        assertThat(paths.has("/api/learning-reports/admin/user-visits")).isTrue();
        assertThat(paths.has("/api/learning-reports/admin/engagement-stats")).isTrue();
        assertThat(paths.has("/api/learning-reports/admin/completion-stats")).isTrue();
    }

    @Test
    void testApiDocsContainsUserManagementEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Admin User endpoints
        assertThat(paths.has("/api/admin/users")).isTrue();
        assertThat(paths.has("/api/admin/users/{login}")).isTrue();
        assertThat(paths.has("/api/admin/users/{login}/lock")).isTrue();
        assertThat(paths.has("/api/admin/users/{login}/unlock")).isTrue();
        assertThat(paths.has("/api/admin/users/create")).isTrue();

        // Verify App User endpoints
        assertThat(paths.has("/api/app-users")).isTrue();
        assertThat(paths.has("/api/app-users/{id}")).isTrue();
        assertThat(paths.has("/api/app-users/me")).isTrue();

        // Verify Public User endpoints
        assertThat(paths.has("/api/users")).isTrue();
    }

    @Test
    void testApiDocsContainsMiscellaneousEndpoints() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        assertThat(paths).isNotNull();

        // Verify Study Session endpoints
        assertThat(paths.has("/api/study-sessions")).isTrue();
        assertThat(paths.has("/api/study-sessions/{id}")).isTrue();

        // Verify Favorite endpoints
        assertThat(paths.has("/api/favorites")).isTrue();
        assertThat(paths.has("/api/favorites/chapter/{chapterId}")).isTrue();
        assertThat(paths.has("/api/favorites/chapter/{chapterId}/check")).isTrue();

        // Verify Captcha endpoints
        assertThat(paths.has("/api/captcha")).isTrue();
        assertThat(paths.has("/api/captcha/verify")).isTrue();

        // Verify Authority endpoints
        assertThat(paths.has("/api/authorities")).isTrue();
        assertThat(paths.has("/api/authorities/{id}")).isTrue();

        // Verify Health check endpoint
        assertThat(paths.has("/api/health")).isTrue();
    }

    @Test
    void testApiDocsContainsSchemas() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode components = rootNode.get("components");
        assertThat(components).isNotNull();

        JsonNode schemas = components.get("schemas");
        assertThat(schemas).isNotNull();

        // Verify key schemas exist
        assertThat(schemas.has("BookDTO")).isTrue();
        assertThat(schemas.has("ChapterDTO")).isTrue();
        assertThat(schemas.has("UserDTO")).isTrue();
        assertThat(schemas.has("AdminUserDTO")).isTrue();
        assertThat(schemas.has("AppUserDTO")).isTrue();
        assertThat(schemas.has("NotificationDTO")).isTrue();
        assertThat(schemas.has("CommentDTO")).isTrue();
        assertThat(schemas.has("ListeningExerciseDTO")).isTrue();
        assertThat(schemas.has("ReadingExerciseDTO")).isTrue();
        assertThat(schemas.has("SpeakingExerciseDTO")).isTrue();
        assertThat(schemas.has("WritingExerciseDTO")).isTrue();
        assertThat(schemas.has("WordDTO")).isTrue();
        assertThat(schemas.has("GrammarDTO")).isTrue();
        assertThat(schemas.has("ExerciseResultDTO")).isTrue();
        assertThat(schemas.has("UserBookDTO")).isTrue();
        assertThat(schemas.has("ChapterProgressDTO")).isTrue();
        assertThat(schemas.has("BookReviewDTO")).isTrue();
        assertThat(schemas.has("AchievementDTO")).isTrue();
        assertThat(schemas.has("UserAchievementDTO")).isTrue();
        assertThat(schemas.has("UserVocabularyDTO")).isTrue();
        assertThat(schemas.has("UserGrammarDTO")).isTrue();
        assertThat(schemas.has("StudySessionDTO")).isTrue();
        assertThat(schemas.has("LoginVM")).isTrue();
        assertThat(schemas.has("JWTToken")).isTrue();
        assertThat(schemas.has("ManagedUserVM")).isTrue();
        assertThat(schemas.has("PasswordChangeDTO")).isTrue();
    }

    @Test
    void testSwaggerUIIsAccessible() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
    }

    @Test
    void testApiDocsContainsBooksHttpMethods() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        JsonNode booksIdPath = paths.get("/api/books/{id}");

        // Verify HTTP methods for /api/books/{id}
        assertThat(booksIdPath.has("get")).isTrue();
        assertThat(booksIdPath.has("put")).isTrue();
        assertThat(booksIdPath.has("delete")).isTrue();
        assertThat(booksIdPath.has("patch")).isTrue();
    }

    @Test
    void testApiDocsContainsChaptersHttpMethods() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        JsonNode chaptersIdPath = paths.get("/api/chapters/{id}");

        // Verify HTTP methods for /api/chapters/{id}
        assertThat(chaptersIdPath.has("get")).isTrue();
        assertThat(chaptersIdPath.has("put")).isTrue();
        assertThat(chaptersIdPath.has("delete")).isTrue();
        assertThat(chaptersIdPath.has("patch")).isTrue();
    }

    @Test
    void testApiDocsContainsAuthenticationHttpMethods() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        JsonNode paths = rootNode.get("paths");
        JsonNode authenticatePath = paths.get("/api/authenticate");

        // Verify HTTP methods for /api/authenticate
        assertThat(authenticatePath.has("get")).isTrue();
        assertThat(authenticatePath.has("post")).isTrue();
    }

    @Test
    void testApiDocsContainsTags() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        String content = result.getResponse().getContentAsString();
        JsonNode rootNode = objectMapper.readTree(content);

        // Verify tags exist
        assertThat(rootNode.has("tags")).isTrue();
        JsonNode tags = rootNode.get("tags");
        assertThat(tags.isArray()).isTrue();
        assertThat(tags.size()).isGreaterThan(0);
    }
}
