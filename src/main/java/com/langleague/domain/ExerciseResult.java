package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.domain.enumeration.ExerciseType;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ExerciseResult.
 */
@Entity
@Table(name = "exercise_result")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExerciseResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_type")
    private ExerciseType exerciseType;

    @Column(name = "score")
    private Integer score;

    @Lob
    @Column(name = "user_answer")
    private String userAnswer;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = {
            "internalUser",
            "userVocabularies",
            "userGrammars",
            "bookReviews",
            "comments",
            "exerciseResults",
            "chapterProgresses",
            "userAchievements",
            "learningStreaks",
            "studySessions",
        },
        allowSetters = true
    )
    private AppUser appUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "options", "exerciseResults", "chapter" }, allowSetters = true)
    private ListeningExercise listeningExercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "exerciseResults", "chapter" }, allowSetters = true)
    private SpeakingExercise speakingExercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "options", "exerciseResults", "chapter" }, allowSetters = true)
    private ReadingExercise readingExercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "exerciseResults", "chapter" }, allowSetters = true)
    private WritingExercise writingExercise;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExerciseResult id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ExerciseType getExerciseType() {
        return this.exerciseType;
    }

    public ExerciseResult exerciseType(ExerciseType exerciseType) {
        this.setExerciseType(exerciseType);
        return this;
    }

    public void setExerciseType(ExerciseType exerciseType) {
        this.exerciseType = exerciseType;
    }

    public Integer getScore() {
        return this.score;
    }

    public ExerciseResult score(Integer score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getUserAnswer() {
        return this.userAnswer;
    }

    public ExerciseResult userAnswer(String userAnswer) {
        this.setUserAnswer(userAnswer);
        return this;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public Instant getSubmittedAt() {
        return this.submittedAt;
    }

    public ExerciseResult submittedAt(Instant submittedAt) {
        this.setSubmittedAt(submittedAt);
        return this;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public ExerciseResult appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    public ListeningExercise getListeningExercise() {
        return this.listeningExercise;
    }

    public void setListeningExercise(ListeningExercise listeningExercise) {
        this.listeningExercise = listeningExercise;
    }

    public ExerciseResult listeningExercise(ListeningExercise listeningExercise) {
        this.setListeningExercise(listeningExercise);
        return this;
    }

    public SpeakingExercise getSpeakingExercise() {
        return this.speakingExercise;
    }

    public void setSpeakingExercise(SpeakingExercise speakingExercise) {
        this.speakingExercise = speakingExercise;
    }

    public ExerciseResult speakingExercise(SpeakingExercise speakingExercise) {
        this.setSpeakingExercise(speakingExercise);
        return this;
    }

    public ReadingExercise getReadingExercise() {
        return this.readingExercise;
    }

    public void setReadingExercise(ReadingExercise readingExercise) {
        this.readingExercise = readingExercise;
    }

    public ExerciseResult readingExercise(ReadingExercise readingExercise) {
        this.setReadingExercise(readingExercise);
        return this;
    }

    public WritingExercise getWritingExercise() {
        return this.writingExercise;
    }

    public void setWritingExercise(WritingExercise writingExercise) {
        this.writingExercise = writingExercise;
    }

    public ExerciseResult writingExercise(WritingExercise writingExercise) {
        this.setWritingExercise(writingExercise);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExerciseResult)) {
            return false;
        }
        return getId() != null && getId().equals(((ExerciseResult) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExerciseResult{" +
            "id=" + getId() +
            ", exerciseType='" + getExerciseType() + "'" +
            ", score=" + getScore() +
            ", userAnswer='" + getUserAnswer() + "'" +
            ", submittedAt='" + getSubmittedAt() + "'" +
            "}";
    }
}
