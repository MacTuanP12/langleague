package com.langleague.service.dto;

import com.langleague.domain.enumeration.ExerciseType;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * A DTO for submitting exercise results from frontend.
 */
public class SubmitExerciseDTO implements Serializable {

    @NotNull
    private ExerciseType exerciseType;

    @NotNull
    private Long exerciseId;

    @NotNull
    private Integer score;

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
