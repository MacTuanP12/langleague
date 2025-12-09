package com.langleague.service.dto;

import com.langleague.domain.enumeration.LearningStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DTO for the UserBook entity.
 */
public class UserBookDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant savedAt;

    @NotNull
    private LearningStatus learningStatus;

    private Long currentChapterId;

    private String currentChapterTitle;

    private Instant lastAccessedAt;

    private Double progressPercentage;

    private Boolean isFavorite;

    private Long appUserId;

    private String appUserDisplayName;

    private Long bookId;

    private String bookTitle;

    private String bookThumbnail;

    private String bookLevel;

    private String bookDescription;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(Instant savedAt) {
        this.savedAt = savedAt;
    }

    public LearningStatus getLearningStatus() {
        return learningStatus;
    }

    public void setLearningStatus(LearningStatus learningStatus) {
        this.learningStatus = learningStatus;
    }

    public Long getCurrentChapterId() {
        return currentChapterId;
    }

    public void setCurrentChapterId(Long currentChapterId) {
        this.currentChapterId = currentChapterId;
    }

    public String getCurrentChapterTitle() {
        return currentChapterTitle;
    }

    public void setCurrentChapterTitle(String currentChapterTitle) {
        this.currentChapterTitle = currentChapterTitle;
    }

    public Instant getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(Instant lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public Long getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(Long appUserId) {
        this.appUserId = appUserId;
    }

    public String getAppUserDisplayName() {
        return appUserDisplayName;
    }

    public void setAppUserDisplayName(String appUserDisplayName) {
        this.appUserDisplayName = appUserDisplayName;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getBookThumbnail() {
        return bookThumbnail;
    }

    public void setBookThumbnail(String bookThumbnail) {
        this.bookThumbnail = bookThumbnail;
    }

    public String getBookLevel() {
        return bookLevel;
    }

    public void setBookLevel(String bookLevel) {
        this.bookLevel = bookLevel;
    }

    public String getBookDescription() {
        return bookDescription;
    }

    public void setBookDescription(String bookDescription) {
        this.bookDescription = bookDescription;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserBookDTO)) {
            return false;
        }
        return id != null && id.equals(((UserBookDTO) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "UserBookDTO{" +
            "id=" +
            id +
            ", bookTitle='" +
            bookTitle +
            "'" +
            ", learningStatus='" +
            learningStatus +
            "'" +
            ", progressPercentage=" +
            progressPercentage +
            "}"
        );
    }
}
