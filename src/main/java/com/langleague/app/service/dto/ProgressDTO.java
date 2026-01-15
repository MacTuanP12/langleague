package com.langleague.app.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Progress} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProgressDTO implements Serializable {

    private Long id;

    @NotNull
    private Boolean isCompleted;

    @NotNull
    private Instant updatedAt;

    private Boolean isBookmarked;

    @Min(0)
    @Max(100)
    private Integer score;

    private Instant lastAccessedAt;

    @Min(0)
    @Max(100)
    private Integer completionPercentage;

    private Boolean isVocabularyFinished;

    private Boolean isGrammarFinished;

    private Boolean isExerciseFinished;

    private Long userProfileId;

    private Long unitId;

    private UnitDTO unit;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsBookmarked() {
        return isBookmarked;
    }

    public void setIsBookmarked(Boolean isBookmarked) {
        this.isBookmarked = isBookmarked;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Instant getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(Instant lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Integer getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Boolean getIsVocabularyFinished() {
        return isVocabularyFinished;
    }

    public void setIsVocabularyFinished(Boolean isVocabularyFinished) {
        this.isVocabularyFinished = isVocabularyFinished;
    }

    public Boolean getIsGrammarFinished() {
        return isGrammarFinished;
    }

    public void setIsGrammarFinished(Boolean isGrammarFinished) {
        this.isGrammarFinished = isGrammarFinished;
    }

    public Boolean getIsExerciseFinished() {
        return isExerciseFinished;
    }

    public void setIsExerciseFinished(Boolean isExerciseFinished) {
        this.isExerciseFinished = isExerciseFinished;
    }

    public Long getUserProfileId() {
        return userProfileId;
    }

    public void setUserProfileId(Long userProfileId) {
        this.userProfileId = userProfileId;
    }

    public Long getUnitId() {
        return unitId;
    }

    public void setUnitId(Long unitId) {
        this.unitId = unitId;
    }

    public UnitDTO getUnit() {
        return unit;
    }

    public void setUnit(UnitDTO unit) {
        this.unit = unit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProgressDTO)) {
            return false;
        }

        ProgressDTO progressDTO = (ProgressDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, progressDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return (
            "ProgressDTO{" +
            "id=" +
            getId() +
            ", isCompleted='" +
            getIsCompleted() +
            "'" +
            ", updatedAt='" +
            getUpdatedAt() +
            "'" +
            ", isBookmarked='" +
            getIsBookmarked() +
            "'" +
            ", score=" +
            getScore() +
            ", lastAccessedAt='" +
            getLastAccessedAt() +
            "'" +
            ", completionPercentage=" +
            getCompletionPercentage() +
            ", isVocabularyFinished='" +
            getIsVocabularyFinished() +
            "'" +
            ", isGrammarFinished='" +
            getIsGrammarFinished() +
            "'" +
            ", isExerciseFinished='" +
            getIsExerciseFinished() +
            "'" +
            ", userProfileId=" +
            getUserProfileId() +
            ", unitId=" +
            getUnitId() +
            "}"
        );
    }
}
