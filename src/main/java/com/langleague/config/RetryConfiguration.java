package com.langleague.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

/**
 * Configuration for Spring Retry.
 * Enables retry functionality for methods annotated with @Retryable.
 */
@Configuration
@EnableRetry
public class RetryConfiguration {
    // Spring Retry is now enabled
    // Methods can use @Retryable annotation
}
