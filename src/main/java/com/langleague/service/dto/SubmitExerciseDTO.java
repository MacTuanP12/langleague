package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.langleague.domain.enumeration.ExerciseType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 * A DTO for submitting exercise results from frontend.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmitExerciseDTO implements Serializable {

    @NotNull(message = "Exercise type is required")
    private ExerciseType exerciseType;

    @NotNull(message = "Exercise ID is required")
    private Long exerciseId;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score must be at least 0")
    @Max(value = 100, message = "Score cannot exceed 100")
    private Integer score;

    @Size(max = 10000, message = "User answer cannot exceed 10000 characters")
    private String userAnswer;

    public ExerciseType getExerciseType() {
        return exerciseType;
    }

    public void setExerciseType(ExerciseType exerciseType) {
        this.exerciseType = exerciseType;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    @Override
    public String toString() {
        return (
            "SubmitExerciseDTO{" +
            "exerciseType=" +
            exerciseType +
            ", exerciseId=" +
            exerciseId +
            ", score=" +
            score +
            ", userAnswer='" +
            userAnswer +
            '\'' +
            '}'
        );
    }
}
