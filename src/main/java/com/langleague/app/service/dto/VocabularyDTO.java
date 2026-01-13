package com.langleague.app.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Vocabulary} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VocabularyDTO implements Serializable {

    private Long id;

    @NotNull
    private String word;

    private String phonetic;

    @NotNull
    private String meaning;

    @Lob
    private String example;

    private String imageUrl;

    @NotNull
    private Integer orderIndex;

    @NotNull
    private UnitDTO unit;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getPhonetic() {
        return phonetic;
    }

    public void setPhonetic(String phonetic) {
        this.phonetic = phonetic;
    }

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
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

    public UnitDTO getUnit() {
        return unit;
    }

    public void setUnit(UnitDTO unit) {
        this.unit = unit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VocabularyDTO)) {
            return false;
        }

        VocabularyDTO vocabularyDTO = (VocabularyDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, vocabularyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VocabularyDTO{" +
            "id=" + getId() +
            ", word='" + getWord() + "'" +
            ", phonetic='" + getPhonetic() + "'" +
            ", meaning='" + getMeaning() + "'" +
            ", example='" + getExample() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", unit=" + getUnit() +
            "}";
    }
}
