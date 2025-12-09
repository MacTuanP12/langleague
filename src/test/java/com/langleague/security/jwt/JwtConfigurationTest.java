package com.langleague.security.jwt;

import static org.assertj.core.api.Assertions.assertThat;

import com.langleague.security.JwtTestUtility;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Integration tests for JWT token generation and validation.
 *
 * This test class verifies:
 * - JWT secret configuration is loaded correctly
 * - Token generation works with configured secret
 * - Token validation works
 * - Token expiration is configured correctly
 * - Claims extraction works
 */
@SpringBootTest
@ActiveProfiles("test")
class JwtConfigurationTest {

    @Value("${jhipster.security.authentication.jwt.base64-secret}")
    private String jwtSecret;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds}")
    private long tokenValidityInSeconds;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds-for-remember-me}")
    private long rememberMeValidityInSeconds;

    private JwtTestUtility jwtTestUtility;

    @BeforeEach
    void setup() {
        jwtTestUtility = new JwtTestUtility(jwtSecret, tokenValidityInSeconds);
    }

    @Test
    void testJwtSecretIsConfigured() {
        assertThat(jwtSecret).isNotNull();
        assertThat(jwtSecret).isNotEmpty();
        assertThat(jwtSecret.length()).isGreaterThan(50); // Base64 encoded should be long
        System.out.println("✓ JWT Secret is configured (length: " + jwtSecret.length() + " characters)");
    }

    @Test
    void testJwtExpirationIsConfigured() {
        assertThat(tokenValidityInSeconds).isGreaterThan(0);
        assertThat(rememberMeValidityInSeconds).isGreaterThan(tokenValidityInSeconds);

        System.out.println("✓ JWT Expiration Settings:");
        System.out.println("  - Standard token: " + tokenValidityInSeconds + " seconds (" + (tokenValidityInSeconds / 3600) + " hours)");
        System.out.println(
            "  - Remember-me token: " + rememberMeValidityInSeconds + " seconds (" + (rememberMeValidityInSeconds / 86400) + " days)"
        );
    }

    @Test
    void testGenerateValidToken() {
        String token = jwtTestUtility.generateTestToken("testuser");

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts: header.payload.signature

        System.out.println("✓ JWT Token generated successfully");
        System.out.println("  Token preview: " + token.substring(0, Math.min(50, token.length())) + "...");
    }

    @Test
    void testValidateToken() {
        String token = jwtTestUtility.generateTestToken("testuser");
        boolean isValid = jwtTestUtility.validateToken(token);

        assertThat(isValid).isTrue();
        System.out.println("✓ JWT Token validation successful");
    }

    @Test
    void testExtractUsernameFromToken() {
        String expectedUsername = "testuser";
        String token = jwtTestUtility.generateTestToken(expectedUsername);
        String actualUsername = jwtTestUtility.getUsernameFromToken(token);

        assertThat(actualUsername).isEqualTo(expectedUsername);
        System.out.println("✓ Username extracted correctly: " + actualUsername);
    }

    @Test
    void testTokenExpiration() {
        String token = jwtTestUtility.generateTestToken("testuser");
        boolean isExpired = jwtTestUtility.isTokenExpired(token);
        Date expirationDate = jwtTestUtility.getExpirationDateFromToken(token);

        assertThat(isExpired).isFalse();
        assertThat(expirationDate).isAfter(new Date());

        long timeUntilExpiry = (expirationDate.getTime() - System.currentTimeMillis()) / 1000;
        assertThat(timeUntilExpiry).isBetween(tokenValidityInSeconds - 10, tokenValidityInSeconds + 10);

        System.out.println("✓ Token expiration configured correctly");
        System.out.println("  Expires at: " + expirationDate);
        System.out.println("  Time until expiry: " + timeUntilExpiry + " seconds");
    }

    @Test
    void testExpiredTokenIsRejected() {
        String expiredToken = jwtTestUtility.generateExpiredToken("testuser");
        boolean isValid = jwtTestUtility.validateToken(expiredToken);

        assertThat(isValid).isFalse();
        System.out.println("✓ Expired token correctly rejected");
    }

    @Test
    void testTokenWithAuthorities() {
        String[] authorities = { "ROLE_USER", "ROLE_ADMIN" };
        String token = jwtTestUtility.generateTestToken("adminuser", authorities);

        assertThat(token).isNotNull();
        boolean isValid = jwtTestUtility.validateToken(token);
        assertThat(isValid).isTrue();

        System.out.println("✓ Token with authorities generated and validated successfully");
    }

    @Test
    void testComprehensiveJwtTest() {
        boolean allTestsPassed = jwtTestUtility.runComprehensiveTest();

        assertThat(allTestsPassed).isTrue();
        System.out.println("✓ All comprehensive JWT tests passed");
    }

    @Test
    void testJwtSecretStrength() {
        // JWT secret should be at least 256 bits (32 bytes) when decoded
        // Base64 encoding increases size by ~33%, so Base64 string should be at least 44 chars
        assertThat(jwtSecret.length()).isGreaterThanOrEqualTo(44);

        // For 512-bit security (recommended), we need 64 bytes = 88 chars in Base64
        if (jwtSecret.length() >= 88) {
            System.out.println("✓ JWT Secret has strong 512-bit security");
        } else if (jwtSecret.length() >= 44) {
            System.out.println("⚠ JWT Secret has minimum 256-bit security (512-bit recommended for production)");
        } else {
            System.out.println("✗ JWT Secret is too weak!");
        }
    }

    @Test
    void testTokenValidityIsAppropriate() {
        // Standard token should be between 1 hour and 7 days
        assertThat(tokenValidityInSeconds).isBetween(3600L, 604800L);

        // Remember-me token should be between 1 day and 90 days
        assertThat(rememberMeValidityInSeconds).isBetween(86400L, 7776000L);

        System.out.println("✓ Token validity periods are within recommended ranges");
    }
}
