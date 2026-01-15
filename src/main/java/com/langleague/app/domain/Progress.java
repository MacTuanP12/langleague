package com.langleague.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Progress.
 */
@Entity
@Table(name = "progress")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Progress implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted;

    @NotNull
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "is_bookmarked")
    private Boolean isBookmarked;

    @Min(0)
    @Max(100)
    @Column(name = "score")
    private Integer score;

    @Column(name = "last_accessed_at")
    private Instant lastAccessedAt;

    @Min(0)
    @Max(100)
    @Column(name = "completion_percentage")
    private Integer completionPercentage;

    @Column(name = "is_vocabulary_finished")
    private Boolean isVocabularyFinished;

    @Column(name = "is_grammar_finished")
    private Boolean isGrammarFinished;

    @Column(name = "is_exercise_finished")
    private Boolean isExerciseFinished;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "books", "enrollments", "progresses" }, allowSetters = true)
    private UserProfile userProfile;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "vocabularies", "grammars", "exercises", "progresses", "book" }, allowSetters = true)
    private Unit unit;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Progress id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsCompleted() {
        return this.isCompleted;
    }

    public Progress isCompleted(Boolean isCompleted) {
        this.setIsCompleted(isCompleted);
        return this;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Progress updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsBookmarked() {
        return this.isBookmarked;
    }

    public Progress isBookmarked(Boolean isBookmarked) {
        this.setIsBookmarked(isBookmarked);
        return this;
    }

    public void setIsBookmarked(Boolean isBookmarked) {
        this.isBookmarked = isBookmarked;
    }

    public Integer getScore() {
        return this.score;
    }

    public Progress score(Integer score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Instant getLastAccessedAt() {
        return this.lastAccessedAt;
    }

    public Progress lastAccessedAt(Instant lastAccessedAt) {
        this.setLastAccessedAt(lastAccessedAt);
        return this;
    }

    public void setLastAccessedAt(Instant lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Integer getCompletionPercentage() {
        return this.completionPercentage;
    }

    public Progress completionPercentage(Integer completionPercentage) {
        this.setCompletionPercentage(completionPercentage);
        return this;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Boolean getIsVocabularyFinished() {
        return this.isVocabularyFinished;
    }

    public Progress isVocabularyFinished(Boolean isVocabularyFinished) {
        this.setIsVocabularyFinished(isVocabularyFinished);
        return this;
    }

    public void setIsVocabularyFinished(Boolean isVocabularyFinished) {
        this.isVocabularyFinished = isVocabularyFinished;
    }

    public Boolean getIsGrammarFinished() {
        return this.isGrammarFinished;
    }

    public Progress isGrammarFinished(Boolean isGrammarFinished) {
        this.setIsGrammarFinished(isGrammarFinished);
        return this;
    }

    public void setIsGrammarFinished(Boolean isGrammarFinished) {
        this.isGrammarFinished = isGrammarFinished;
    }

    public Boolean getIsExerciseFinished() {
        return this.isExerciseFinished;
    }

    public Progress isExerciseFinished(Boolean isExerciseFinished) {
        this.setIsExerciseFinished(isExerciseFinished);
        return this;
    }

    public void setIsExerciseFinished(Boolean isExerciseFinished) {
        this.isExerciseFinished = isExerciseFinished;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Progress userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Progress unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Progress)) {
            return false;
        }
        return getId() != null && getId().equals(((Progress) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Progress{" +
            "id=" + getId() +
            ", isCompleted='" + getIsCompleted() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", isBookmarked='" + getIsBookmarked() + "'" +
            ", score=" + getScore() +
            ", lastAccessedAt='" + getLastAccessedAt() + "'" +
            ", completionPercentage=" + getCompletionPercentage() +
            ", isVocabularyFinished='" + getIsVocabularyFinished() + "'" +
            ", isGrammarFinished='" + getIsGrammarFinished() + "'" +
            ", isExerciseFinished='" + getIsExerciseFinished() + "'" +
            "}";
    }
}
