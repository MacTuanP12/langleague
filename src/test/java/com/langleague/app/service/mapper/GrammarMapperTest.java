package com.langleague.app.service.mapper;

import static com.langleague.app.domain.GrammarAsserts.*;
import static com.langleague.app.domain.GrammarTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GrammarMapperTest {

    private GrammarMapper grammarMapper;

    @BeforeEach
    void setUp() {
        grammarMapper = new GrammarMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGrammarSample1();
        var actual = grammarMapper.toEntity(grammarMapper.toDto(expected));
        assertGrammarAllPropertiesEquals(expected, actual);
    }
}
