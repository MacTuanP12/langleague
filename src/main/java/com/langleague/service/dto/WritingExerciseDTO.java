package com.langleague.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.WritingExercise} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WritingExerciseDTO implements Serializable {

    private Long id;

    @Lob
    private String prompt;

    @Lob
    private String sampleAnswer;

    @NotNull
    private Integer maxScore;

    private ChapterDTO chapter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getSampleAnswer() {
        return sampleAnswer;
    }

    public void setSampleAnswer(String sampleAnswer) {
        this.sampleAnswer = sampleAnswer;
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
        if (!(o instanceof WritingExerciseDTO)) {
            return false;
        }

        WritingExerciseDTO writingExerciseDTO = (WritingExerciseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, writingExerciseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WritingExerciseDTO{" +
            "id=" + getId() +
            ", prompt='" + getPrompt() + "'" +
            ", sampleAnswer='" + getSampleAnswer() + "'" +
            ", maxScore=" + getMaxScore() +
            ", chapter=" + getChapter() +
            "}";
    }
}
