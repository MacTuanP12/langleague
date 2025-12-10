package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.ReadingOption} entity.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReadingOptionDTO implements Serializable {

    private Long id;

    @Size(max = 10)
    private String label;

    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Content cannot exceed 1000 characters")
    private String content;

    private Boolean isCorrect;

    private Integer orderIndex;

    private ReadingExerciseDTO readingExercise;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public ReadingExerciseDTO getReadingExercise() {
        return readingExercise;
    }

    public void setReadingExercise(ReadingExerciseDTO readingExercise) {
        this.readingExercise = readingExercise;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReadingOptionDTO)) {
            return false;
        }

        ReadingOptionDTO readingOptionDTO = (ReadingOptionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, readingOptionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReadingOptionDTO{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", content='" + getContent() + "'" +
            ", isCorrect='" + getIsCorrect() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", readingExercise=" + getReadingExercise() +
            "}";
    }
}
