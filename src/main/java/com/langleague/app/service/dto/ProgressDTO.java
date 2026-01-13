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

    private Integer score;

    private Long userProfileId;

    private Long unitId;

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
            ", userProfileId=" +
            getUserProfileId() +
            ", unitId=" +
            getUnitId() +
            "}"
        );
    }
}
