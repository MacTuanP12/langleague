package com.langleague.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility class for testing and validating JWT token generation and validation.
 *
 * This class provides methods to:
 * - Generate test JWT tokens
 * - Validate JWT tokens
 * - Extract claims from tokens
 * - Verify token expiration
 *
 * Usage:
 * JwtTestUtility utility = new JwtTestUtility("your-base64-secret");
 * String token = utility.generateTestToken("testuser");
 * boolean isValid = utility.validateToken(token);
 */
public class JwtTestUtility {

    private static final Logger log = LoggerFactory.getLogger(JwtTestUtility.class);

    private final SecretKey secretKey;
    private final long tokenValidityInSeconds;
    private static final String AUTHORITIES_KEY = "auth";

    /**
     * Constructor with base64-encoded secret and validity period.
     *
     * @param base64Secret Base64-encoded secret key (minimum 256 bits)
     * @param tokenValidityInSeconds Token validity period in seconds
     */
    public JwtTestUtility(String base64Secret, long tokenValidityInSeconds) {
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.tokenValidityInSeconds = tokenValidityInSeconds;
        log.info("JwtTestUtility initialized with key length: {} bits", keyBytes.length * 8);
    }

    /**
     * Constructor with base64-encoded secret (uses default 24-hour validity).
     *
     * @param base64Secret Base64-encoded secret key (minimum 256 bits)
     */
    public JwtTestUtility(String base64Secret) {
        this(base64Secret, 86400); // 24 hours default
    }

    /**
     * Generate a test JWT token with the given username.
     *
     * @param username The username to include in the token
     * @return Generated JWT token string
     */
    public String generateTestToken(String username) {
        return generateTestToken(username, new String[] { "ROLE_USER" });
    }

    /**
     * Generate a test JWT token with username and authorities.
     *
     * @param username The username to include in the token
     * @param authorities Array of authority strings (e.g., "ROLE_USER", "ROLE_ADMIN")
     * @return Generated JWT token string
     */
    public String generateTestToken(String username, String[] authorities) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(tokenValidityInSeconds);

        Map<String, Object> claims = new HashMap<>();
        claims.put(AUTHORITIES_KEY, authorities);

        String token = Jwts.builder()
            .setClaims(claims)
            .setSubject(username)
            .setIssuer("langleague")
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiry))
            .signWith(secretKey, SignatureAlgorithm.HS512)
            .compact();

        log.info("Generated token for user: {} with expiry: {}", username, expiry);
        return token;
    }

    /**
     * Generate an expired JWT token for testing expiration handling.
     *
     * @param username The username to include in the token
     * @return Expired JWT token string
     */
    public String generateExpiredToken(String username) {
        Instant now = Instant.now();
        Instant expiry = now.minusSeconds(3600); // Expired 1 hour ago

        String token = Jwts.builder()
            .setSubject(username)
            .setIssuer("langleague")
            .setIssuedAt(Date.from(now.minusSeconds(7200)))
            .setExpiration(Date.from(expiry))
            .signWith(secretKey, SignatureAlgorithm.HS512)
            .compact();

        log.info("Generated expired token for user: {}", username);
        return token;
    }

    /**
     * Validate a JWT token.
     *
     * @param token JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);

            log.info("Token validation successful");
            return true;
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract username from JWT token.
     *
     * @param token JWT token
     * @return Username from token subject
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();

        return claims.getSubject();
    }

    /**
     * Extract expiration date from JWT token.
     *
     * @param token JWT token
     * @return Expiration date
     */
    public Date getExpirationDateFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();

        return claims.getExpiration();
    }

    /**
     * Check if JWT token is expired.
     *
     * @param token JWT token
     * @return true if token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            boolean expired = expiration.before(new Date());
            log.info("Token expiration check: expired={}, expiry={}", expired, expiration);
            return expired;
        } catch (Exception e) {
            log.error("Error checking token expiration: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Get all claims from JWT token.
     *
     * @param token JWT token
     * @return Claims object containing all token claims
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }

    /**
     * Run a comprehensive test of JWT token generation and validation.
     *
     * @return true if all tests pass, false otherwise
     */
    public boolean runComprehensiveTest() {
        log.info("=== Starting JWT Comprehensive Test ===");

        try {
            // Test 1: Generate valid token
            log.info("Test 1: Generating valid token...");
            String token = generateTestToken("testuser", new String[] { "ROLE_USER", "ROLE_ADMIN" });
            log.info("Generated token: {}...", token.substring(0, Math.min(50, token.length())));

            // Test 2: Validate token
            log.info("Test 2: Validating token...");
            boolean isValid = validateToken(token);
            if (!isValid) {
                log.error("Test 2 FAILED: Token validation failed");
                return false;
            }
            log.info("Test 2 PASSED: Token is valid");

            // Test 3: Extract username
            log.info("Test 3: Extracting username...");
            String username = getUsernameFromToken(token);
            if (!"testuser".equals(username)) {
                log.error("Test 3 FAILED: Expected 'testuser', got '{}'", username);
                return false;
            }
            log.info("Test 3 PASSED: Username extracted correctly: {}", username);

            // Test 4: Check expiration
            log.info("Test 4: Checking expiration...");
            boolean expired = isTokenExpired(token);
            if (expired) {
                log.error("Test 4 FAILED: Token should not be expired");
                return false;
            }
            Date expirationDate = getExpirationDateFromToken(token);
            log.info("Test 4 PASSED: Token not expired. Expires at: {}", expirationDate);

            // Test 5: Test expired token
            log.info("Test 5: Testing expired token...");
            String expiredToken = generateExpiredToken("testuser");
            boolean isExpiredValid = validateToken(expiredToken);
            if (isExpiredValid) {
                log.error("Test 5 FAILED: Expired token should not validate");
                return false;
            }
            log.info("Test 5 PASSED: Expired token correctly rejected");

            // Test 6: Extract all claims
            log.info("Test 6: Extracting all claims...");
            Claims claims = getClaimsFromToken(token);
            log.info(
                "Test 6 PASSED: Claims extracted - Subject: {}, Issuer: {}, Expiry: {}",
                claims.getSubject(),
                claims.getIssuer(),
                claims.getExpiration()
            );

            log.info("=== JWT Comprehensive Test COMPLETED SUCCESSFULLY ===");
            return true;
        } catch (Exception e) {
            log.error("JWT Test FAILED with exception: ", e);
            return false;
        }
    }

    /**
     * Main method for standalone testing.
     *
     * Usage: java JwtTestUtility <base64-secret>
     */
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java JwtTestUtility <base64-secret>");
            System.out.println("Example: java JwtTestUtility ZjNhOGM5YzE1ZDQ3...");
            System.exit(1);
        }

        String base64Secret = args[0];
        JwtTestUtility utility = new JwtTestUtility(base64Secret);

        boolean success = utility.runComprehensiveTest();
        System.exit(success ? 0 : 1);
    }
}
