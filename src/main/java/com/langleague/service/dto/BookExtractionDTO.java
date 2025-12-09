package com.langleague.service.dto;

import com.langleague.domain.enumeration.Level;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.List;

/**
 * DTO for chatbot book extraction response
 */
public class BookExtractionDTO implements Serializable {

    @NotNull
    @Size(max = 255)
    private String title;

    @NotNull
    private Level level;

    @Size(max = 5000)
    private String description;

    private String thumbnailUrl;

    private List<ChapterExtractionDTO> chapters;

    // Nested DTO for chapters
    public static class ChapterExtractionDTO implements Serializable {

        @NotNull
        @Size(max = 255)
        private String title;

        @Size(max = 2000)
        private String description;

        private Integer orderIndex;

        private List<ExerciseExtractionDTO> exercises;

        // Getters and Setters

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Integer getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
        }

        public List<ExerciseExtractionDTO> getExercises() {
            return exercises;
        }

        public void setExercises(List<ExerciseExtractionDTO> exercises) {
            this.exercises = exercises;
        }
    }

    // Nested DTO for exercises
    public static class ExerciseExtractionDTO implements Serializable {

        @NotNull
        private String type; // LISTENING, READING, SPEAKING, WRITING

        @Size(max = 500)
        private String title;

        private String content;

        private Integer orderIndex;

        // Getters and Setters

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Integer getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
        }
    }

    // Getters and Setters

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

    public List<ChapterExtractionDTO> getChapters() {
        return chapters;
    }

    public void setChapters(List<ChapterExtractionDTO> chapters) {
        this.chapters = chapters;
    }

    @Override
    public String toString() {
        return (
            "BookExtractionDTO{" +
            "title='" +
            title +
            "'" +
            ", level='" +
            level +
            "'" +
            ", chaptersCount=" +
            (chapters != null ? chapters.size() : 0) +
            "}"
        );
    }
}
