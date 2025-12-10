package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.SpeakingExercise} entity.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SpeakingExerciseDTO implements Serializable {

    private Long id;

    @NotBlank(message = "Prompt is required")
    @Size(max = 5000, message = "Prompt cannot exceed 5000 characters")
    private String prompt;

    @Size(max = 512)
    private String sampleAudio;

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

    public String getSampleAudio() {
        return sampleAudio;
    }

    public void setSampleAudio(String sampleAudio) {
        this.sampleAudio = sampleAudio;
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
        if (!(o instanceof SpeakingExerciseDTO)) {
            return false;
        }

        SpeakingExerciseDTO speakingExerciseDTO = (SpeakingExerciseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, speakingExerciseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SpeakingExerciseDTO{" +
            "id=" + getId() +
            ", prompt='" + getPrompt() + "'" +
            ", sampleAudio='" + getSampleAudio() + "'" +
            ", maxScore=" + getMaxScore() +
            ", chapter=" + getChapter() +
            "}";
    }
}
