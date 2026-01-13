package com.langleague.app.domain;

import static com.langleague.app.domain.BookTestSamples.*;
import static com.langleague.app.domain.EnrollmentTestSamples.*;
import static com.langleague.app.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnrollmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Enrollment.class);
        Enrollment enrollment1 = getEnrollmentSample1();
        Enrollment enrollment2 = new Enrollment();
        assertThat(enrollment1).isNotEqualTo(enrollment2);

        enrollment2.setId(enrollment1.getId());
        assertThat(enrollment1).isEqualTo(enrollment2);

        enrollment2 = getEnrollmentSample2();
        assertThat(enrollment1).isNotEqualTo(enrollment2);
    }

    @Test
    void userProfileTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        enrollment.setUserProfile(userProfileBack);
        assertThat(enrollment.getUserProfile()).isEqualTo(userProfileBack);

        enrollment.userProfile(null);
        assertThat(enrollment.getUserProfile()).isNull();
    }

    @Test
    void bookTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        enrollment.setBook(bookBack);
        assertThat(enrollment.getBook()).isEqualTo(bookBack);

        enrollment.book(null);
        assertThat(enrollment.getBook()).isNull();
    }
}
