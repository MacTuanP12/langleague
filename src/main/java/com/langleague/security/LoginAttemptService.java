package com.langleague.security;

import com.langleague.domain.User;
import com.langleague.repository.UserRepository;
import com.langleague.service.MailService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for tracking and managing login attempts.
 * Automatically locks accounts after multiple failed attempts.
 */
@Service
@Transactional
public class LoginAttemptService {

    private static final Logger LOG = LoggerFactory.getLogger(LoginAttemptService.class);

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final MailService mailService;

    public LoginAttemptService(UserRepository userRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    /**
     * Record a successful login and reset failed attempts counter.
     *
     * @param username the username or email
     */
    public void loginSucceeded(String username) {
        findUserByUsernameOrEmail(username).ifPresent(user -> {
            if (user.getFailedLoginAttempts() > 0) {
                LOG.debug("Resetting failed login attempts for user: {}", user.getLogin());
                user.setFailedLoginAttempts(0);
                user.setLastFailedLogin(null);
                userRepository.save(user);
            }
        });
    }

    /**
     * Record a failed login attempt and lock account if threshold exceeded.
     *
     * @param username the username or email
     */
    public void loginFailed(String username) {
        findUserByUsernameOrEmail(username).ifPresent(user -> {
            int attempts = (user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() : 0) + 1;
            user.setFailedLoginAttempts(attempts);
            user.setLastFailedLogin(Instant.now());

            LOG.warn("Failed login attempt #{} for user: {}", attempts, user.getLogin());

            if (attempts >= MAX_ATTEMPTS) {
                Instant lockUntil = Instant.now().plus(LOCK_DURATION_MINUTES, ChronoUnit.MINUTES);
                user.setLockedUntil(lockUntil);
                LOG.warn("Account temporarily locked for user: {} until {}", user.getLogin(), lockUntil);

                try {
                    mailService.sendAccountLockedEmail(user, LOCK_DURATION_MINUTES);
                } catch (Exception e) {
                    LOG.error("Failed to send account locked email to: {}", user.getEmail(), e);
                }
            }

            userRepository.save(user);
        });
    }

    /**
     * Check if a user is currently locked due to failed attempts.
     * Auto-unlocks if lock period has expired.
     *
     * @param user the user to check
     * @return true if locked, false otherwise
     */
    public boolean isLocked(User user) {
        if (user.getLockedUntil() == null) {
            return false;
        }

        if (user.getLockedUntil().isAfter(Instant.now())) {
            return true;
        } else {
            // Auto unlock
            LOG.info("Auto-unlocking account for user: {}", user.getLogin());
            user.setLockedUntil(null);
            user.setFailedLoginAttempts(0);
            user.setLastFailedLogin(null);
            userRepository.save(user);
            return false;
        }
    }

    /**
     * Get remaining lock time in minutes.
     *
     * @param user the user
     * @return minutes remaining, or 0 if not locked
     */
    public long getRemainingLockTimeMinutes(User user) {
        if (user.getLockedUntil() == null || user.getLockedUntil().isBefore(Instant.now())) {
            return 0;
        }
        return ChronoUnit.MINUTES.between(Instant.now(), user.getLockedUntil());
    }

    /**
     * Manually unlock a user account (admin action).
     *
     * @param userId the user ID
     */
    public void unlockUser(Long userId) {
        userRepository
            .findById(userId)
            .ifPresent(user -> {
                LOG.info("Manually unlocking account for user: {}", user.getLogin());
                user.setLockedUntil(null);
                user.setFailedLoginAttempts(0);
                user.setLastFailedLogin(null);
                userRepository.save(user);
            });
    }

    private Optional<User> findUserByUsernameOrEmail(String username) {
        if (username.contains("@")) {
            return userRepository.findOneByEmailIgnoreCase(username);
        }
        return userRepository.findOneByLogin(username.toLowerCase());
    }
}
