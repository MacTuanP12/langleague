package com.langleague.config;

import java.util.Comparator;
import org.junit.jupiter.api.ClassDescriptor;
import org.junit.jupiter.api.ClassOrderer;
import org.junit.jupiter.api.ClassOrdererContext;
import org.springframework.test.context.support.TestPropertySourceUtils;

/**
 * Custom class orderer for JUnit tests to minimize Spring context creation overhead.
 */
public class SpringBootTestClassOrderer implements ClassOrderer {

    @Override
    public void orderClasses(ClassOrdererContext context) {
        context.getClassDescriptors().sort(Comparator.comparingInt(SpringBootTestClassOrderer::getOrder));
    }

    private static int getOrder(ClassDescriptor classDescriptor) {
        if (classDescriptor.findAnnotation(org.springframework.boot.test.context.SpringBootTest.class).isPresent()) {
            return 1;
        } else {
            return 0;
        }
    }
}
