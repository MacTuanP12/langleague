package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.langleague.domain.enumeration.LearningStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.UserChapter} entity.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserChapterDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant savedAt;

    @NotNull
    private LearningStatus learningStatus;

    private Instant lastAccessedAt;

    private Boolean isFavorite;

    private String notes;

    private String tags;

    private AppUserDTO appUser;

    private ChapterDTO chapter;

    // Extended fields for display
    private Long chapterId;

    private String chapterTitle;

    private Integer chapterOrderIndex;

    private Long bookId;

    private String bookTitle;

    private String bookThumbnail;

    private String bookLevel;

    // Progress info from ChapterProgress (if exists)
    private Integer progressPercent;

    private Boolean completed;

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

    public Instant getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(Instant lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public AppUserDTO getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUserDTO appUser) {
        this.appUser = appUser;
    }

    public ChapterDTO getChapter() {
        return chapter;
    }

    public void setChapter(ChapterDTO chapter) {
        this.chapter = chapter;
    }

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public String getChapterTitle() {
        return chapterTitle;
    }

    public void setChapterTitle(String chapterTitle) {
        this.chapterTitle = chapterTitle;
    }

    public Integer getChapterOrderIndex() {
        return chapterOrderIndex;
    }

    public void setChapterOrderIndex(Integer chapterOrderIndex) {
        this.chapterOrderIndex = chapterOrderIndex;
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

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserChapterDTO)) {
            return false;
        }

        UserChapterDTO userChapterDTO = (UserChapterDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userChapterDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return (
            "UserChapterDTO{" +
            "id=" +
            getId() +
            ", savedAt='" +
            getSavedAt() +
            "'" +
            ", learningStatus='" +
            getLearningStatus() +
            "'" +
            ", lastAccessedAt='" +
            getLastAccessedAt() +
            "'" +
            ", isFavorite='" +
            getIsFavorite() +
            "'" +
            ", notes='" +
            getNotes() +
            "'" +
            ", tags='" +
            getTags() +
            "'" +
            ", appUser=" +
            getAppUser() +
            ", chapter=" +
            getChapter() +
            "}"
        );
    }
}
