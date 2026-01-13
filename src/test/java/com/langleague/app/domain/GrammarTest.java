package com.langleague.app.domain;

import static com.langleague.app.domain.GrammarTestSamples.*;
import static com.langleague.app.domain.UnitTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrammarTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grammar.class);
        Grammar grammar1 = getGrammarSample1();
        Grammar grammar2 = new Grammar();
        assertThat(grammar1).isNotEqualTo(grammar2);

        grammar2.setId(grammar1.getId());
        assertThat(grammar1).isEqualTo(grammar2);

        grammar2 = getGrammarSample2();
        assertThat(grammar1).isNotEqualTo(grammar2);
    }

    @Test
    void unitTest() {
        Grammar grammar = getGrammarRandomSampleGenerator();
        Unit unitBack = getUnitRandomSampleGenerator();

        grammar.setUnit(unitBack);
        assertThat(grammar.getUnit()).isEqualTo(unitBack);

        grammar.unit(null);
        assertThat(grammar.getUnit()).isNull();
    }
}
