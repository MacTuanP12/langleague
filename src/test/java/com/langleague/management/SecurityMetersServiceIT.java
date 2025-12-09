package com.langleague.management;

import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.IntegrationTest;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Integration tests for {@link SecurityMetersService}.
 */
@IntegrationTest
class SecurityMetersServiceIT {

    @Autowired
    private MeterRegistry meterRegistry;

    private SecurityMetersService securityMetersService;

    @BeforeEach
    public void setup() {
        securityMetersService = new SecurityMetersService(meterRegistry);
    }

    @Test
    void testInvalidSignature() {
        Counter counter = meterRegistry.counter("security.authentication.invalid-tokens", "cause", "invalid-signature");
        double count = counter.count();

        securityMetersService.trackTokenInvalidSignature();

        assertThat(counter.count()).isEqualTo(count + 1);
    }

    @Test
    void testExpiredToken() {
        Counter counter = meterRegistry.counter("security.authentication.invalid-tokens", "cause", "expired");
        double count = counter.count();

        securityMetersService.trackTokenExpired();

        assertThat(counter.count()).isEqualTo(count + 1);
    }

    @Test
    void testUnsupportedToken() {
        Counter counter = meterRegistry.counter("security.authentication.invalid-tokens", "cause", "unsupported");
        double count = counter.count();

        securityMetersService.trackTokenUnsupported();

        assertThat(counter.count()).isEqualTo(count + 1);
    }

    @Test
    void testMalformedToken() {
        Counter counter = meterRegistry.counter("security.authentication.invalid-tokens", "cause", "malformed");
        double count = counter.count();

        securityMetersService.trackTokenMalformed();

        assertThat(counter.count()).isEqualTo(count + 1);
    }
}
