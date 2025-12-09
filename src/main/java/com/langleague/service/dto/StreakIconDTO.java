package com.langleague.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.StreakIcon} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StreakIconDTO implements Serializable {

    private Long id;

    @Size(max = 50)
    private String level;

    private Integer minDays;

    @Size(max = 256)
    private String iconPath;

    @Size(max = 255)
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getMinDays() {
        return minDays;
    }

    public void setMinDays(Integer minDays) {
        this.minDays = minDays;
    }

    public String getIconPath() {
        return iconPath;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StreakIconDTO)) {
            return false;
        }

        StreakIconDTO streakIconDTO = (StreakIconDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, streakIconDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StreakIconDTO{" +
            "id=" + getId() +
            ", level='" + getLevel() + "'" +
            ", minDays=" + getMinDays() +
            ", iconPath='" + getIconPath() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
