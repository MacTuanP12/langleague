package com.langleague.app.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class EnrollmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Enrollment getEnrollmentSample1() {
        return new Enrollment().id(1L);
    }

    public static Enrollment getEnrollmentSample2() {
        return new Enrollment().id(2L);
    }

    public static Enrollment getEnrollmentRandomSampleGenerator() {
        return new Enrollment().id(longCount.incrementAndGet());
    }
}
