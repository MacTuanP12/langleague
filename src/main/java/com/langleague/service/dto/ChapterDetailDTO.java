package com.langleague.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A detailed DTO for the {@link com.langleague.domain.Chapter} entity with all related content.
 * Used for Use Case 17: View lesson details
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChapterDetailDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String title;

    @NotNull
    private Integer orderIndex;

    private BookDTO book;

    private Set<WordDTO> words = new HashSet<>();

    private Set<GrammarDTO> grammars = new HashSet<>();

    private Set<ListeningExerciseDTO> listeningExercises = new HashSet<>();

    private Set<ReadingExerciseDTO> readingExercises = new HashSet<>();

    private Set<WritingExerciseDTO> writingExercises = new HashSet<>();

    private Set<SpeakingExerciseDTO> speakingExercises = new HashSet<>();

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

    public BookDTO getBook() {
        return book;
    }

    public void setBook(BookDTO book) {
        this.book = book;
    }

    public Set<WordDTO> getWords() {
        return words;
    }

    public void setWords(Set<WordDTO> words) {
        this.words = words;
    }

    public Set<GrammarDTO> getGrammars() {
        return grammars;
    }

    public void setGrammars(Set<GrammarDTO> grammars) {
        this.grammars = grammars;
    }

    public Set<ListeningExerciseDTO> getListeningExercises() {
        return listeningExercises;
    }

    public void setListeningExercises(Set<ListeningExerciseDTO> listeningExercises) {
        this.listeningExercises = listeningExercises;
    }

    public Set<ReadingExerciseDTO> getReadingExercises() {
        return readingExercises;
    }

    public void setReadingExercises(Set<ReadingExerciseDTO> readingExercises) {
        this.readingExercises = readingExercises;
    }

    public Set<WritingExerciseDTO> getWritingExercises() {
        return writingExercises;
    }

    public void setWritingExercises(Set<WritingExerciseDTO> writingExercises) {
        this.writingExercises = writingExercises;
    }

    public Set<SpeakingExerciseDTO> getSpeakingExercises() {
        return speakingExercises;
    }

    public void setSpeakingExercises(Set<SpeakingExerciseDTO> speakingExercises) {
        this.speakingExercises = speakingExercises;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChapterDetailDTO)) {
            return false;
        }

        ChapterDetailDTO chapterDetailDTO = (ChapterDetailDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, chapterDetailDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChapterDetailDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", book=" + getBook() +
            ", wordsCount=" + (words != null ? words.size() : 0) +
            ", grammarsCount=" + (grammars != null ? grammars.size() : 0) +
            ", listeningExercisesCount=" + (listeningExercises != null ? listeningExercises.size() : 0) +
            ", readingExercisesCount=" + (readingExercises != null ? readingExercises.size() : 0) +
            ", writingExercisesCount=" + (writingExercises != null ? writingExercises.size() : 0) +
            ", speakingExercisesCount=" + (speakingExercises != null ? speakingExercises.size() : 0) +
            "}";
    }
}
