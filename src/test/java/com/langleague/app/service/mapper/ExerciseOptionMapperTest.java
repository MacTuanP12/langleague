package com.langleague.app.service.mapper;

import static com.langleague.app.domain.ExerciseOptionAsserts.*;
import static com.langleague.app.domain.ExerciseOptionTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExerciseOptionMapperTest {

    private ExerciseOptionMapper exerciseOptionMapper;

    @BeforeEach
    void setUp() {
        exerciseOptionMapper = new ExerciseOptionMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getExerciseOptionSample1();
        var actual = exerciseOptionMapper.toEntity(exerciseOptionMapper.toDto(expected));
        assertExerciseOptionAllPropertiesEquals(expected, actual);
    }
}
