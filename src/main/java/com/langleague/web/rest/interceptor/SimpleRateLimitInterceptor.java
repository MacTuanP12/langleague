package com.langleague.web.rest.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Simple rate limiting interceptor without external dependencies
 * Uses token bucket algorithm with in-memory storage
 */
@Component
public class SimpleRateLimitInterceptor implements HandlerInterceptor {

    private static final Logger LOG = LoggerFactory.getLogger(SimpleRateLimitInterceptor.class);

    // In-memory storage for rate limiting data
    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientId = getClientId(request);
        String requestPath = request.getRequestURI();

        // Get rate limit config for this path
        RateLimitConfig config = getRateLimitConfig(requestPath);

        // Get or create token bucket for this client
        String bucketKey = clientId + ":" + config.category;
        TokenBucket bucket = buckets.computeIfAbsent(bucketKey, k -> new TokenBucket(config.capacity, config.refillDuration));

        // Try to consume a token
        if (bucket.tryConsume()) {
            // Add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            return true;
        } else {
            // Rate limit exceeded
            long waitSeconds = bucket.getSecondsUntilRefill();
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitSeconds));
            response.setContentType("application/json");
            response
                .getWriter()
                .write(
                    String.format(
                        "{\"error\":\"Too many requests\",\"message\":\"Rate limit exceeded. Please try again in %d seconds.\"}",
                        waitSeconds
                    )
                );
            LOG.warn("Rate limit exceeded for client: {} on path: {}", clientId, requestPath);
            return false;
        }
    }

    /**
     * Get client identifier (IP address)
     */
    private String getClientId(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }

    /**
     * Get rate limit configuration for path
     */
    private RateLimitConfig getRateLimitConfig(String path) {
        if (path.contains("/authenticate") || path.contains("/login")) {
            return new RateLimitConfig("auth", 5, Duration.ofMinutes(1));
        } else if (path.contains("/register")) {
            return new RateLimitConfig("register", 3, Duration.ofHours(1));
        } else if (path.contains("/admin")) {
            return new RateLimitConfig("admin", 50, Duration.ofMinutes(1));
        } else if (path.contains("/upload")) {
            return new RateLimitConfig("upload", 10, Duration.ofMinutes(5));
        }
        return new RateLimitConfig("api", 100, Duration.ofMinutes(1));
    }

    /**
     * Rate limit configuration
     */
    private static class RateLimitConfig {

        String category;
        int capacity;
        Duration refillDuration;

        RateLimitConfig(String category, int capacity, Duration refillDuration) {
            this.category = category;
            this.capacity = capacity;
            this.refillDuration = refillDuration;
        }
    }

    /**
     * Simple token bucket implementation
     */
    private static class TokenBucket {

        private final int capacity;
        private final Duration refillDuration;
        private int availableTokens;
        private Instant lastRefillTime;

        TokenBucket(int capacity, Duration refillDuration) {
            this.capacity = capacity;
            this.refillDuration = refillDuration;
            this.availableTokens = capacity;
            this.lastRefillTime = Instant.now();
        }

        synchronized boolean tryConsume() {
            refill();
            if (availableTokens > 0) {
                availableTokens--;
                return true;
            }
            return false;
        }

        synchronized int getAvailableTokens() {
            refill();
            return availableTokens;
        }

        synchronized long getSecondsUntilRefill() {
            Duration timeSinceRefill = Duration.between(lastRefillTime, Instant.now());
            long secondsUntilRefill = refillDuration.getSeconds() - timeSinceRefill.getSeconds();
            return Math.max(0, secondsUntilRefill);
        }

        private void refill() {
            Instant now = Instant.now();
            Duration timePassed = Duration.between(lastRefillTime, now);

            if (timePassed.compareTo(refillDuration) >= 0) {
                availableTokens = capacity;
                lastRefillTime = now;
            }
        }
    }
}
