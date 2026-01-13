package com.langleague.app.service.mapper;

import static com.langleague.app.domain.ProgressAsserts.*;
import static com.langleague.app.domain.ProgressTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProgressMapperTest {

    private ProgressMapper progressMapper;

    @BeforeEach
    void setUp() {
        progressMapper = new ProgressMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProgressSample1();
        var actual = progressMapper.toEntity(progressMapper.toDto(expected));
        assertProgressAllPropertiesEquals(expected, actual);
    }
}
