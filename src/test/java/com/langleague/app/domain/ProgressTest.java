package com.langleague.app.domain;

import static com.langleague.app.domain.ProgressTestSamples.*;
import static com.langleague.app.domain.UnitTestSamples.*;
import static com.langleague.app.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProgressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Progress.class);
        Progress progress1 = getProgressSample1();
        Progress progress2 = new Progress();
        assertThat(progress1).isNotEqualTo(progress2);

        progress2.setId(progress1.getId());
        assertThat(progress1).isEqualTo(progress2);

        progress2 = getProgressSample2();
        assertThat(progress1).isNotEqualTo(progress2);
    }

    @Test
    void userProfileTest() {
        Progress progress = getProgressRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        progress.setUserProfile(userProfileBack);
        assertThat(progress.getUserProfile()).isEqualTo(userProfileBack);

        progress.userProfile(null);
        assertThat(progress.getUserProfile()).isNull();
    }

    @Test
    void unitTest() {
        Progress progress = getProgressRandomSampleGenerator();
        Unit unitBack = getUnitRandomSampleGenerator();

        progress.setUnit(unitBack);
        assertThat(progress.getUnit()).isEqualTo(unitBack);

        progress.unit(null);
        assertThat(progress.getUnit()).isNull();
    }
}
