package com.langleague.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.LearningStreak} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LearningStreakDTO implements Serializable {

    private Long id;

    private Integer currentStreak;

    private Integer longestStreak;

    private Instant lastStudyDate;

    @Size(max = 256)
    private String iconUrl;

    private AppUserDTO appUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public Instant getLastStudyDate() {
        return lastStudyDate;
    }

    public void setLastStudyDate(Instant lastStudyDate) {
        this.lastStudyDate = lastStudyDate;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public AppUserDTO getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUserDTO appUser) {
        this.appUser = appUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LearningStreakDTO)) {
            return false;
        }

        LearningStreakDTO learningStreakDTO = (LearningStreakDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, learningStreakDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LearningStreakDTO{" +
            "id=" + getId() +
            ", currentStreak=" + getCurrentStreak() +
            ", longestStreak=" + getLongestStreak() +
            ", lastStudyDate='" + getLastStudyDate() + "'" +
            ", iconUrl='" + getIconUrl() + "'" +
            ", appUser=" + getAppUser() +
            "}";
    }
}
