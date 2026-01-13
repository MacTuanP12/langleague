package com.langleague.app.domain;

import static com.langleague.app.domain.UnitTestSamples.*;
import static com.langleague.app.domain.VocabularyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VocabularyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vocabulary.class);
        Vocabulary vocabulary1 = getVocabularySample1();
        Vocabulary vocabulary2 = new Vocabulary();
        assertThat(vocabulary1).isNotEqualTo(vocabulary2);

        vocabulary2.setId(vocabulary1.getId());
        assertThat(vocabulary1).isEqualTo(vocabulary2);

        vocabulary2 = getVocabularySample2();
        assertThat(vocabulary1).isNotEqualTo(vocabulary2);
    }

    @Test
    void unitTest() {
        Vocabulary vocabulary = getVocabularyRandomSampleGenerator();
        Unit unitBack = getUnitRandomSampleGenerator();

        vocabulary.setUnit(unitBack);
        assertThat(vocabulary.getUnit()).isEqualTo(unitBack);

        vocabulary.unit(null);
        assertThat(vocabulary.getUnit()).isNull();
    }
}
