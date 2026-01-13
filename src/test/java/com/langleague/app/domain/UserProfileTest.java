package com.langleague.app.domain;

import static com.langleague.app.domain.BookTestSamples.*;
import static com.langleague.app.domain.EnrollmentTestSamples.*;
import static com.langleague.app.domain.ProgressTestSamples.*;
import static com.langleague.app.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UserProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserProfile.class);
        UserProfile userProfile1 = getUserProfileSample1();
        UserProfile userProfile2 = new UserProfile();
        assertThat(userProfile1).isNotEqualTo(userProfile2);

        userProfile2.setId(userProfile1.getId());
        assertThat(userProfile1).isEqualTo(userProfile2);

        userProfile2 = getUserProfileSample2();
        assertThat(userProfile1).isNotEqualTo(userProfile2);
    }

    @Test
    void booksTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        userProfile.addBooks(bookBack);
        assertThat(userProfile.getBooks()).containsOnly(bookBack);
        assertThat(bookBack.getTeacherProfile()).isEqualTo(userProfile);

        userProfile.removeBooks(bookBack);
        assertThat(userProfile.getBooks()).doesNotContain(bookBack);
        assertThat(bookBack.getTeacherProfile()).isNull();

        userProfile.books(new HashSet<>(Set.of(bookBack)));
        assertThat(userProfile.getBooks()).containsOnly(bookBack);
        assertThat(bookBack.getTeacherProfile()).isEqualTo(userProfile);

        userProfile.setBooks(new HashSet<>());
        assertThat(userProfile.getBooks()).doesNotContain(bookBack);
        assertThat(bookBack.getTeacherProfile()).isNull();
    }

    @Test
    void enrollmentsTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        Enrollment enrollmentBack = getEnrollmentRandomSampleGenerator();

        userProfile.addEnrollments(enrollmentBack);
        assertThat(userProfile.getEnrollments()).containsOnly(enrollmentBack);
        assertThat(enrollmentBack.getUserProfile()).isEqualTo(userProfile);

        userProfile.removeEnrollments(enrollmentBack);
        assertThat(userProfile.getEnrollments()).doesNotContain(enrollmentBack);
        assertThat(enrollmentBack.getUserProfile()).isNull();

        userProfile.enrollments(new HashSet<>(Set.of(enrollmentBack)));
        assertThat(userProfile.getEnrollments()).containsOnly(enrollmentBack);
        assertThat(enrollmentBack.getUserProfile()).isEqualTo(userProfile);

        userProfile.setEnrollments(new HashSet<>());
        assertThat(userProfile.getEnrollments()).doesNotContain(enrollmentBack);
        assertThat(enrollmentBack.getUserProfile()).isNull();
    }

    @Test
    void progressesTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        Progress progressBack = getProgressRandomSampleGenerator();

        userProfile.addProgresses(progressBack);
        assertThat(userProfile.getProgresses()).containsOnly(progressBack);
        assertThat(progressBack.getUserProfile()).isEqualTo(userProfile);

        userProfile.removeProgresses(progressBack);
        assertThat(userProfile.getProgresses()).doesNotContain(progressBack);
        assertThat(progressBack.getUserProfile()).isNull();

        userProfile.progresses(new HashSet<>(Set.of(progressBack)));
        assertThat(userProfile.getProgresses()).containsOnly(progressBack);
        assertThat(progressBack.getUserProfile()).isEqualTo(userProfile);

        userProfile.setProgresses(new HashSet<>());
        assertThat(userProfile.getProgresses()).doesNotContain(progressBack);
        assertThat(progressBack.getUserProfile()).isNull();
    }
}
