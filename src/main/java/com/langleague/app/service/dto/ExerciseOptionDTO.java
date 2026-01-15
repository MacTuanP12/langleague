package com.langleague.app.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.ExerciseOption} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExerciseOptionDTO implements Serializable {

    private Long id;

    @NotNull
    @NotBlank
    private String optionText;

    @NotNull
    private Boolean isCorrect;

    @Min(0)
    private Integer orderIndex;

    /**
     * Reference to parent exercise.
     * Note: This field is NOT populated when fetched as part of exercise.options
     * to avoid circular references during JSON serialization.
     * Only populated when fetching individual options.
     */
    private ExerciseDTO exercise;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
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

    public ExerciseDTO getExercise() {
        return exercise;
    }

    public void setExercise(ExerciseDTO exercise) {
        this.exercise = exercise;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExerciseOptionDTO)) {
            return false;
        }

        ExerciseOptionDTO exerciseOptionDTO = (ExerciseOptionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, exerciseOptionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExerciseOptionDTO{" +
            "id=" + getId() +
            ", optionText='" + getOptionText() + "'" +
            ", isCorrect='" + getIsCorrect() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", exerciseId=" + (getExercise() != null ? getExercise().getId() : "null") +
            "}";
    }
}
