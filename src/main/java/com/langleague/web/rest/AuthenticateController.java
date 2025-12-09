package com.langleague.web.rest;

import static com.langleague.security.SecurityUtils.AUTHORITIES_CLAIM;
import static com.langleague.security.SecurityUtils.JWT_ALGORITHM;
import static com.langleague.security.SecurityUtils.USER_ID_CLAIM;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.langleague.security.CaptchaService;
import com.langleague.security.DomainUserDetailsService.UserWithId;
import com.langleague.security.LoginAttemptService;
import com.langleague.web.rest.vm.LoginVM;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to authenticate users.
 * Use case 1: Login
 * Use case 2: Logout (client-side JWT removal)
 */
@Tag(name = "Authentication", description = "User authentication and JWT token management")
@RestController
@RequestMapping("/api")
public class AuthenticateController {

    private static final Logger LOG = LoggerFactory.getLogger(AuthenticateController.class);

    private final JwtEncoder jwtEncoder;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds:0}")
    private long tokenValidityInSeconds;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds-for-remember-me:0}")
    private long tokenValidityInSecondsForRememberMe;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final CaptchaService captchaService;
    private final LoginAttemptService loginAttemptService;

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    public AuthenticateController(
        JwtEncoder jwtEncoder,
        AuthenticationManagerBuilder authenticationManagerBuilder,
        CaptchaService captchaService,
        LoginAttemptService loginAttemptService
    ) {
        this.captchaService = captchaService;
        this.jwtEncoder = jwtEncoder;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.loginAttemptService = loginAttemptService;
    }

    /**
     * {@code POST /authenticate} : login user with JWT + captcha verification.
     *
     * @param loginVM contains username, password, rememberMe, captchaId, captchaValue
     * @return JWT token if success, 400 if captcha invalid
     */
    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        // --- Skip captcha verification in dev/test environment ---
        boolean skipCaptcha = activeProfile != null && (activeProfile.contains("dev") || activeProfile.contains("test"));

        if (!skipCaptcha) {
            // --- Verify captcha first ---
            boolean captchaValid = captchaService.verifyCaptcha(loginVM.getCaptchaId(), loginVM.getCaptchaValue());
            if (!captchaValid) {
                LOG.warn("Captcha verification failed for captchaId={}", loginVM.getCaptchaId());
                return ResponseEntity.badRequest().build(); // trả 400 nếu captcha không hợp lệ
            }
        } else {
            LOG.debug("Captcha verification skipped for {} environment", activeProfile);
        }

        // --- Authenticate user credentials ---
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginVM.getUsername(),
                loginVM.getPassword()
            );
            // --- Set JWT token in Authorization header ---
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // SUCCESS: Reset failed login attempts
            loginAttemptService.loginSucceeded(loginVM.getUsername());

            // Handle null rememberMe - default to false
            boolean rememberMe = loginVM.isRememberMe() != null && loginVM.isRememberMe();
            String jwt = this.createToken(authentication, rememberMe);

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setBearerAuth(jwt);
            return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
        } catch (org.springframework.security.core.AuthenticationException e) {
            // FAILURE: Increment failed login attempts
            loginAttemptService.loginFailed(loginVM.getUsername());
            LOG.warn("Authentication failed for user: {}", loginVM.getUsername());
            throw e;
        }
    }

    /**
     * {@code GET /authenticate} : check if the user is authenticated.
     *
     * @return the {@link ResponseEntity} with status {@code 204 (No Content)},
     * or with status {@code 401 (Unauthorized)} if not authenticated.
     */
    @GetMapping("/authenticate")
    public ResponseEntity<Void> isAuthenticated(Principal principal) {
        LOG.debug("REST request to check if the current user is authenticated");
        return ResponseEntity.status(principal == null ? HttpStatus.UNAUTHORIZED : HttpStatus.NO_CONTENT).build();
    }

    public String createToken(Authentication authentication, boolean rememberMe) {
        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));

        Instant now = Instant.now();
        Instant validity;
        if (rememberMe) {
            validity = now.plus(this.tokenValidityInSecondsForRememberMe, ChronoUnit.SECONDS);
        } else {
            validity = now.plus(this.tokenValidityInSeconds, ChronoUnit.SECONDS);
        }

        LOG.debug(
            "Creating JWT token for user: {}, issuedAt: {}, expiresAt: {}, validitySeconds: {}, rememberMe: {}",
            authentication.getName(),
            now,
            validity,
            rememberMe ? this.tokenValidityInSecondsForRememberMe : this.tokenValidityInSeconds,
            rememberMe
        );

        // @formatter:off
        JwtClaimsSet.Builder builder = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(authentication.getName())
            .claim(AUTHORITIES_CLAIM, authorities);
        if (authentication.getPrincipal() instanceof UserWithId user) {
            builder.claim(USER_ID_CLAIM, user.getId());
        }

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        String token = this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, builder.build())).getTokenValue();
        LOG.debug("JWT token created successfully for user: {}", authentication.getName());
        return token;
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
