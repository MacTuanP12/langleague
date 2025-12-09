package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.domain.enumeration.LearningStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Entity for user's saved chapters (My Chapters library)
 * Complementary to ChapterProgress - this is for user's curated library
 */
@Entity
@Table(name = "user_chapter", uniqueConstraints = { @UniqueConstraint(columnNames = { "app_user_id", "chapter_id" }) })
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserChapter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "saved_at", nullable = false)
    private Instant savedAt = Instant.now();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "learning_status", nullable = false)
    private LearningStatus learningStatus = LearningStatus.NOT_STARTED;

    @Column(name = "last_accessed_at")
    private Instant lastAccessedAt;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "tags", length = 255)
    private String tags;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
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
    @JoinColumn(name = "chapter_id", nullable = false)
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

    // Getters and Setters

    public Long getId() {
        return this.id;
    }

    public UserChapter id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getSavedAt() {
        return this.savedAt;
    }

    public UserChapter savedAt(Instant savedAt) {
        this.setSavedAt(savedAt);
        return this;
    }

    public void setSavedAt(Instant savedAt) {
        this.savedAt = savedAt;
    }

    public LearningStatus getLearningStatus() {
        return this.learningStatus;
    }

    public UserChapter learningStatus(LearningStatus learningStatus) {
        this.setLearningStatus(learningStatus);
        return this;
    }

    public void setLearningStatus(LearningStatus learningStatus) {
        this.learningStatus = learningStatus;
    }

    public Instant getLastAccessedAt() {
        return this.lastAccessedAt;
    }

    public UserChapter lastAccessedAt(Instant lastAccessedAt) {
        this.setLastAccessedAt(lastAccessedAt);
        return this;
    }

    public void setLastAccessedAt(Instant lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Boolean getIsFavorite() {
        return this.isFavorite;
    }

    public UserChapter isFavorite(Boolean isFavorite) {
        this.setIsFavorite(isFavorite);
        return this;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public String getNotes() {
        return this.notes;
    }

    public UserChapter notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getTags() {
        return this.tags;
    }

    public UserChapter tags(String tags) {
        this.setTags(tags);
        return this;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public UserChapter appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    public Chapter getChapter() {
        return this.chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public UserChapter chapter(Chapter chapter) {
        this.setChapter(chapter);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserChapter)) {
            return false;
        }
        return getId() != null && getId().equals(((UserChapter) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "UserChapter{" +
            "id=" +
            getId() +
            ", savedAt='" +
            getSavedAt() +
            "'" +
            ", learningStatus='" +
            getLearningStatus() +
            "'" +
            ", lastAccessedAt='" +
            getLastAccessedAt() +
            "'" +
            ", isFavorite='" +
            getIsFavorite() +
            "'" +
            ", notes='" +
            getNotes() +
            "'" +
            ", tags='" +
            getTags() +
            "'" +
            "}"
        );
    }
}
