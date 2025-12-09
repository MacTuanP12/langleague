package com.langleague.security;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service to track authentication events for monitoring
 */
@Service
public class SecurityMetersService {

    private final Counter authenticationSuccessCounter;
    private final Counter authenticationFailureCounter;

    public SecurityMetersService(MeterRegistry meterRegistry) {
        this.authenticationSuccessCounter = meterRegistry.counter("authentication.success");
        this.authenticationFailureCounter = meterRegistry.counter("authentication.failure");
    }

    public void trackAuthenticationSuccess() {
        authenticationSuccessCounter.increment();
    }

    public void trackAuthenticationFailure() {
        authenticationFailureCounter.increment();
    }
}
