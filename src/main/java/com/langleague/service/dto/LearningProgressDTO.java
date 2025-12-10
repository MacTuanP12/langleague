package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;

/**
 * DTO for learning progress statistics.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearningProgressDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long totalWords;
    private Long memorizedWords;
    private Long learningWords;
    private Integer memorizedPercentage;

    public LearningProgressDTO() {}

    public Long getTotalWords() {
        return totalWords;
    }

    public void setTotalWords(Long totalWords) {
        this.totalWords = totalWords;
    }

    public Long getMemorizedWords() {
        return memorizedWords;
    }

    public void setMemorizedWords(Long memorizedWords) {
        this.memorizedWords = memorizedWords;
    }

    public Long getLearningWords() {
        return learningWords;
    }

    public void setLearningWords(Long learningWords) {
        this.learningWords = learningWords;
    }

    public Integer getMemorizedPercentage() {
        return memorizedPercentage;
    }

    public void setMemorizedPercentage(Integer memorizedPercentage) {
        this.memorizedPercentage = memorizedPercentage;
    }

    @Override
    public String toString() {
        return (
            "LearningProgressDTO{" +
            "totalWords=" +
            totalWords +
            ", memorizedWords=" +
            memorizedWords +
            ", learningWords=" +
            learningWords +
            ", memorizedPercentage=" +
            memorizedPercentage +
            '}'
        );
    }
}
