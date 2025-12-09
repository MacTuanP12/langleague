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
 * A ListeningExercise.
 */
@Entity
@Table(name = "listening_exercise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListeningExercise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 512)
    @Column(name = "audio_path", length = 512, nullable = false)
    private String audioPath;

    @Size(max = 512)
    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Lob
    @Column(name = "transcript")
    private String transcript;

    @Lob
    @Column(name = "question", nullable = false)
    private String question;

    @Size(max = 255)
    @Column(name = "correct_answer", length = 255)
    private String correctAnswer;

    @NotNull
    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "listeningExercise")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "listeningExercise" }, allowSetters = true)
    private Set<ListeningOption> options = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "listeningExercise")
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

    public ListeningExercise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAudioPath() {
        return this.audioPath;
    }

    public ListeningExercise audioPath(String audioPath) {
        this.setAudioPath(audioPath);
        return this;
    }

    public void setAudioPath(String audioPath) {
        this.audioPath = audioPath;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public ListeningExercise imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTranscript() {
        return this.transcript;
    }

    public ListeningExercise transcript(String transcript) {
        this.setTranscript(transcript);
        return this;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public String getQuestion() {
        return this.question;
    }

    public ListeningExercise question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrectAnswer() {
        return this.correctAnswer;
    }

    public ListeningExercise correctAnswer(String correctAnswer) {
        this.setCorrectAnswer(correctAnswer);
        return this;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getMaxScore() {
        return this.maxScore;
    }

    public ListeningExercise maxScore(Integer maxScore) {
        this.setMaxScore(maxScore);
        return this;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public Set<ListeningOption> getOptions() {
        return this.options;
    }

    public void setOptions(Set<ListeningOption> listeningOptions) {
        if (this.options != null) {
            this.options.forEach(i -> i.setListeningExercise(null));
        }
        if (listeningOptions != null) {
            listeningOptions.forEach(i -> i.setListeningExercise(this));
        }
        this.options = listeningOptions;
    }

    public ListeningExercise options(Set<ListeningOption> listeningOptions) {
        this.setOptions(listeningOptions);
        return this;
    }

    public ListeningExercise addOption(ListeningOption listeningOption) {
        this.options.add(listeningOption);
        listeningOption.setListeningExercise(this);
        return this;
    }

    public ListeningExercise removeOption(ListeningOption listeningOption) {
        this.options.remove(listeningOption);
        listeningOption.setListeningExercise(null);
        return this;
    }

    public Set<ExerciseResult> getExerciseResults() {
        return this.exerciseResults;
    }

    public void setExerciseResults(Set<ExerciseResult> exerciseResults) {
        if (this.exerciseResults != null) {
            this.exerciseResults.forEach(i -> i.setListeningExercise(null));
        }
        if (exerciseResults != null) {
            exerciseResults.forEach(i -> i.setListeningExercise(this));
        }
        this.exerciseResults = exerciseResults;
    }

    public ListeningExercise exerciseResults(Set<ExerciseResult> exerciseResults) {
        this.setExerciseResults(exerciseResults);
        return this;
    }

    public ListeningExercise addExerciseResult(ExerciseResult exerciseResult) {
        this.exerciseResults.add(exerciseResult);
        exerciseResult.setListeningExercise(this);
        return this;
    }

    public ListeningExercise removeExerciseResult(ExerciseResult exerciseResult) {
        this.exerciseResults.remove(exerciseResult);
        exerciseResult.setListeningExercise(null);
        return this;
    }

    public Chapter getChapter() {
        return this.chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public ListeningExercise chapter(Chapter chapter) {
        this.setChapter(chapter);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListeningExercise)) {
            return false;
        }
        return getId() != null && getId().equals(((ListeningExercise) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListeningExercise{" +
            "id=" + getId() +
            ", audioPath='" + getAudioPath() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", transcript='" + getTranscript() + "'" +
            ", question='" + getQuestion() + "'" +
            ", correctAnswer='" + getCorrectAnswer() + "'" +
            ", maxScore=" + getMaxScore() +
            "}";
    }
}
