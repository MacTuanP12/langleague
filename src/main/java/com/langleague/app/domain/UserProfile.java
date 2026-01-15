package com.langleague.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.app.domain.enumeration.ThemeMode;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Min(0)
    @Column(name = "streak_count")
    private Integer streakCount;

    @Column(name = "last_learning_date")
    private Instant lastLearningDate;

    @Size(max = 1000)
    @Lob
    @Column(name = "bio", length = 1000)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "theme")
    private ThemeMode theme;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "teacherProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "enrollments", "units", "teacherProfile" }, allowSetters = true)
    private Set<Book> books = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "book" }, allowSetters = true)
    private Set<Enrollment> enrollments = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "unit" }, allowSetters = true)
    private Set<Progress> progresses = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "unit" }, allowSetters = true)
    private Set<Note> notes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStreakCount() {
        return this.streakCount;
    }

    public UserProfile streakCount(Integer streakCount) {
        this.setStreakCount(streakCount);
        return this;
    }

    public void setStreakCount(Integer streakCount) {
        this.streakCount = streakCount;
    }

    public Instant getLastLearningDate() {
        return this.lastLearningDate;
    }

    public UserProfile lastLearningDate(Instant lastLearningDate) {
        this.setLastLearningDate(lastLearningDate);
        return this;
    }

    public void setLastLearningDate(Instant lastLearningDate) {
        this.lastLearningDate = lastLearningDate;
    }

    public String getBio() {
        return this.bio;
    }

    public UserProfile bio(String bio) {
        this.setBio(bio);
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public ThemeMode getTheme() {
        return this.theme;
    }

    public UserProfile theme(ThemeMode theme) {
        this.setTheme(theme);
        return this;
    }

    public void setTheme(ThemeMode theme) {
        this.theme = theme;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserProfile user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Book> getBooks() {
        return this.books;
    }

    public void setBooks(Set<Book> books) {
        if (this.books != null) {
            this.books.forEach(i -> i.setTeacherProfile(null));
        }
        if (books != null) {
            books.forEach(i -> i.setTeacherProfile(this));
        }
        this.books = books;
    }

    public UserProfile books(Set<Book> books) {
        this.setBooks(books);
        return this;
    }

    public UserProfile addBooks(Book book) {
        this.books.add(book);
        book.setTeacherProfile(this);
        return this;
    }

    public UserProfile removeBooks(Book book) {
        this.books.remove(book);
        book.setTeacherProfile(null);
        return this;
    }

    public Set<Enrollment> getEnrollments() {
        return this.enrollments;
    }

    public void setEnrollments(Set<Enrollment> enrollments) {
        if (this.enrollments != null) {
            this.enrollments.forEach(i -> i.setUserProfile(null));
        }
        if (enrollments != null) {
            enrollments.forEach(i -> i.setUserProfile(this));
        }
        this.enrollments = enrollments;
    }

    public UserProfile enrollments(Set<Enrollment> enrollments) {
        this.setEnrollments(enrollments);
        return this;
    }

    public UserProfile addEnrollments(Enrollment enrollment) {
        this.enrollments.add(enrollment);
        enrollment.setUserProfile(this);
        return this;
    }

    public UserProfile removeEnrollments(Enrollment enrollment) {
        this.enrollments.remove(enrollment);
        enrollment.setUserProfile(null);
        return this;
    }

    public Set<Progress> getProgresses() {
        return this.progresses;
    }

    public void setProgresses(Set<Progress> progresses) {
        if (this.progresses != null) {
            this.progresses.forEach(i -> i.setUserProfile(null));
        }
        if (progresses != null) {
            progresses.forEach(i -> i.setUserProfile(this));
        }
        this.progresses = progresses;
    }

    public UserProfile progresses(Set<Progress> progresses) {
        this.setProgresses(progresses);
        return this;
    }

    public UserProfile addProgresses(Progress progress) {
        this.progresses.add(progress);
        progress.setUserProfile(this);
        return this;
    }

    public UserProfile removeProgresses(Progress progress) {
        this.progresses.remove(progress);
        progress.setUserProfile(null);
        return this;
    }

    public Set<Note> getNotes() {
        return this.notes;
    }

    public void setNotes(Set<Note> notes) {
        if (this.notes != null) {
            this.notes.forEach(i -> i.setUserProfile(null));
        }
        if (notes != null) {
            notes.forEach(i -> i.setUserProfile(this));
        }
        this.notes = notes;
    }

    public UserProfile notes(Set<Note> notes) {
        this.setNotes(notes);
        return this;
    }

    public UserProfile addNotes(Note note) {
        this.notes.add(note);
        note.setUserProfile(this);
        return this;
    }

    public UserProfile removeNotes(Note note) {
        this.notes.remove(note);
        note.setUserProfile(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return getId() != null && getId().equals(((UserProfile) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", streakCount=" + getStreakCount() +
            ", lastLearningDate='" + getLastLearningDate() + "'" +
            ", bio='" + getBio() + "'" +
            ", theme='" + getTheme() + "'" +
            "}";
    }
}
