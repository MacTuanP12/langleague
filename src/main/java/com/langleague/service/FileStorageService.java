package com.langleague.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for storing and retrieving files.
 */
@Service
public class FileStorageService {

    private static final Logger LOG = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${application.file-storage.base-path:uploads}")
    private String baseStoragePath;

    /**
     * Store a file in the specified folder
     *
     * @param file the file to store
     * @param folder the folder to store in (avatars, audio, images, documents)
     * @param userLogin optional user login for user-specific files
     * @return the stored file name
     * @throws IOException if file cannot be stored
     */
    public String storeFile(MultipartFile file, String folder, String userLogin) throws IOException {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new IOException("Invalid file path sequence: " + originalFileName);
            }

            // Generate unique file name
            String fileExtension = getFileExtension(originalFileName);
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // If user-specific, add user prefix
            if (userLogin != null) {
                uniqueFileName = userLogin + "_" + uniqueFileName;
            }

            // Create folder if not exists
            Path folderPath = Path.of(baseStoragePath, folder);
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            // Copy file to the target location
            Path targetLocation = folderPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            LOG.info("File stored successfully: {}/{}", folder, uniqueFileName);
            return uniqueFileName;
        } catch (IOException ex) {
            LOG.error("Failed to store file {}: {}", originalFileName, ex.getMessage());
            throw new IOException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    /**
     * Load file as Resource
     *
     * @param fileName the file name
     * @param folder the folder name
     * @return the file as Resource
     * @throws IOException if file cannot be found
     */
    public Resource loadFileAsResource(String fileName, String folder) throws IOException {
        try {
            Path filePath = Path.of(baseStoragePath, folder).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IOException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            LOG.error("File not found {}: {}", fileName, ex.getMessage());
            throw new IOException("File not found: " + fileName, ex);
        }
    }

    /**
     * Delete a file
     *
     * @param fileName the file name to delete
     * @param folder the folder name
     * @throws IOException if file cannot be deleted
     */
    public void deleteFile(String fileName, String folder) throws IOException {
        try {
            Path filePath = Path.of(baseStoragePath, folder).resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
            LOG.info("File deleted successfully: {}/{}", folder, fileName);
        } catch (IOException ex) {
            LOG.error("Failed to delete file {}: {}", fileName, ex.getMessage());
            throw new IOException("Could not delete file: " + fileName, ex);
        }
    }

    /**
     * Get file extension
     */
    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex);
    }
}
