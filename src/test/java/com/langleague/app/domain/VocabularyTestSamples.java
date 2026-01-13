package com.langleague.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class VocabularyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Vocabulary getVocabularySample1() {
        return new Vocabulary().id(1L).word("word1").phonetic("phonetic1").meaning("meaning1").imageUrl("imageUrl1").orderIndex(1);
    }

    public static Vocabulary getVocabularySample2() {
        return new Vocabulary().id(2L).word("word2").phonetic("phonetic2").meaning("meaning2").imageUrl("imageUrl2").orderIndex(2);
    }

    public static Vocabulary getVocabularyRandomSampleGenerator() {
        return new Vocabulary()
            .id(longCount.incrementAndGet())
            .word(UUID.randomUUID().toString())
            .phonetic(UUID.randomUUID().toString())
            .meaning(UUID.randomUUID().toString())
            .imageUrl(UUID.randomUUID().toString())
            .orderIndex(intCount.incrementAndGet());
    }
}
