package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LearningStreak.
 */
@Entity
@Table(name = "learning_streak")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LearningStreak implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "current_streak")
    private Integer currentStreak;

    @Column(name = "longest_streak")
    private Integer longestStreak;

    @Column(name = "last_study_date")
    private Instant lastStudyDate;

    // Note: iconUrl removed - use StreakIconRepository.findCurrentIconForStreak() for dynamic query
    // This avoids data duplication and ensures icons are always up-to-date

    @Version
    @Column(name = "version")
    private Long version;

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LearningStreak id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCurrentStreak() {
        return this.currentStreak;
    }

    public LearningStreak currentStreak(Integer currentStreak) {
        this.setCurrentStreak(currentStreak);
        return this;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return this.longestStreak;
    }

    public LearningStreak longestStreak(Integer longestStreak) {
        this.setLongestStreak(longestStreak);
        return this;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public Instant getLastStudyDate() {
        return this.lastStudyDate;
    }

    public LearningStreak lastStudyDate(Instant lastStudyDate) {
        this.setLastStudyDate(lastStudyDate);
        return this;
    }

    public void setLastStudyDate(Instant lastStudyDate) {
        this.lastStudyDate = lastStudyDate;
    }

    public Long getVersion() {
        return this.version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public LearningStreak appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LearningStreak)) {
            return false;
        }
        return getId() != null && getId().equals(((LearningStreak) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LearningStreak{" +
            "id=" + getId() +
            ", currentStreak=" + getCurrentStreak() +
            ", longestStreak=" + getLongestStreak() +
            ", lastStudyDate='" + getLastStudyDate() + "'" +
            "}";
    }
}
