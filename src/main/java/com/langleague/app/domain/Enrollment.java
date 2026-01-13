package com.langleague.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.langleague.app.domain.enumeration.EnrollmentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Enrollment.
 */
@Entity
@Table(name = "enrollment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Enrollment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "enrolled_at", nullable = false)
    private Instant enrolledAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EnrollmentStatus status;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "books", "enrollments", "progresses" }, allowSetters = true)
    private UserProfile userProfile;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "enrollments", "units", "teacherProfile" }, allowSetters = true)
    private Book book;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Enrollment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getEnrolledAt() {
        return this.enrolledAt;
    }

    public Enrollment enrolledAt(Instant enrolledAt) {
        this.setEnrolledAt(enrolledAt);
        return this;
    }

    public void setEnrolledAt(Instant enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public EnrollmentStatus getStatus() {
        return this.status;
    }

    public Enrollment status(EnrollmentStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Enrollment userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Enrollment book(Book book) {
        this.setBook(book);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Enrollment)) {
            return false;
        }
        return getId() != null && getId().equals(((Enrollment) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Enrollment{" +
            "id=" + getId() +
            ", enrolledAt='" + getEnrolledAt() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
