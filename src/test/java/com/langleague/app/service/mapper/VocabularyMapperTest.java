package com.langleague.app.service.mapper;

import static com.langleague.app.domain.VocabularyAsserts.*;
import static com.langleague.app.domain.VocabularyTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class VocabularyMapperTest {

    private VocabularyMapper vocabularyMapper;

    @BeforeEach
    void setUp() {
        vocabularyMapper = new VocabularyMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getVocabularySample1();
        var actual = vocabularyMapper.toEntity(vocabularyMapper.toDto(expected));
        assertVocabularyAllPropertiesEquals(expected, actual);
    }
}
