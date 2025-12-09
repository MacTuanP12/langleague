package com.langleague.web.rest.errors;

/**
 * Exception thrown when an AppUser profile is not found for a given user.
 * This typically means the user exists in the system but doesn't have
 * an associated AppUser profile.
 */
public class AppUserNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AppUserNotFoundException(Long userId) {
        super("AppUser profile not found for user ID: " + userId);
    }

    public AppUserNotFoundException(String login) {
        super("AppUser profile not found for login: " + login);
    }

    public AppUserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
