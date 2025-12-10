package com.langleague.service;

import com.langleague.domain.Achievement;
import com.langleague.domain.AppUser;
import com.langleague.domain.User;
import com.langleague.repository.*;
import com.langleague.service.dto.*;
import com.langleague.service.mapper.AchievementMapper;
import com.langleague.service.mapper.AppUserMapper;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for bulk operations on entities.
 * Provides batch processing capabilities for ADMIN/STAFF to manage content efficiently.
 */
@Service
@Transactional
public class BulkOperationService {

    private static final Logger LOG = LoggerFactory.getLogger(BulkOperationService.class);

    private final WordService wordService;
    private final GrammarService grammarService;
    private final ListeningExerciseService listeningExerciseService;
    private final ReadingExerciseService readingExerciseService;
    private final ChapterService chapterService;
    private final NotificationService notificationService;
    private final UserAchievementService userAchievementService;
    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;
    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;
    private final AchievementMapper achievementMapper;

    public BulkOperationService(
        WordService wordService,
        GrammarService grammarService,
        ListeningExerciseService listeningExerciseService,
        ReadingExerciseService readingExerciseService,
        ChapterService chapterService,
        NotificationService notificationService,
        UserAchievementService userAchievementService,
        AchievementRepository achievementRepository,
        UserRepository userRepository,
        AppUserRepository appUserRepository,
        AppUserMapper appUserMapper,
        AchievementMapper achievementMapper
    ) {
        this.wordService = wordService;
        this.grammarService = grammarService;
        this.listeningExerciseService = listeningExerciseService;
        this.readingExerciseService = readingExerciseService;
        this.chapterService = chapterService;
        this.notificationService = notificationService;
        this.userAchievementService = userAchievementService;
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
        this.appUserRepository = appUserRepository;
        this.appUserMapper = appUserMapper;
        this.achievementMapper = achievementMapper;
    }

    /**
     * Bulk create words
     */
    public Map<String, Object> bulkCreateWords(List<WordDTO> words) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (WordDTO wordDTO : words) {
            try {
                wordService.save(wordDTO);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Word '" + wordDTO.getText() + "': " + e.getMessage());
                LOG.warn("Failed to create word: {}", wordDTO.getText(), e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk create grammars
     */
    public Map<String, Object> bulkCreateGrammars(List<GrammarDTO> grammars) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (GrammarDTO grammarDTO : grammars) {
            try {
                grammarService.save(grammarDTO);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Grammar '" + grammarDTO.getTitle() + "': " + e.getMessage());
                LOG.warn("Failed to create grammar: {}", grammarDTO.getTitle(), e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk create listening exercises
     */
    public Map<String, Object> bulkCreateListeningExercises(List<ListeningExerciseDTO> exercises) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (ListeningExerciseDTO exerciseDTO : exercises) {
            try {
                listeningExerciseService.save(exerciseDTO);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Exercise '" + exerciseDTO.getQuestion() + "': " + e.getMessage());
                LOG.warn("Failed to create listening exercise: {}", exerciseDTO.getQuestion(), e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk create reading exercises
     */
    public Map<String, Object> bulkCreateReadingExercises(List<ReadingExerciseDTO> exercises) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (ReadingExerciseDTO exerciseDTO : exercises) {
            try {
                readingExerciseService.save(exerciseDTO);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Exercise '" + exerciseDTO.getQuestion() + "': " + e.getMessage());
                LOG.warn("Failed to create reading exercise: {}", exerciseDTO.getQuestion(), e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk update words
     */
    public Map<String, Object> bulkUpdateWords(List<WordDTO> words) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (WordDTO wordDTO : words) {
            try {
                if (wordDTO.getId() == null) {
                    throw new IllegalArgumentException("Word ID is required for update");
                }
                wordService.update(wordDTO);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Word ID " + wordDTO.getId() + ": " + e.getMessage());
                LOG.warn("Failed to update word: {}", wordDTO.getId(), e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk delete words
     */
    public Map<String, Object> bulkDeleteWords(List<Long> wordIds) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (Long wordId : wordIds) {
            try {
                wordService.delete(wordId);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Word ID " + wordId + ": " + e.getMessage());
                LOG.warn("Failed to delete word: {}", wordId, e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk delete chapters
     */
    public Map<String, Object> bulkDeleteChapters(List<Long> chapterIds) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (Long chapterId : chapterIds) {
            try {
                chapterService.delete(chapterId);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("Chapter ID " + chapterId + ": " + e.getMessage());
                LOG.warn("Failed to delete chapter: {}", chapterId, e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk assign achievement to users
     * Use case: Award achievement to multiple users at once (e.g., event rewards, top performers)
     */
    public Map<String, Object> bulkAssignAchievement(Long achievementId, List<Long> userIds) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        // Validate achievement exists
        Achievement achievement = achievementRepository
            .findById(achievementId)
            .orElseThrow(() -> new IllegalArgumentException("Achievement not found: " + achievementId));

        AchievementDTO achievementDTO = achievementMapper.toDto(achievement);

        for (Long userId : userIds) {
            try {
                User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

                // Get AppUser for this user
                AppUser appUser = appUserRepository
                    .findByInternalUser_Login(user.getLogin())
                    .orElseThrow(() -> new IllegalArgumentException("AppUser not found for user: " + user.getLogin()));

                AppUserDTO appUserDTO = appUserMapper.toDto(appUser);

                // Create UserAchievement DTO with proper structure
                UserAchievementDTO userAchievementDTO = new UserAchievementDTO();
                userAchievementDTO.setAppUser(appUserDTO);
                userAchievementDTO.setAchievement(achievementDTO);
                userAchievementDTO.setAwardedTo(Instant.now());

                userAchievementService.save(userAchievementDTO);
                successCount++;

                LOG.debug("Achievement {} assigned to user {}", achievementId, user.getLogin());
            } catch (Exception e) {
                failCount++;
                errors.add("User ID " + userId + ": " + e.getMessage());
                LOG.warn("Failed to assign achievement to user: {}", userId, e);
            }
        }

        return createResultMap(successCount, failCount, errors);
    }

    /**
     * Bulk send notification to specific users or broadcast to all
     * Use case 57: Send announcement/notification
     *
     * @param notificationDTO the notification content (title, message, type)
     * @param userLogins list of user logins to send to, or null/empty for broadcast to all users
     * @return result map with success/fail counts
     */
    public Map<String, Object> bulkSendNotification(NotificationDTO notificationDTO, List<String> userLogins) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        List<User> targetUsers;
        if (userLogins == null || userLogins.isEmpty()) {
            // Broadcast to all users
            LOG.info("Broadcasting notification to all users: {}", notificationDTO.getTitle());
            targetUsers = userRepository.findAll();
        } else {
            // Send to specific users
            LOG.info("Sending notification to {} users: {}", userLogins.size(), notificationDTO.getTitle());
            targetUsers = new ArrayList<>();
            for (String login : userLogins) {
                userRepository.findOneByLogin(login).ifPresent(targetUsers::add);
            }
        }

        for (User user : targetUsers) {
            try {
                // Create a copy of notification DTO for each user
                NotificationDTO userNotification = new NotificationDTO();
                userNotification.setTitle(notificationDTO.getTitle());
                userNotification.setMessage(notificationDTO.getMessage());
                userNotification.setType(notificationDTO.getType());
                userNotification.setUserLogin(user.getLogin());

                notificationService.sendNotification(userNotification);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add("User " + user.getLogin() + ": " + e.getMessage());
                LOG.warn("Failed to send notification to user: {}", user.getLogin(), e);
            }
        }

        LOG.info("Bulk notification completed: {} success, {} failed", successCount, failCount);
        return createResultMap(successCount, failCount, errors);
    }

     /**
     * Imports entities from CSV data in a single transaction to ensure data integrity.
     * Supported entity types: "word", "grammar"
     *
     * @param entityType type of entity to import
     * @param csvData    CSV content with a header row
     * @return a result map with counts of success, failure, and any errors.
     * @throws IllegalArgumentException if the CSV data is invalid or an error occurs during processing.
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> importFromCsv(String entityType, String csvData) {
        LOG.info("Starting transactional CSV import for entity type: {}", entityType);

        if (csvData == null || csvData.trim().isEmpty()) {
            throw new IllegalArgumentException("CSV data cannot be empty.");
        }

        String[] lines = csvData.split("\\r?\\n");
        if (lines.length < 2) {
            throw new IllegalArgumentException("CSV must contain at least a header and one data row.");
        }

        // Process based on entity type
        try {
            switch (entityType.toLowerCase()) {
                case "word":
                    List<WordDTO> wordsToSave = new ArrayList<>();
                    for (int i = 1; i < lines.length; i++) {
                        String line = lines[i].trim();
                        if (line.isEmpty()) continue;
                        String[] fields = line.split(",");

                        if (fields.length < 3) {
                            throw new IllegalArgumentException(
                                String.format("Line %d: Insufficient fields. Expected format: text,pronunciation,meaning,partOfSpeech", i + 1)
                            );
                        }

                        WordDTO wordDTO = new WordDTO();
                        wordDTO.setText(fields[0].trim());
                        wordDTO.setPronunciation(fields.length > 1 ? fields[1].trim() : null);
                        wordDTO.setMeaning(fields.length > 2 ? fields[2].trim() : null);
                        wordDTO.setPartOfSpeech(fields.length > 3 ? fields[3].trim() : null);
                        wordsToSave.add(wordDTO);
                    }
                    wordService.saveAll(wordsToSave); // Assumes WordService has a `saveAll` method
                    return createResultMap(wordsToSave.size(), 0, List.of());

                case "grammar":
                    List<GrammarDTO> grammarsToSave = new ArrayList<>();
                    for (int i = 1; i < lines.length; i++) {
                        String line = lines[i].trim();
                        if (line.isEmpty()) continue;
                        String[] fields = line.split(",");

                        if (fields.length < 2) {
                            throw new IllegalArgumentException(
                                String.format("Line %d: Insufficient fields. Expected format: title,description", i + 1)
                            );
                        }

                        GrammarDTO grammarDTO = new GrammarDTO();
                        grammarDTO.setTitle(fields[0].trim());
                        grammarDTO.setDescription(fields.length > 1 ? fields[1].trim() : null);
                        grammarsToSave.add(grammarDTO);
                    }
                    grammarService.saveAll(grammarsToSave); // Assumes GrammarService has a `saveAll` method
                    return createResultMap(grammarsToSave.size(), 0, List.of());

                default:
                    throw new IllegalArgumentException("Unsupported entity type: " + entityType);
            }
        } catch (Exception e) {
            LOG.error("Transactional CSV import failed: {}", e.getMessage(), e);
            // The transaction will be rolled back automatically by Spring
            throw new RuntimeException("Failed to process CSV file. No data was imported. Reason: " + e.getMessage(), e);
        }
    }

    /**
     * Create result map for bulk operations
     */
    private Map<String, Object> createResultMap(int successCount, int failCount, List<String> errors) {
        Map<String, Object> result = new HashMap<>();
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("totalProcessed", successCount + failCount);
        if (!errors.isEmpty()) {
            result.put("errors", errors);
        }
        return result;
    }
}
