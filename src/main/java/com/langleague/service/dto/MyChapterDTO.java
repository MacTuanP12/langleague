package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DTO for user's chapters with progress information.
 * Used to display "My Chapters" page showing chapters user has saved and is learning.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MyChapterDTO implements Serializable {

    private Long chapterId;
    private String chapterTitle;
    private Integer chapterOrderIndex;
    private Long bookId;
    private String bookTitle;
    private String bookThumbnail;
    private String bookLevel;
    private Integer progressPercent;
    private Boolean completed;
    private Instant lastAccessed;

    public MyChapterDTO() {}

    public MyChapterDTO(
        Long chapterId,
        String chapterTitle,
        Integer chapterOrderIndex,
        Long bookId,
        String bookTitle,
        String bookThumbnail,
        String bookLevel,
        Integer progressPercent,
        Boolean completed,
        Instant lastAccessed
    ) {
        this.chapterId = chapterId;
        this.chapterTitle = chapterTitle;
        this.chapterOrderIndex = chapterOrderIndex;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookThumbnail = bookThumbnail;
        this.bookLevel = bookLevel;
        this.progressPercent = progressPercent;
        this.completed = completed;
        this.lastAccessed = lastAccessed;
    }

    // Getters and Setters

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

    public Instant getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(Instant lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    @Override
    public String toString() {
        return (
            "MyChapterDTO{" +
            "chapterId=" +
            chapterId +
            ", chapterTitle='" +
            chapterTitle +
            '\'' +
            ", chapterOrderIndex=" +
            chapterOrderIndex +
            ", bookId=" +
            bookId +
            ", bookTitle='" +
            bookTitle +
            '\'' +
            ", progressPercent=" +
            progressPercent +
            ", completed=" +
            completed +
            ", lastAccessed=" +
            lastAccessed +
            '}'
        );
    }
}
