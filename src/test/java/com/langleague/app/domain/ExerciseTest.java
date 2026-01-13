package com.langleague.app.domain;

import static com.langleague.app.domain.ExerciseOptionTestSamples.*;
import static com.langleague.app.domain.ExerciseTestSamples.*;
import static com.langleague.app.domain.UnitTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ExerciseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Exercise.class);
        Exercise exercise1 = getExerciseSample1();
        Exercise exercise2 = new Exercise();
        assertThat(exercise1).isNotEqualTo(exercise2);

        exercise2.setId(exercise1.getId());
        assertThat(exercise1).isEqualTo(exercise2);

        exercise2 = getExerciseSample2();
        assertThat(exercise1).isNotEqualTo(exercise2);
    }

    @Test
    void optionsTest() {
        Exercise exercise = getExerciseRandomSampleGenerator();
        ExerciseOption exerciseOptionBack = getExerciseOptionRandomSampleGenerator();

        exercise.addOptions(exerciseOptionBack);
        assertThat(exercise.getOptions()).containsOnly(exerciseOptionBack);
        assertThat(exerciseOptionBack.getExercise()).isEqualTo(exercise);

        exercise.removeOptions(exerciseOptionBack);
        assertThat(exercise.getOptions()).doesNotContain(exerciseOptionBack);
        assertThat(exerciseOptionBack.getExercise()).isNull();

        exercise.options(new HashSet<>(Set.of(exerciseOptionBack)));
        assertThat(exercise.getOptions()).containsOnly(exerciseOptionBack);
        assertThat(exerciseOptionBack.getExercise()).isEqualTo(exercise);

        exercise.setOptions(new HashSet<>());
        assertThat(exercise.getOptions()).doesNotContain(exerciseOptionBack);
        assertThat(exerciseOptionBack.getExercise()).isNull();
    }

    @Test
    void unitTest() {
        Exercise exercise = getExerciseRandomSampleGenerator();
        Unit unitBack = getUnitRandomSampleGenerator();

        exercise.setUnit(unitBack);
        assertThat(exercise.getUnit()).isEqualTo(unitBack);

        exercise.unit(null);
        assertThat(exercise.getUnit()).isNull();
    }
}
