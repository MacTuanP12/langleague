package com.langleague.app.domain;

import static com.langleague.app.domain.BookTestSamples.*;
import static com.langleague.app.domain.ExerciseTestSamples.*;
import static com.langleague.app.domain.GrammarTestSamples.*;
import static com.langleague.app.domain.ProgressTestSamples.*;
import static com.langleague.app.domain.UnitTestSamples.*;
import static com.langleague.app.domain.VocabularyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UnitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Unit.class);
        Unit unit1 = getUnitSample1();
        Unit unit2 = new Unit();
        assertThat(unit1).isNotEqualTo(unit2);

        unit2.setId(unit1.getId());
        assertThat(unit1).isEqualTo(unit2);

        unit2 = getUnitSample2();
        assertThat(unit1).isNotEqualTo(unit2);
    }

    @Test
    void vocabulariesTest() {
        Unit unit = getUnitRandomSampleGenerator();
        Vocabulary vocabularyBack = getVocabularyRandomSampleGenerator();

        unit.addVocabularies(vocabularyBack);
        assertThat(unit.getVocabularies()).containsOnly(vocabularyBack);
        assertThat(vocabularyBack.getUnit()).isEqualTo(unit);

        unit.removeVocabularies(vocabularyBack);
        assertThat(unit.getVocabularies()).doesNotContain(vocabularyBack);
        assertThat(vocabularyBack.getUnit()).isNull();

        unit.vocabularies(new HashSet<>(Set.of(vocabularyBack)));
        assertThat(unit.getVocabularies()).containsOnly(vocabularyBack);
        assertThat(vocabularyBack.getUnit()).isEqualTo(unit);

        unit.setVocabularies(new HashSet<>());
        assertThat(unit.getVocabularies()).doesNotContain(vocabularyBack);
        assertThat(vocabularyBack.getUnit()).isNull();
    }

    @Test
    void grammarsTest() {
        Unit unit = getUnitRandomSampleGenerator();
        Grammar grammarBack = getGrammarRandomSampleGenerator();

        unit.addGrammars(grammarBack);
        assertThat(unit.getGrammars()).containsOnly(grammarBack);
        assertThat(grammarBack.getUnit()).isEqualTo(unit);

        unit.removeGrammars(grammarBack);
        assertThat(unit.getGrammars()).doesNotContain(grammarBack);
        assertThat(grammarBack.getUnit()).isNull();

        unit.grammars(new HashSet<>(Set.of(grammarBack)));
        assertThat(unit.getGrammars()).containsOnly(grammarBack);
        assertThat(grammarBack.getUnit()).isEqualTo(unit);

        unit.setGrammars(new HashSet<>());
        assertThat(unit.getGrammars()).doesNotContain(grammarBack);
        assertThat(grammarBack.getUnit()).isNull();
    }

    @Test
    void exercisesTest() {
        Unit unit = getUnitRandomSampleGenerator();
        Exercise exerciseBack = getExerciseRandomSampleGenerator();

        unit.addExercises(exerciseBack);
        assertThat(unit.getExercises()).containsOnly(exerciseBack);
        assertThat(exerciseBack.getUnit()).isEqualTo(unit);

        unit.removeExercises(exerciseBack);
        assertThat(unit.getExercises()).doesNotContain(exerciseBack);
        assertThat(exerciseBack.getUnit()).isNull();

        unit.exercises(new HashSet<>(Set.of(exerciseBack)));
        assertThat(unit.getExercises()).containsOnly(exerciseBack);
        assertThat(exerciseBack.getUnit()).isEqualTo(unit);

        unit.setExercises(new HashSet<>());
        assertThat(unit.getExercises()).doesNotContain(exerciseBack);
        assertThat(exerciseBack.getUnit()).isNull();
    }

    @Test
    void progressesTest() {
        Unit unit = getUnitRandomSampleGenerator();
        Progress progressBack = getProgressRandomSampleGenerator();

        unit.addProgresses(progressBack);
        assertThat(unit.getProgresses()).containsOnly(progressBack);
        assertThat(progressBack.getUnit()).isEqualTo(unit);

        unit.removeProgresses(progressBack);
        assertThat(unit.getProgresses()).doesNotContain(progressBack);
        assertThat(progressBack.getUnit()).isNull();

        unit.progresses(new HashSet<>(Set.of(progressBack)));
        assertThat(unit.getProgresses()).containsOnly(progressBack);
        assertThat(progressBack.getUnit()).isEqualTo(unit);

        unit.setProgresses(new HashSet<>());
        assertThat(unit.getProgresses()).doesNotContain(progressBack);
        assertThat(progressBack.getUnit()).isNull();
    }

    @Test
    void bookTest() {
        Unit unit = getUnitRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        unit.setBook(bookBack);
        assertThat(unit.getBook()).isEqualTo(bookBack);

        unit.book(null);
        assertThat(unit.getBook()).isNull();
    }
}
