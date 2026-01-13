package com.langleague.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ExerciseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Exercise getExerciseSample1() {
        return new Exercise().id(1L).audioUrl("audioUrl1").imageUrl("imageUrl1").orderIndex(1);
    }

    public static Exercise getExerciseSample2() {
        return new Exercise().id(2L).audioUrl("audioUrl2").imageUrl("imageUrl2").orderIndex(2);
    }

    public static Exercise getExerciseRandomSampleGenerator() {
        return new Exercise()
            .id(longCount.incrementAndGet())
            .audioUrl(UUID.randomUUID().toString())
            .imageUrl(UUID.randomUUID().toString())
            .orderIndex(intCount.incrementAndGet());
    }
}
