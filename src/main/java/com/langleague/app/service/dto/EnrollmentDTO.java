package com.langleague.app.service.dto;

import com.langleague.app.domain.enumeration.EnrollmentStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.langleague.app.domain.Enrollment} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EnrollmentDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant enrolledAt;

    @NotNull
    private EnrollmentStatus status;

    @NotNull
    private UserProfileDTO userProfile;

    @NotNull
    private BookDTO book;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(Instant enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public UserProfileDTO getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfileDTO userProfile) {
        this.userProfile = userProfile;
    }

    public BookDTO getBook() {
        return book;
    }

    public void setBook(BookDTO book) {
        this.book = book;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EnrollmentDTO)) {
            return false;
        }

        EnrollmentDTO enrollmentDTO = (EnrollmentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, enrollmentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EnrollmentDTO{" +
            "id=" + getId() +
            ", enrolledAt='" + getEnrolledAt() + "'" +
            ", status='" + getStatus() + "'" +
            ", userProfile=" + getUserProfile() +
            ", book=" + getBook() +
            "}";
    }
}
