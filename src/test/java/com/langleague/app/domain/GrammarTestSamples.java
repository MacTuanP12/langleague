package com.langleague.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GrammarTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Grammar getGrammarSample1() {
        return new Grammar().id(1L).title("title1").orderIndex(1);
    }

    public static Grammar getGrammarSample2() {
        return new Grammar().id(2L).title("title2").orderIndex(2);
    }

    public static Grammar getGrammarRandomSampleGenerator() {
        return new Grammar().id(longCount.incrementAndGet()).title(UUID.randomUUID().toString()).orderIndex(intCount.incrementAndGet());
    }
}
