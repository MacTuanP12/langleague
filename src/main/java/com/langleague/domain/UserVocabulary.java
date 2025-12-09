package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * User vocabulary progress (Flashcards)
 */
@Entity
@Table(name = "user_vocabulary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserVocabulary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "remembered")
    private Boolean remembered;

    @Column(name = "is_memorized")
    private Boolean isMemorized;

    @Column(name = "last_reviewed")
    private Instant lastReviewed;

    @Column(name = "review_count")
    private Integer reviewCount;

    // SRS (Spaced Repetition System) fields
    @Column(name = "ease_factor")
    private Integer easeFactor = 250; // 2.5 * 100

    @Column(name = "interval_days")
    private Integer intervalDays = 0;

    @Column(name = "next_review_date")
    private java.time.LocalDate nextReviewDate;

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
    @JsonIgnoreProperties(value = { "wordExamples", "userVocabularies", "chapter" }, allowSetters = true)
    private Word word;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserVocabulary id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getRemembered() {
        return this.remembered;
    }

    public UserVocabulary remembered(Boolean remembered) {
        this.setRemembered(remembered);
        return this;
    }

    public void setRemembered(Boolean remembered) {
        this.remembered = remembered;
    }

    public Boolean getIsMemorized() {
        return this.isMemorized;
    }

    public UserVocabulary isMemorized(Boolean isMemorized) {
        this.setIsMemorized(isMemorized);
        return this;
    }

    public void setIsMemorized(Boolean isMemorized) {
        this.isMemorized = isMemorized;
    }

    public Instant getLastReviewed() {
        return this.lastReviewed;
    }

    public UserVocabulary lastReviewed(Instant lastReviewed) {
        this.setLastReviewed(lastReviewed);
        return this;
    }

    public void setLastReviewed(Instant lastReviewed) {
        this.lastReviewed = lastReviewed;
    }

    public Integer getReviewCount() {
        return this.reviewCount;
    }

    public UserVocabulary reviewCount(Integer reviewCount) {
        this.setReviewCount(reviewCount);
        return this;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getEaseFactor() {
        return this.easeFactor;
    }

    public UserVocabulary easeFactor(Integer easeFactor) {
        this.setEaseFactor(easeFactor);
        return this;
    }

    public void setEaseFactor(Integer easeFactor) {
        this.easeFactor = easeFactor;
    }

    public Integer getIntervalDays() {
        return this.intervalDays;
    }

    public UserVocabulary intervalDays(Integer intervalDays) {
        this.setIntervalDays(intervalDays);
        return this;
    }

    public void setIntervalDays(Integer intervalDays) {
        this.intervalDays = intervalDays;
    }

    public java.time.LocalDate getNextReviewDate() {
        return this.nextReviewDate;
    }

    public UserVocabulary nextReviewDate(java.time.LocalDate nextReviewDate) {
        this.setNextReviewDate(nextReviewDate);
        return this;
    }

    public void setNextReviewDate(java.time.LocalDate nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public UserVocabulary appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    public Word getWord() {
        return this.word;
    }

    public void setWord(Word word) {
        this.word = word;
    }

    public UserVocabulary word(Word word) {
        this.setWord(word);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserVocabulary)) {
            return false;
        }
        return getId() != null && getId().equals(((UserVocabulary) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserVocabulary{" +
            "id=" + getId() +
            ", remembered='" + getRemembered() + "'" +
            ", isMemorized='" + getIsMemorized() + "'" +
            ", lastReviewed='" + getLastReviewed() + "'" +
            ", reviewCount=" + getReviewCount() +
            "}";
    }
}
