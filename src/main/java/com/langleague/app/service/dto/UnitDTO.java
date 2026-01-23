package com.langleague.app.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Unit} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UnitDTO implements Serializable {

    private Long id;

    @NotNull
    @NotBlank
    @Size(min = 1, max = 200)
    private String title;

    @NotNull
    @Min(0)
    private Integer orderIndex;

    @Lob
    private String summary;

    private Long bookId;

    private String bookTitle;

    private Long vocabularyCount;

    private Long grammarCount;

    private Long exerciseCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public Long getVocabularyCount() {
        return vocabularyCount;
    }

    public void setVocabularyCount(Long vocabularyCount) {
        this.vocabularyCount = vocabularyCount;
    }

    public Long getGrammarCount() {
        return grammarCount;
    }

    public void setGrammarCount(Long grammarCount) {
        this.grammarCount = grammarCount;
    }

    public Long getExerciseCount() {
        return exerciseCount;
    }

    public void setExerciseCount(Long exerciseCount) {
        this.exerciseCount = exerciseCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UnitDTO)) {
            return false;
        }

        UnitDTO unitDTO = (UnitDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, unitDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UnitDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", summary='" + getSummary() + "'" +
            ", bookId=" + getBookId() +
            ", bookTitle='" + getBookTitle() + "'" +
            ", vocabularyCount=" + getVocabularyCount() +
            ", grammarCount=" + getGrammarCount() +
            ", exerciseCount=" + getExerciseCount() +
            "}";
    }
}
