package com.langleague.service.dto;

import java.io.Serializable;

/**
 * A DTO for exercise statistics.
 */
public class ExerciseStatisticsDTO implements Serializable {

    private Long totalExercises;
    private Long perfectScores;
    private Double averageScore;
    private Long listeningCount;
    private Long speakingCount;
    private Long readingCount;
    private Long writingCount;
    private Double listeningAverage;
    private Double speakingAverage;
    private Double readingAverage;
    private Double writingAverage;

    public ExerciseStatisticsDTO() {}

    public Long getTotalExercises() {
        return totalExercises;
    }

    public void setTotalExercises(Long totalExercises) {
        this.totalExercises = totalExercises;
    }

    public Long getPerfectScores() {
        return perfectScores;
    }

    public void setPerfectScores(Long perfectScores) {
        this.perfectScores = perfectScores;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Long getListeningCount() {
        return listeningCount;
    }

    public void setListeningCount(Long listeningCount) {
        this.listeningCount = listeningCount;
    }

    public Long getSpeakingCount() {
        return speakingCount;
    }

    public void setSpeakingCount(Long speakingCount) {
        this.speakingCount = speakingCount;
    }

    public Long getReadingCount() {
        return readingCount;
    }

    public void setReadingCount(Long readingCount) {
        this.readingCount = readingCount;
    }

    public Long getWritingCount() {
        return writingCount;
    }

    public void setWritingCount(Long writingCount) {
        this.writingCount = writingCount;
    }

    public Double getListeningAverage() {
        return listeningAverage;
    }

    public void setListeningAverage(Double listeningAverage) {
        this.listeningAverage = listeningAverage;
    }

    public Double getSpeakingAverage() {
        return speakingAverage;
    }

    public void setSpeakingAverage(Double speakingAverage) {
        this.speakingAverage = speakingAverage;
    }

    public Double getReadingAverage() {
        return readingAverage;
    }

    public void setReadingAverage(Double readingAverage) {
        this.readingAverage = readingAverage;
    }

    public Double getWritingAverage() {
        return writingAverage;
    }

    public void setWritingAverage(Double writingAverage) {
        this.writingAverage = writingAverage;
    }

    @Override
    public String toString() {
        return (
            "ExerciseStatisticsDTO{" +
            "totalExercises=" +
            totalExercises +
            ", perfectScores=" +
            perfectScores +
            ", averageScore=" +
            averageScore +
            ", listeningCount=" +
            listeningCount +
            ", speakingCount=" +
            speakingCount +
            ", readingCount=" +
            readingCount +
            ", writingCount=" +
            writingCount +
            ", listeningAverage=" +
            listeningAverage +
            ", speakingAverage=" +
            speakingAverage +
            ", readingAverage=" +
            readingAverage +
            ", writingAverage=" +
            writingAverage +
            '}'
        );
    }
}
