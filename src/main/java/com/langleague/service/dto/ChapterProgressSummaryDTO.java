package com.langleague.service.dto;

import java.io.Serializable;

/**
 * DTO for aggregated chapter progress data
 * Used to optimize getBookProgress query (prevents N+1 query problem)
 */
public class ChapterProgressSummaryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long chapterId;
    private String chapterTitle;
    private Integer orderIndex;
    private Integer totalExercises;
    private Integer completedExercises;

    public ChapterProgressSummaryDTO() {}

    public ChapterProgressSummaryDTO(
        Long chapterId,
        String chapterTitle,
        Integer orderIndex,
        Integer totalExercises,
        Integer completedExercises
    ) {
        this.chapterId = chapterId;
        this.chapterTitle = chapterTitle;
        this.orderIndex = orderIndex;
        this.totalExercises = totalExercises;
        this.completedExercises = completedExercises;
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

    @Override
    public String toString() {
        return (
            "ChapterProgressSummaryDTO{" +
            "chapterId=" +
            chapterId +
            ", chapterTitle='" +
            chapterTitle +
            '\'' +
            ", orderIndex=" +
            orderIndex +
            ", totalExercises=" +
            totalExercises +
            ", completedExercises=" +
            completedExercises +
            '}'
        );
    }
}
