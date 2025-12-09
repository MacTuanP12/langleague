package com.langleague.service.dto;

import com.langleague.domain.enumeration.Level;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for detailed Book information including chapters.
 * Use case 16: View assigned lessons with details
 */
public class BookDetailDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String title;

    private Level level;

    @Lob
    private String description;

    @Size(max = 255)
    private String thumbnail;

    private List<ChapterDTO> chapters;

    private Integer totalChapters;

    private Long totalReviews;

    private Double averageRating;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public List<ChapterDTO> getChapters() {
        return chapters;
    }

    public void setChapters(List<ChapterDTO> chapters) {
        this.chapters = chapters;
    }

    public Integer getTotalChapters() {
        return totalChapters;
    }

    public void setTotalChapters(Integer totalChapters) {
        this.totalChapters = totalChapters;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookDetailDTO)) {
            return false;
        }

        BookDetailDTO bookDetailDTO = (BookDetailDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, bookDetailDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return (
            "BookDetailDTO{" +
            "id=" +
            getId() +
            ", title='" +
            getTitle() +
            "'" +
            ", level='" +
            getLevel() +
            "'" +
            ", description='" +
            getDescription() +
            "'" +
            ", thumbnail='" +
            getThumbnail() +
            "'" +
            ", totalChapters=" +
            getTotalChapters() +
            ", totalReviews=" +
            getTotalReviews() +
            ", averageRating=" +
            getAverageRating() +
            "}"
        );
    }
}
