package com.langleague.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.ListeningExercise} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListeningExerciseDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 512)
    private String audioPath;

    @Size(max = 512)
    private String imageUrl;

    @Lob
    private String transcript;

    @Lob
    private String question;

    @Size(max = 255)
    private String correctAnswer;

    @NotNull
    private Integer maxScore;

    private ChapterDTO chapter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAudioPath() {
        return audioPath;
    }

    public void setAudioPath(String audioPath) {
        this.audioPath = audioPath;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public ChapterDTO getChapter() {
        return chapter;
    }

    public void setChapter(ChapterDTO chapter) {
        this.chapter = chapter;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListeningExerciseDTO)) {
            return false;
        }

        ListeningExerciseDTO listeningExerciseDTO = (ListeningExerciseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, listeningExerciseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListeningExerciseDTO{" +
            "id=" + getId() +
            ", audioPath='" + getAudioPath() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", transcript='" + getTranscript() + "'" +
            ", question='" + getQuestion() + "'" +
            ", correctAnswer='" + getCorrectAnswer() + "'" +
            ", maxScore=" + getMaxScore() +
            ", chapter=" + getChapter() +
            "}";
    }
}
