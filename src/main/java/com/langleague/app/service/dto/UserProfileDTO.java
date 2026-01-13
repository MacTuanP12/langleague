package com.langleague.app.service.dto;

import com.langleague.app.domain.enumeration.ThemeMode;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.UserProfile} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfileDTO implements Serializable {

    private Long id;

    private Integer streakCount;

    private Instant lastLearningDate;

    @Lob
    private String bio;

    private ThemeMode theme;

    @NotNull
    private UserDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStreakCount() {
        return streakCount;
    }

    public void setStreakCount(Integer streakCount) {
        this.streakCount = streakCount;
    }

    public Instant getLastLearningDate() {
        return lastLearningDate;
    }

    public void setLastLearningDate(Instant lastLearningDate) {
        this.lastLearningDate = lastLearningDate;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public ThemeMode getTheme() {
        return theme;
    }

    public void setTheme(ThemeMode theme) {
        this.theme = theme;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfileDTO)) {
            return false;
        }

        UserProfileDTO userProfileDTO = (UserProfileDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userProfileDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfileDTO{" +
            "id=" + getId() +
            ", streakCount=" + getStreakCount() +
            ", lastLearningDate='" + getLastLearningDate() + "'" +
            ", bio='" + getBio() + "'" +
            ", theme='" + getTheme() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
