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
 * Entity for user's saved books (My Books library)
 */
@Entity
@Table(name = "user_book", uniqueConstraints = { @UniqueConstraint(columnNames = { "app_user_id", "book_id" }) })
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserBook implements Serializable {

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

    @Column(name = "current_chapter_id")
    private Long currentChapterId;

    @Column(name = "last_accessed_at")
    private Instant lastAccessedAt;

    @Column(name = "progress_percentage")
    private Double progressPercentage = 0.0;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    @JsonIgnoreProperties(value = { "internalUser", "userVocabularies", "userGrammars" }, allowSetters = true)
    private AppUser appUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnoreProperties(value = { "chapters", "bookReviews" }, allowSetters = true)
    private Book book;

    // Getters and Setters

    public Long getId() {
        return this.id;
    }

    public UserBook id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getSavedAt() {
        return this.savedAt;
    }

    public UserBook savedAt(Instant savedAt) {
        this.setSavedAt(savedAt);
        return this;
    }

    public void setSavedAt(Instant savedAt) {
        this.savedAt = savedAt;
    }

    public LearningStatus getLearningStatus() {
        return this.learningStatus;
    }

    public UserBook learningStatus(LearningStatus learningStatus) {
        this.setLearningStatus(learningStatus);
        return this;
    }

    public void setLearningStatus(LearningStatus learningStatus) {
        this.learningStatus = learningStatus;
    }

    public Long getCurrentChapterId() {
        return this.currentChapterId;
    }

    public UserBook currentChapterId(Long currentChapterId) {
        this.setCurrentChapterId(currentChapterId);
        return this;
    }

    public void setCurrentChapterId(Long currentChapterId) {
        this.currentChapterId = currentChapterId;
    }

    public Instant getLastAccessedAt() {
        return this.lastAccessedAt;
    }

    public UserBook lastAccessedAt(Instant lastAccessedAt) {
        this.setLastAccessedAt(lastAccessedAt);
        return this;
    }

    public void setLastAccessedAt(Instant lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Double getProgressPercentage() {
        return this.progressPercentage;
    }

    public UserBook progressPercentage(Double progressPercentage) {
        this.setProgressPercentage(progressPercentage);
        return this;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Boolean getIsFavorite() {
        return this.isFavorite;
    }

    public UserBook isFavorite(Boolean isFavorite) {
        this.setIsFavorite(isFavorite);
        return this;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public UserBook appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public UserBook book(Book book) {
        this.setBook(book);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserBook)) {
            return false;
        }
        return getId() != null && getId().equals(((UserBook) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "UserBook{" +
            "id=" +
            getId() +
            ", savedAt='" +
            getSavedAt() +
            "'" +
            ", learningStatus='" +
            getLearningStatus() +
            "'" +
            ", currentChapterId=" +
            getCurrentChapterId() +
            ", lastAccessedAt='" +
            getLastAccessedAt() +
            "'" +
            ", progressPercentage=" +
            getProgressPercentage() +
            ", isFavorite=" +
            getIsFavorite() +
            "}"
        );
    }
}
