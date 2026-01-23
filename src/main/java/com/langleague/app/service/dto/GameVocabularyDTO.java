package com.langleague.app.service.dto;

import java.io.Serializable;

/**
 * A lightweight DTO for Vocabulary entity to use in games.
 * Contains only essential fields needed for game play, avoiding heavy entity relationships.
 */
public class GameVocabularyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String word;
    private String meaning;
    private String phonetic;
    private String example;
    private String imageUrl;

    /**
     * Constructor with all parameters - Required for JPQL projection
     */
    public GameVocabularyDTO(Long id, String word, String meaning, String phonetic, String example, String imageUrl) {
        this.id = id;
        this.word = word;
        this.meaning = meaning;
        this.phonetic = phonetic;
        this.example = example;
        this.imageUrl = imageUrl;
    }

    /**
     * Default constructor
     */
    public GameVocabularyDTO() {}

    // Getters and Setters

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

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getPhonetic() {
        return phonetic;
    }

    public void setPhonetic(String phonetic) {
        this.phonetic = phonetic;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GameVocabularyDTO)) {
            return false;
        }
        return id != null && id.equals(((GameVocabularyDTO) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "GameVocabularyDTO{" +
            "id=" +
            id +
            ", word='" +
            word +
            '\'' +
            ", meaning='" +
            meaning +
            '\'' +
            ", phonetic='" +
            phonetic +
            '\'' +
            ", example='" +
            example +
            '\'' +
            ", imageUrl='" +
            imageUrl +
            '\'' +
            '}'
        );
    }
}
