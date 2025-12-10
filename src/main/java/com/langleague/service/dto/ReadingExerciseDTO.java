package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.ReadingExercise} entity.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReadingExerciseDTO implements Serializable {

    private Long id;

    @NotBlank(message = "Passage is required")
    @Size(max = 20000, message = "Passage cannot exceed 20000 characters")
    private String passage;

    @NotBlank(message = "Question is required")
    @Size(max = 5000, message = "Question cannot exceed 5000 characters")
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

    public String getPassage() {
        return passage;
    }

    public void setPassage(String passage) {
        this.passage = passage;
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
        if (!(o instanceof ReadingExerciseDTO)) {
            return false;
        }

        ReadingExerciseDTO readingExerciseDTO = (ReadingExerciseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, readingExerciseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReadingExerciseDTO{" +
            "id=" + getId() +
            ", passage='" + getPassage() + "'" +
            ", question='" + getQuestion() + "'" +
            ", correctAnswer='" + getCorrectAnswer() + "'" +
            ", maxScore=" + getMaxScore() +
            ", chapter=" + getChapter() +
            "}";
    }
}
