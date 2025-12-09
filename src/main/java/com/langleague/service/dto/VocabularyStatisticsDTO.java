package com.langleague.service.dto;

import java.io.Serializable;

/**
 * A DTO for vocabulary statistics.
 */
public class VocabularyStatisticsDTO implements Serializable {

    private Long totalWords;
    private Long memorizedWords;
    private Long wordsToReviewToday;

    public VocabularyStatisticsDTO() {}

    public VocabularyStatisticsDTO(Long totalWords, Long memorizedWords, Long wordsToReviewToday) {
        this.totalWords = totalWords;
        this.memorizedWords = memorizedWords;
        this.wordsToReviewToday = wordsToReviewToday;
    }

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

    public Long getWordsToReviewToday() {
        return wordsToReviewToday;
    }

    public void setWordsToReviewToday(Long wordsToReviewToday) {
        this.wordsToReviewToday = wordsToReviewToday;
    }

    @Override
    public String toString() {
        return (
            "VocabularyStatisticsDTO{" +
            "totalWords=" +
            totalWords +
            ", memorizedWords=" +
            memorizedWords +
            ", wordsToReviewToday=" +
            wordsToReviewToday +
            '}'
        );
    }
}
