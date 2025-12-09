package com.langleague.service.dto;

import com.langleague.domain.enumeration.ExerciseType;
import java.io.Serializable;
import java.util.Map;

/**
 * A DTO for chapter statistics.
 */
public class ChapterStatisticsDTO implements Serializable {

    private Long chapterId;
    private Long totalExercises;
    private Double averageScore;
    private Map<ExerciseType, Long> countByType;
    private Map<ExerciseType, Double> averageScoreByType;

    public ChapterStatisticsDTO() {}

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public Long getTotalExercises() {
        return totalExercises;
    }

    public void setTotalExercises(Long totalExercises) {
        this.totalExercises = totalExercises;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Map<ExerciseType, Long> getCountByType() {
        return countByType;
    }

    public void setCountByType(Map<ExerciseType, Long> countByType) {
        this.countByType = countByType;
    }

    public Map<ExerciseType, Double> getAverageScoreByType() {
        return averageScoreByType;
    }

    public void setAverageScoreByType(Map<ExerciseType, Double> averageScoreByType) {
        this.averageScoreByType = averageScoreByType;
    }

    @Override
    public String toString() {
        return (
            "ChapterStatisticsDTO{" +
            "chapterId=" +
            chapterId +
            ", totalExercises=" +
            totalExercises +
            ", averageScore=" +
            averageScore +
            ", countByType=" +
            countByType +
            ", averageScoreByType=" +
            averageScoreByType +
            '}'
        );
    }
}
