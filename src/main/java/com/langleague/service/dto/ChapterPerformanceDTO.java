package com.langleague.service.dto;

import java.io.Serializable;

/**
 * DTO for Chapter Performance metrics.
 */
public class ChapterPerformanceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long chapterId;
    private String chapterName;
    private Integer completions; // Number of users who completed this chapter
    private Double avgScore; // Average score of exercises in this chapter
    private Double dropoffRate; // % of users who started but didn't complete

    public ChapterPerformanceDTO() {}

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public String getChapterName() {
        return chapterName;
    }

    public void setChapterName(String chapterName) {
        this.chapterName = chapterName;
    }

    public Integer getCompletions() {
        return completions;
    }

    public void setCompletions(Integer completions) {
        this.completions = completions;
    }

    public Double getAvgScore() {
        return avgScore;
    }

    public void setAvgScore(Double avgScore) {
        this.avgScore = avgScore;
    }

    public Double getDropoffRate() {
        return dropoffRate;
    }

    public void setDropoffRate(Double dropoffRate) {
        this.dropoffRate = dropoffRate;
    }

    @Override
    public String toString() {
        return (
            "ChapterPerformanceDTO{" +
            "chapterId=" +
            chapterId +
            ", chapterName='" +
            chapterName +
            '\'' +
            ", completions=" +
            completions +
            ", avgScore=" +
            avgScore +
            ", dropoffRate=" +
            dropoffRate +
            '}'
        );
    }
}
