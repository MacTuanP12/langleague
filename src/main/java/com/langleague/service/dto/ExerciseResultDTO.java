package com.langleague.service.dto;

import com.langleague.domain.enumeration.ExerciseType;
import jakarta.persistence.Lob;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.ExerciseResult} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExerciseResultDTO implements Serializable {

    private Long id;

    private ExerciseType exerciseType;

    private Integer score;

    @Lob
    private String userAnswer;

    private Instant submittedAt;

    private AppUserDTO appUser;

    private ListeningExerciseDTO listeningExercise;

    private SpeakingExerciseDTO speakingExercise;

    private ReadingExerciseDTO readingExercise;

    private WritingExerciseDTO writingExercise;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ExerciseType getExerciseType() {
        return exerciseType;
    }

    public void setExerciseType(ExerciseType exerciseType) {
        this.exerciseType = exerciseType;
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

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public AppUserDTO getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUserDTO appUser) {
        this.appUser = appUser;
    }

    public ListeningExerciseDTO getListeningExercise() {
        return listeningExercise;
    }

    public void setListeningExercise(ListeningExerciseDTO listeningExercise) {
        this.listeningExercise = listeningExercise;
    }

    public SpeakingExerciseDTO getSpeakingExercise() {
        return speakingExercise;
    }

    public void setSpeakingExercise(SpeakingExerciseDTO speakingExercise) {
        this.speakingExercise = speakingExercise;
    }

    public ReadingExerciseDTO getReadingExercise() {
        return readingExercise;
    }

    public void setReadingExercise(ReadingExerciseDTO readingExercise) {
        this.readingExercise = readingExercise;
    }

    public WritingExerciseDTO getWritingExercise() {
        return writingExercise;
    }

    public void setWritingExercise(WritingExerciseDTO writingExercise) {
        this.writingExercise = writingExercise;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExerciseResultDTO)) {
            return false;
        }

        ExerciseResultDTO exerciseResultDTO = (ExerciseResultDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, exerciseResultDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExerciseResultDTO{" +
            "id=" + getId() +
            ", exerciseType='" + getExerciseType() + "'" +
            ", score=" + getScore() +
            ", userAnswer='" + getUserAnswer() + "'" +
            ", submittedAt='" + getSubmittedAt() + "'" +
            ", appUser=" + getAppUser() +
            ", listeningExercise=" + getListeningExercise() +
            ", speakingExercise=" + getSpeakingExercise() +
            ", readingExercise=" + getReadingExercise() +
            ", writingExercise=" + getWritingExercise() +
            "}";
    }
}
