package com.langleague.service.migration;

import com.langleague.domain.User;
import com.langleague.repository.UserRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * One-time migration tool to convert User base64 images to file storage
 *
 * USAGE:
 * 1. Enable this component by activating 'migrate-user-images' profile
 * 2. Run: mvn spring-boot:run -Dspring-boot.run.profiles=migrate-user-images
 * 3. After successful migration, apply Liquibase migration
 *
 * This component is disabled by default to prevent accidental execution
 */
@Component
@Profile("migrate-user-images") // Only runs when this profile is active
public class Base64ImageMigrationTool implements CommandLineRunner {

    private static final Logger LOG = LoggerFactory.getLogger(Base64ImageMigrationTool.class);
    private static final String AVATAR_FOLDER = "avatars";

    @Value("${application.file-storage.base-path:uploads}")
    private String baseStoragePath;

    private final UserRepository userRepository;

    public Base64ImageMigrationTool(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        LOG.info("========================================");
        LOG.info("Starting User Image Migration Tool");
        LOG.info("========================================");

        // Find all users with base64 images
        List<User> usersWithBase64Images = userRepository
            .findAll()
            .stream()
            .filter(user -> user.getImageUrl() != null && user.getImageUrl().startsWith("data:image/"))
            .toList();

        LOG.info("Found {} users with base64 images", usersWithBase64Images.size());

        if (usersWithBase64Images.isEmpty()) {
            LOG.info("No migration needed. All user images are already using file URLs.");
            return;
        }

        // Create avatars directory if not exists
        Path avatarPath = Paths.get(baseStoragePath, AVATAR_FOLDER);
        if (!Files.exists(avatarPath)) {
            Files.createDirectories(avatarPath);
            LOG.info("Created directory: {}", avatarPath);
        }

        int successCount = 0;
        int failureCount = 0;

        // Process each user
        for (User user : usersWithBase64Images) {
            try {
                String newImageUrl = convertBase64ToFile(user);
                user.setImageUrl(newImageUrl);
                userRepository.save(user);

                successCount++;
                LOG.info("✓ Migrated user {}: {} -> {}", user.getLogin(), truncateString(user.getImageUrl(), 50), newImageUrl);
            } catch (Exception e) {
                failureCount++;
                LOG.error("✗ Failed to migrate user {}: {}", user.getLogin(), e.getMessage());
            }
        }

        LOG.info("========================================");
        LOG.info("Migration Complete!");
        LOG.info("Success: {}", successCount);
        LOG.info("Failures: {}", failureCount);
        LOG.info("Total: {}", usersWithBase64Images.size());
        LOG.info("========================================");

        if (failureCount > 0) {
            LOG.warn("Some migrations failed. Review logs and retry failed users.");
        }
    }

    /**
     * Convert base64 image to file and return file URL
     */
    private String convertBase64ToFile(User user) throws IOException {
        String base64Image = user.getImageUrl();

        // Extract image format and data
        String[] parts = base64Image.split(",");
        if (parts.length != 2) {
            throw new IOException("Invalid base64 format");
        }

        String imageFormat = extractImageFormat(parts[0]);
        String base64Data = parts[1];

        // Decode base64
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        // Generate unique filename
        String fileName = String.format("user_%d_%s.%s", user.getId(), UUID.randomUUID().toString().substring(0, 8), imageFormat);

        // Write file
        Path filePath = Paths.get(baseStoragePath, AVATAR_FOLDER, fileName);
        Files.write(filePath, imageBytes);

        LOG.debug("Wrote file: {} ({} bytes)", filePath, imageBytes.length);

        // Return URL path
        return String.format("/uploads/%s/%s", AVATAR_FOLDER, fileName);
    }

    /**
     * Extract image format from data URI
     */
    private String extractImageFormat(String dataUriPrefix) {
        // data:image/png;base64 -> png
        if (dataUriPrefix.contains("image/png")) return "png";
        if (dataUriPrefix.contains("image/jpg")) return "jpg";
        if (dataUriPrefix.contains("image/jpeg")) return "jpeg";
        if (dataUriPrefix.contains("image/gif")) return "gif";
        if (dataUriPrefix.contains("image/webp")) return "webp";
        return "png"; // default
    }

    /**
     * Truncate string for logging
     */
    private String truncateString(String str, int maxLength) {
        if (str == null) return "null";
        if (str.length() <= maxLength) return str;
        return str.substring(0, maxLength) + "...";
    }
}
