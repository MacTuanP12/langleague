package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ReadingExercise.
 */
@Entity
@Table(name = "reading_exercise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReadingExercise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "passage", nullable = false)
    private String passage;

    @Lob
    @Column(name = "question", nullable = false)
    private String question;

    @Size(max = 255)
    @Column(name = "correct_answer", length = 255)
    private String correctAnswer;

    @NotNull
    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "readingExercise")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "readingExercise" }, allowSetters = true)
    private Set<ReadingOption> options = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "readingExercise")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "appUser", "listeningExercise", "speakingExercise", "readingExercise", "writingExercise" },
        allowSetters = true
    )
    private Set<ExerciseResult> exerciseResults = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = {
            "words",
            "grammars",
            "listeningExercises",
            "speakingExercises",
            "readingExercises",
            "writingExercises",
            "chapterProgresses",
            "book",
        },
        allowSetters = true
    )
    private Chapter chapter;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ReadingExercise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassage() {
        return this.passage;
    }

    public ReadingExercise passage(String passage) {
        this.setPassage(passage);
        return this;
    }

    public void setPassage(String passage) {
        this.passage = passage;
    }

    public String getQuestion() {
        return this.question;
    }

    public ReadingExercise question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrectAnswer() {
        return this.correctAnswer;
    }

    public ReadingExercise correctAnswer(String correctAnswer) {
        this.setCorrectAnswer(correctAnswer);
        return this;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getMaxScore() {
        return this.maxScore;
    }

    public ReadingExercise maxScore(Integer maxScore) {
        this.setMaxScore(maxScore);
        return this;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public Set<ReadingOption> getOptions() {
        return this.options;
    }

    public void setOptions(Set<ReadingOption> readingOptions) {
        if (this.options != null) {
            this.options.forEach(i -> i.setReadingExercise(null));
        }
        if (readingOptions != null) {
            readingOptions.forEach(i -> i.setReadingExercise(this));
        }
        this.options = readingOptions;
    }

    public ReadingExercise options(Set<ReadingOption> readingOptions) {
        this.setOptions(readingOptions);
        return this;
    }

    public ReadingExercise addOption(ReadingOption readingOption) {
        this.options.add(readingOption);
        readingOption.setReadingExercise(this);
        return this;
    }

    public ReadingExercise removeOption(ReadingOption readingOption) {
        this.options.remove(readingOption);
        readingOption.setReadingExercise(null);
        return this;
    }

    public Set<ExerciseResult> getExerciseResults() {
        return this.exerciseResults;
    }

    public void setExerciseResults(Set<ExerciseResult> exerciseResults) {
        if (this.exerciseResults != null) {
            this.exerciseResults.forEach(i -> i.setReadingExercise(null));
        }
        if (exerciseResults != null) {
            exerciseResults.forEach(i -> i.setReadingExercise(this));
        }
        this.exerciseResults = exerciseResults;
    }

    public ReadingExercise exerciseResults(Set<ExerciseResult> exerciseResults) {
        this.setExerciseResults(exerciseResults);
        return this;
    }

    public ReadingExercise addExerciseResult(ExerciseResult exerciseResult) {
        this.exerciseResults.add(exerciseResult);
        exerciseResult.setReadingExercise(this);
        return this;
    }

    public ReadingExercise removeExerciseResult(ExerciseResult exerciseResult) {
        this.exerciseResults.remove(exerciseResult);
        exerciseResult.setReadingExercise(null);
        return this;
    }

    public Chapter getChapter() {
        return this.chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public ReadingExercise chapter(Chapter chapter) {
        this.setChapter(chapter);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReadingExercise)) {
            return false;
        }
        return getId() != null && getId().equals(((ReadingExercise) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReadingExercise{" +
            "id=" + getId() +
            ", passage='" + getPassage() + "'" +
            ", question='" + getQuestion() + "'" +
            ", correctAnswer='" + getCorrectAnswer() + "'" +
            ", maxScore=" + getMaxScore() +
            "}";
    }
}
