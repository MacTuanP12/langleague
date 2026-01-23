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
    @NotBlank
    @Size(min = 1, max = 200)
    private String word;

    @Size(max = 200)
    private String phonetic;

    @NotNull
    @NotBlank
    private String meaning;

    @Lob
    private String example;

    @Size(max = 500)
    private String imageUrl;

    @NotNull
    @Min(0)
    private Integer orderIndex;

    private Long unitId;

    private String unitTitle;

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

    public Long getUnitId() {
        return unitId;
    }

    public void setUnitId(Long unitId) {
        this.unitId = unitId;
    }

    public String getUnitTitle() {
        return unitTitle;
    }

    public void setUnitTitle(String unitTitle) {
        this.unitTitle = unitTitle;
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
            ", unitId=" + getUnitId() +
            ", unitTitle='" + getUnitTitle() + "'" +
            "}";
    }
}
