package com.langleague.service.dto;

import java.io.Serializable;
import java.util.List;

/**
 * A DTO for book learning progress.
 */
public class BookProgressDTO implements Serializable {

    private Long bookId;
    private String bookTitle;
    private Double overallProgress; // 0-100
    private Integer totalChapters;
    private Integer completedChapters;
    private Integer totalExercises;
    private Integer completedExercises;
    private Double averageScore;
    private List<ChapterProgressItemDTO> chapterProgress;

    public BookProgressDTO() {}

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

    public Double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(Double overallProgress) {
        this.overallProgress = overallProgress;
    }

    public Integer getTotalChapters() {
        return totalChapters;
    }

    public void setTotalChapters(Integer totalChapters) {
        this.totalChapters = totalChapters;
    }

    public Integer getCompletedChapters() {
        return completedChapters;
    }

    public void setCompletedChapters(Integer completedChapters) {
        this.completedChapters = completedChapters;
    }

    public Integer getTotalExercises() {
        return totalExercises;
    }

    public void setTotalExercises(Integer totalExercises) {
        this.totalExercises = totalExercises;
    }

    public Integer getCompletedExercises() {
        return completedExercises;
    }

    public void setCompletedExercises(Integer completedExercises) {
        this.completedExercises = completedExercises;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public List<ChapterProgressItemDTO> getChapterProgress() {
        return chapterProgress;
    }

    public void setChapterProgress(List<ChapterProgressItemDTO> chapterProgress) {
        this.chapterProgress = chapterProgress;
    }

    @Override
    public String toString() {
        return (
            "BookProgressDTO{" +
            "bookId=" +
            bookId +
            ", bookTitle='" +
            bookTitle +
            '\'' +
            ", overallProgress=" +
            overallProgress +
            ", completedChapters=" +
            completedChapters +
            "/" +
            totalChapters +
            ", completedExercises=" +
            completedExercises +
            "/" +
            totalExercises +
            ", averageScore=" +
            averageScore +
            '}'
        );
    }

    /**
     * Inner DTO for chapter progress item
     */
    public static class ChapterProgressItemDTO implements Serializable {

        private Long chapterId;
        private String chapterTitle;
        private Integer orderIndex;
        private Integer totalExercises;
        private Integer completedExercises;
        private Double progressPercentage;
        private Double averageScore;
        private Boolean isCompleted;

        public ChapterProgressItemDTO() {}

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

        public Integer getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
        }

        public Integer getTotalExercises() {
            return totalExercises;
        }

        public void setTotalExercises(Integer totalExercises) {
            this.totalExercises = totalExercises;
        }

        public Integer getCompletedExercises() {
            return completedExercises;
        }

        public void setCompletedExercises(Integer completedExercises) {
            this.completedExercises = completedExercises;
        }

        public Double getProgressPercentage() {
            return progressPercentage;
        }

        public void setProgressPercentage(Double progressPercentage) {
            this.progressPercentage = progressPercentage;
        }

        public Double getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(Double averageScore) {
            this.averageScore = averageScore;
        }

        public Boolean getIsCompleted() {
            return isCompleted;
        }

        public void setIsCompleted(Boolean isCompleted) {
            this.isCompleted = isCompleted;
        }

        @Override
        public String toString() {
            return (
                "ChapterProgressItemDTO{" +
                "chapterId=" +
                chapterId +
                ", chapterTitle='" +
                chapterTitle +
                '\'' +
                ", orderIndex=" +
                orderIndex +
                ", completedExercises=" +
                completedExercises +
                "/" +
                totalExercises +
                ", progressPercentage=" +
                progressPercentage +
                ", averageScore=" +
                averageScore +
                ", isCompleted=" +
                isCompleted +
                '}'
            );
        }
    }
}
