package com.langleague.app.domain;

import static com.langleague.app.domain.ExerciseOptionTestSamples.*;
import static com.langleague.app.domain.ExerciseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExerciseOptionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExerciseOption.class);
        ExerciseOption exerciseOption1 = getExerciseOptionSample1();
        ExerciseOption exerciseOption2 = new ExerciseOption();
        assertThat(exerciseOption1).isNotEqualTo(exerciseOption2);

        exerciseOption2.setId(exerciseOption1.getId());
        assertThat(exerciseOption1).isEqualTo(exerciseOption2);

        exerciseOption2 = getExerciseOptionSample2();
        assertThat(exerciseOption1).isNotEqualTo(exerciseOption2);
    }

    @Test
    void exerciseTest() {
        ExerciseOption exerciseOption = getExerciseOptionRandomSampleGenerator();
        Exercise exerciseBack = getExerciseRandomSampleGenerator();

        exerciseOption.setExercise(exerciseBack);
        assertThat(exerciseOption.getExercise()).isEqualTo(exerciseBack);

        exerciseOption.exercise(null);
        assertThat(exerciseOption.getExercise()).isNull();
    }
}
