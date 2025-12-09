package com.langleague.service.dto;

import com.langleague.domain.enumeration.UploadStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DTO for the BookUpload entity.
 */
public class BookUploadDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 500)
    private String originalFileName;

    @NotNull
    @Size(max = 1000)
    private String fileUrl;

    @NotNull
    private UploadStatus status;

    private String chatbotResponse;

    private String errorMessage;

    private Instant uploadedAt;

    private Instant processedAt;

    private Integer retryCount;

    private Long uploadedById;

    private String uploadedByDisplayName;

    private Long createdBookId;

    private String createdBookTitle;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public UploadStatus getStatus() {
        return status;
    }

    public void setStatus(UploadStatus status) {
        this.status = status;
    }

    public String getChatbotResponse() {
        return chatbotResponse;
    }

    public void setChatbotResponse(String chatbotResponse) {
        this.chatbotResponse = chatbotResponse;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Instant getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(Instant processedAt) {
        this.processedAt = processedAt;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public Long getUploadedById() {
        return uploadedById;
    }

    public void setUploadedById(Long uploadedById) {
        this.uploadedById = uploadedById;
    }

    public String getUploadedByDisplayName() {
        return uploadedByDisplayName;
    }

    public void setUploadedByDisplayName(String uploadedByDisplayName) {
        this.uploadedByDisplayName = uploadedByDisplayName;
    }

    public Long getCreatedBookId() {
        return createdBookId;
    }

    public void setCreatedBookId(Long createdBookId) {
        this.createdBookId = createdBookId;
    }

    public String getCreatedBookTitle() {
        return createdBookTitle;
    }

    public void setCreatedBookTitle(String createdBookTitle) {
        this.createdBookTitle = createdBookTitle;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookUploadDTO)) {
            return false;
        }
        return id != null && id.equals(((BookUploadDTO) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "BookUploadDTO{" +
            "id=" +
            id +
            ", originalFileName='" +
            originalFileName +
            "'" +
            ", status='" +
            status +
            "'" +
            ", uploadedAt='" +
            uploadedAt +
            "'" +
            "}"
        );
    }
}
