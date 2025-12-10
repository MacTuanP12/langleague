package com.langleague.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

/**
 * A AppUser.
 */
@Entity
@Table(name = "app_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SQLDelete(sql = "UPDATE app_user SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "level")
    private Integer level;

    @Column(name = "points")
    private Integer points;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User internalUser;

    // --- Soft-delete field ---
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
    // -------------------------

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "vocabulary" }, allowSetters = true)
    private Set<UserVocabulary> userVocabularies = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "grammar" }, allowSetters = true)
    private Set<UserGrammar> userGrammars = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "book" }, allowSetters = true)
    private Set<BookReview> bookReviews = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "topic" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "exercise" }, allowSetters = true)
    private Set<ExerciseResult> exerciseResults = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "chapter" }, allowSetters = true)
    private Set<ChapterProgress> chapterProgresses = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "achievement" }, allowSetters = true)
    private Set<UserAchievement> userAchievements = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser" }, allowSetters = true)
    private Set<LearningStreak> learningStreaks = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser" }, allowSetters = true)
    private Set<StudySession> studySessions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public AppUser displayName(String displayName) {
        this.setDisplayName(displayName);
        return this;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Integer getLevel() {
        return this.level;
    }

    public AppUser level(Integer level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getPoints() {
        return this.points;
    }

    public AppUser points(Integer points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public AppUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Set<UserVocabulary> getUserVocabularies() {
        return this.userVocabularies;
    }

    public void setUserVocabularies(Set<UserVocabulary> userVocabularies) {
        if (this.userVocabularies != null) {
            this.userVocabularies.forEach(i -> i.setAppUser(null));
        }
        if (userVocabularies != null) {
            userVocabularies.forEach(i -> i.setAppUser(this));
        }
        this.userVocabularies = userVocabularies;
    }

    public AppUser userVocabularies(Set<UserVocabulary> userVocabularies) {
        this.setUserVocabularies(userVocabularies);
        return this;
    }

    public AppUser addUserVocabulary(UserVocabulary userVocabulary) {
        this.userVocabularies.add(userVocabulary);
        userVocabulary.setAppUser(this);
        return this;
    }

    public AppUser removeUserVocabulary(UserVocabulary userVocabulary) {
        this.userVocabularies.remove(userVocabulary);
        userVocabulary.setAppUser(null);
        return this;
    }

    // ... (rest of the getters and setters are omitted for brevity)

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUser)) {
            return false;
        }
        return getId() != null && getId().equals(((AppUser) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUser{" +
            "id=" + getId() +
            ", displayName='" + getDisplayName() + "'" +
            ", level=" + getLevel() +
            ", points=" + getPoints() +
            "}";
    }
}
