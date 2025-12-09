package com.langleague.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.UserAchievement} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserAchievementDTO implements Serializable {

    private Long id;

    private Instant awardedTo;

    private AppUserDTO appUser;

    @NotNull(message = "Achievement is required")
    private AchievementDTO achievement;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getAwardedTo() {
        return awardedTo;
    }

    public void setAwardedTo(Instant awardedTo) {
        this.awardedTo = awardedTo;
    }

    public AppUserDTO getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUserDTO appUser) {
        this.appUser = appUser;
    }

    public AchievementDTO getAchievement() {
        return achievement;
    }

    public void setAchievement(AchievementDTO achievement) {
        this.achievement = achievement;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserAchievementDTO)) {
            return false;
        }

        UserAchievementDTO userAchievementDTO = (UserAchievementDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userAchievementDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserAchievementDTO{" +
            "id=" + getId() +
            ", awardedTo='" + getAwardedTo() + "'" +
            ", appUser=" + getAppUser() +
            ", achievement=" + getAchievement() +
            "}";
    }
}
