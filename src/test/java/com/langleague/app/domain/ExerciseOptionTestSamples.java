package com.langleague.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ExerciseOptionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ExerciseOption getExerciseOptionSample1() {
        return new ExerciseOption().id(1L).optionText("optionText1").orderIndex(1);
    }

    public static ExerciseOption getExerciseOptionSample2() {
        return new ExerciseOption().id(2L).optionText("optionText2").orderIndex(2);
    }

    public static ExerciseOption getExerciseOptionRandomSampleGenerator() {
        return new ExerciseOption()
            .id(longCount.incrementAndGet())
            .optionText(UUID.randomUUID().toString())
            .orderIndex(intCount.incrementAndGet());
    }
}
