package com.langleague.app.domain;

import static com.langleague.app.domain.BookTestSamples.*;
import static com.langleague.app.domain.EnrollmentTestSamples.*;
import static com.langleague.app.domain.UnitTestSamples.*;
import static com.langleague.app.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Book.class);
        Book book1 = getBookSample1();
        Book book2 = new Book();
        assertThat(book1).isNotEqualTo(book2);

        book2.setId(book1.getId());
        assertThat(book1).isEqualTo(book2);

        book2 = getBookSample2();
        assertThat(book1).isNotEqualTo(book2);
    }

    @Test
    void enrollmentsTest() {
        Book book = getBookRandomSampleGenerator();
        Enrollment enrollmentBack = getEnrollmentRandomSampleGenerator();

        book.addEnrollments(enrollmentBack);
        assertThat(book.getEnrollments()).containsOnly(enrollmentBack);
        assertThat(enrollmentBack.getBook()).isEqualTo(book);

        book.removeEnrollments(enrollmentBack);
        assertThat(book.getEnrollments()).doesNotContain(enrollmentBack);
        assertThat(enrollmentBack.getBook()).isNull();

        book.enrollments(new HashSet<>(Set.of(enrollmentBack)));
        assertThat(book.getEnrollments()).containsOnly(enrollmentBack);
        assertThat(enrollmentBack.getBook()).isEqualTo(book);

        book.setEnrollments(new HashSet<>());
        assertThat(book.getEnrollments()).doesNotContain(enrollmentBack);
        assertThat(enrollmentBack.getBook()).isNull();
    }

    @Test
    void unitsTest() {
        Book book = getBookRandomSampleGenerator();
        Unit unitBack = getUnitRandomSampleGenerator();

        book.addUnits(unitBack);
        assertThat(book.getUnits()).containsOnly(unitBack);
        assertThat(unitBack.getBook()).isEqualTo(book);

        book.removeUnits(unitBack);
        assertThat(book.getUnits()).doesNotContain(unitBack);
        assertThat(unitBack.getBook()).isNull();

        book.units(new HashSet<>(Set.of(unitBack)));
        assertThat(book.getUnits()).containsOnly(unitBack);
        assertThat(unitBack.getBook()).isEqualTo(book);

        book.setUnits(new HashSet<>());
        assertThat(book.getUnits()).doesNotContain(unitBack);
        assertThat(unitBack.getBook()).isNull();
    }

    @Test
    void teacherProfileTest() {
        Book book = getBookRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        book.setTeacherProfile(userProfileBack);
        assertThat(book.getTeacherProfile()).isEqualTo(userProfileBack);

        book.teacherProfile(null);
        assertThat(book.getTeacherProfile()).isNull();
    }
}
