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
 * Thông tin mở rộng cho User (Profile)
 */
@Entity
@Table(name = "app_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 255)
    @Column(name = "display_name", length = 255)
    private String displayName;

    @Lob
    @Column(name = "bio")
    private String bio;

    @Size(max = 50)
    @Column(name = "timezone", length = 50)
    private String timezone;

    // Notification Settings
    @Column(name = "email_notification_enabled")
    private Boolean emailNotificationEnabled = true;

    @Column(name = "daily_reminder_enabled")
    private Boolean dailyReminderEnabled = true;

    @Version
    @Column(name = "version")
    private Long version;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "word" }, allowSetters = true)
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
    @JsonIgnoreProperties(value = { "appUser" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "appUser", "listeningExercise", "speakingExercise", "readingExercise", "writingExercise" },
        allowSetters = true
    )
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
    @JsonIgnoreProperties(value = { "streakMilestones", "appUser" }, allowSetters = true)
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

    public String getBio() {
        return this.bio;
    }

    public AppUser bio(String bio) {
        this.setBio(bio);
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getTimezone() {
        return this.timezone;
    }

    public AppUser timezone(String timezone) {
        this.setTimezone(timezone);
        return this;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Boolean getEmailNotificationEnabled() {
        return this.emailNotificationEnabled;
    }

    public AppUser emailNotificationEnabled(Boolean emailNotificationEnabled) {
        this.setEmailNotificationEnabled(emailNotificationEnabled);
        return this;
    }

    public void setEmailNotificationEnabled(Boolean emailNotificationEnabled) {
        this.emailNotificationEnabled = emailNotificationEnabled;
    }

    public Boolean getDailyReminderEnabled() {
        return this.dailyReminderEnabled;
    }

    public AppUser dailyReminderEnabled(Boolean dailyReminderEnabled) {
        this.setDailyReminderEnabled(dailyReminderEnabled);
        return this;
    }

    public void setDailyReminderEnabled(Boolean dailyReminderEnabled) {
        this.dailyReminderEnabled = dailyReminderEnabled;
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

    public Set<UserGrammar> getUserGrammars() {
        return this.userGrammars;
    }

    public void setUserGrammars(Set<UserGrammar> userGrammars) {
        if (this.userGrammars != null) {
            this.userGrammars.forEach(i -> i.setAppUser(null));
        }
        if (userGrammars != null) {
            userGrammars.forEach(i -> i.setAppUser(this));
        }
        this.userGrammars = userGrammars;
    }

    public AppUser userGrammars(Set<UserGrammar> userGrammars) {
        this.setUserGrammars(userGrammars);
        return this;
    }

    public AppUser addUserGrammar(UserGrammar userGrammar) {
        this.userGrammars.add(userGrammar);
        userGrammar.setAppUser(this);
        return this;
    }

    public AppUser removeUserGrammar(UserGrammar userGrammar) {
        this.userGrammars.remove(userGrammar);
        userGrammar.setAppUser(null);
        return this;
    }

    public Set<BookReview> getBookReviews() {
        return this.bookReviews;
    }

    public void setBookReviews(Set<BookReview> bookReviews) {
        if (this.bookReviews != null) {
            this.bookReviews.forEach(i -> i.setAppUser(null));
        }
        if (bookReviews != null) {
            bookReviews.forEach(i -> i.setAppUser(this));
        }
        this.bookReviews = bookReviews;
    }

    public AppUser bookReviews(Set<BookReview> bookReviews) {
        this.setBookReviews(bookReviews);
        return this;
    }

    public AppUser addBookReview(BookReview bookReview) {
        this.bookReviews.add(bookReview);
        bookReview.setAppUser(this);
        return this;
    }

    public AppUser removeBookReview(BookReview bookReview) {
        this.bookReviews.remove(bookReview);
        bookReview.setAppUser(null);
        return this;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setAppUser(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setAppUser(this));
        }
        this.comments = comments;
    }

    public AppUser comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public AppUser addComment(Comment comment) {
        this.comments.add(comment);
        comment.setAppUser(this);
        return this;
    }

    public AppUser removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setAppUser(null);
        return this;
    }

    public Set<ExerciseResult> getExerciseResults() {
        return this.exerciseResults;
    }

    public void setExerciseResults(Set<ExerciseResult> exerciseResults) {
        if (this.exerciseResults != null) {
            this.exerciseResults.forEach(i -> i.setAppUser(null));
        }
        if (exerciseResults != null) {
            exerciseResults.forEach(i -> i.setAppUser(this));
        }
        this.exerciseResults = exerciseResults;
    }

    public AppUser exerciseResults(Set<ExerciseResult> exerciseResults) {
        this.setExerciseResults(exerciseResults);
        return this;
    }

    public AppUser addExerciseResult(ExerciseResult exerciseResult) {
        this.exerciseResults.add(exerciseResult);
        exerciseResult.setAppUser(this);
        return this;
    }

    public AppUser removeExerciseResult(ExerciseResult exerciseResult) {
        this.exerciseResults.remove(exerciseResult);
        exerciseResult.setAppUser(null);
        return this;
    }

    public Set<ChapterProgress> getChapterProgresses() {
        return this.chapterProgresses;
    }

    public void setChapterProgresses(Set<ChapterProgress> chapterProgresses) {
        if (this.chapterProgresses != null) {
            this.chapterProgresses.forEach(i -> i.setAppUser(null));
        }
        if (chapterProgresses != null) {
            chapterProgresses.forEach(i -> i.setAppUser(this));
        }
        this.chapterProgresses = chapterProgresses;
    }

    public AppUser chapterProgresses(Set<ChapterProgress> chapterProgresses) {
        this.setChapterProgresses(chapterProgresses);
        return this;
    }

    public AppUser addChapterProgress(ChapterProgress chapterProgress) {
        this.chapterProgresses.add(chapterProgress);
        chapterProgress.setAppUser(this);
        return this;
    }

    public AppUser removeChapterProgress(ChapterProgress chapterProgress) {
        this.chapterProgresses.remove(chapterProgress);
        chapterProgress.setAppUser(null);
        return this;
    }

    public Set<UserAchievement> getUserAchievements() {
        return this.userAchievements;
    }

    public void setUserAchievements(Set<UserAchievement> userAchievements) {
        if (this.userAchievements != null) {
            this.userAchievements.forEach(i -> i.setAppUser(null));
        }
        if (userAchievements != null) {
            userAchievements.forEach(i -> i.setAppUser(this));
        }
        this.userAchievements = userAchievements;
    }

    public AppUser userAchievements(Set<UserAchievement> userAchievements) {
        this.setUserAchievements(userAchievements);
        return this;
    }

    public AppUser addUserAchievement(UserAchievement userAchievement) {
        this.userAchievements.add(userAchievement);
        userAchievement.setAppUser(this);
        return this;
    }

    public AppUser removeUserAchievement(UserAchievement userAchievement) {
        this.userAchievements.remove(userAchievement);
        userAchievement.setAppUser(null);
        return this;
    }

    public Set<LearningStreak> getLearningStreaks() {
        return this.learningStreaks;
    }

    public void setLearningStreaks(Set<LearningStreak> learningStreaks) {
        if (this.learningStreaks != null) {
            this.learningStreaks.forEach(i -> i.setAppUser(null));
        }
        if (learningStreaks != null) {
            learningStreaks.forEach(i -> i.setAppUser(this));
        }
        this.learningStreaks = learningStreaks;
    }

    public AppUser learningStreaks(Set<LearningStreak> learningStreaks) {
        this.setLearningStreaks(learningStreaks);
        return this;
    }

    public AppUser addLearningStreak(LearningStreak learningStreak) {
        this.learningStreaks.add(learningStreak);
        learningStreak.setAppUser(this);
        return this;
    }

    public AppUser removeLearningStreak(LearningStreak learningStreak) {
        this.learningStreaks.remove(learningStreak);
        learningStreak.setAppUser(null);
        return this;
    }

    public Set<StudySession> getStudySessions() {
        return this.studySessions;
    }

    public void setStudySessions(Set<StudySession> studySessions) {
        if (this.studySessions != null) {
            this.studySessions.forEach(i -> i.setAppUser(null));
        }
        if (studySessions != null) {
            studySessions.forEach(i -> i.setAppUser(this));
        }
        this.studySessions = studySessions;
    }

    public AppUser studySessions(Set<StudySession> studySessions) {
        this.setStudySessions(studySessions);
        return this;
    }

    public AppUser addStudySession(StudySession studySession) {
        this.studySessions.add(studySession);
        studySession.setAppUser(this);
        return this;
    }

    public AppUser removeStudySession(StudySession studySession) {
        this.studySessions.remove(studySession);
        studySession.setAppUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

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
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUser{" +
            "id=" + getId() +
            ", displayName='" + getDisplayName() + "'" +
            ", bio='" + getBio() + "'" +
            "}";
    }
}
