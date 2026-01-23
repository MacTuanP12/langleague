package com.langleague.app.service.dto;

import com.langleague.app.domain.enumeration.ExerciseType;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Exercise} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExerciseDTO implements Serializable {

    private Long id;

    @Lob
    private String exerciseText;

    @NotNull
    private ExerciseType exerciseType;

    @Lob
    private String correctAnswerRaw;

    @Size(max = 500)
    private String audioUrl;

    @Size(max = 500)
    private String imageUrl;

    @NotNull
    @Min(0)
    private Integer orderIndex;

    private Long unitId;

    private String unitTitle;

    private List<ExerciseOptionDTO> options;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExerciseText() {
        return exerciseText;
    }

    public void setExerciseText(String exerciseText) {
        this.exerciseText = exerciseText;
    }

    public ExerciseType getExerciseType() {
        return exerciseType;
    }

    public void setExerciseType(ExerciseType exerciseType) {
        this.exerciseType = exerciseType;
    }

    public String getCorrectAnswerRaw() {
        return correctAnswerRaw;
    }

    public void setCorrectAnswerRaw(String correctAnswerRaw) {
        this.correctAnswerRaw = correctAnswerRaw;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Long getUnitId() {
        return unitId;
    }

    public void setUnitId(Long unitId) {
        this.unitId = unitId;
    }

    public String getUnitTitle() {
        return unitTitle;
    }

    public void setUnitTitle(String unitTitle) {
        this.unitTitle = unitTitle;
    }

    public List<ExerciseOptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<ExerciseOptionDTO> options) {
        this.options = options;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExerciseDTO)) {
            return false;
        }

        ExerciseDTO exerciseDTO = (ExerciseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, exerciseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExerciseDTO{" +
            "id=" + getId() +
            ", exerciseText='" + getExerciseText() + "'" +
            ", exerciseType='" + getExerciseType() + "'" +
            ", correctAnswerRaw='" + getCorrectAnswerRaw() + "'" +
            ", audioUrl='" + getAudioUrl() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", unitId=" + getUnitId() +
            ", unitTitle='" + getUnitTitle() + "'" +
            ", options=" + getOptions() +
            "}";
    }
}
