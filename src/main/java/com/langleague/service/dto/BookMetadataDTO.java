package com.langleague.service.dto;

import com.langleague.domain.enumeration.Level;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 * DTO for manual book metadata input (when not using AI)
 */
public class BookMetadataDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Size(min = 1, max = 255)
    private String title;

    @NotNull
    private Level level;

    @Size(max = 5000)
    private String description;

    @Size(max = 500)
    private String thumbnailUrl;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    @Override
    public String toString() {
        return (
            "BookMetadataDTO{" +
            "title='" +
            title +
            '\'' +
            ", level=" +
            level +
            ", description='" +
            description +
            '\'' +
            ", thumbnailUrl='" +
            thumbnailUrl +
            '\'' +
            '}'
        );
    }
}
