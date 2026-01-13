package com.langleague.app.service.mapper;

import static com.langleague.app.domain.ExerciseAsserts.*;
import static com.langleague.app.domain.ExerciseTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExerciseMapperTest {

    private ExerciseMapper exerciseMapper;

    @BeforeEach
    void setUp() {
        exerciseMapper = new ExerciseMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getExerciseSample1();
        var actual = exerciseMapper.toEntity(exerciseMapper.toDto(expected));
        assertExerciseAllPropertiesEquals(expected, actual);
    }
}
