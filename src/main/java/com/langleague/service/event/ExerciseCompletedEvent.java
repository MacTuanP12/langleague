package com.langleague.service.event;

import com.langleague.domain.enumeration.ExerciseType;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a user completes an exercise.
 * Used for async processing of gamification features (achievements, streaks, etc.)
 */
public class ExerciseCompletedEvent extends ApplicationEvent {

    private final Long userId;
    private final Long exerciseResultId;
    private final ExerciseType exerciseType;
    private final Integer score;
    private final Long bookId;

    public ExerciseCompletedEvent(
        Object source,
        Long userId,
        Long exerciseResultId,
        ExerciseType exerciseType,
        Integer score,
        Long bookId
    ) {
        super(source);
        this.userId = userId;
        this.exerciseResultId = exerciseResultId;
        this.exerciseType = exerciseType;
        this.score = score;
        this.bookId = bookId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getExerciseResultId() {
        return exerciseResultId;
    }

    public ExerciseType getExerciseType() {
        return exerciseType;
    }

    public Integer getScore() {
        return score;
    }

    public Long getBookId() {
        return bookId;
    }

    @Override
    public String toString() {
        return (
            "ExerciseCompletedEvent{" +
            "userId=" +
            userId +
            ", exerciseResultId=" +
            exerciseResultId +
            ", exerciseType=" +
            exerciseType +
            ", score=" +
            score +
            ", bookId=" +
            bookId +
            '}'
        );
    }
}
