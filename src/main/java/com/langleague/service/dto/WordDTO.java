package com.langleague.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.domain.Word} entity.
 */
@Schema(description = "Vocabulary Definitions")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WordDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String text;

    @Size(max = 5000, message = "Meaning cannot exceed 5000 characters")
    private String meaning;

    @Size(max = 255)
    private String pronunciation;

    @Size(max = 50)
    private String partOfSpeech;

    @Size(max = 512)
    private String imageUrl;

    private ChapterDTO chapter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getPronunciation() {
        return pronunciation;
    }

    public void setPronunciation(String pronunciation) {
        this.pronunciation = pronunciation;
    }

    public String getPartOfSpeech() {
        return partOfSpeech;
    }

    public void setPartOfSpeech(String partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
        if (!(o instanceof WordDTO)) {
            return false;
        }

        WordDTO wordDTO = (WordDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, wordDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WordDTO{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", meaning='" + getMeaning() + "'" +
            ", pronunciation='" + getPronunciation() + "'" +
            ", partOfSpeech='" + getPartOfSpeech() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", chapter=" + getChapter() +
            "}";
    }
}
