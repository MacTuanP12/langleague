package com.langleague.web.rest.errors;

/**
 * Exception thrown when a user is not authenticated but tries to access
 * a resource that requires authentication.
 */
public class UserNotAuthenticatedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UserNotAuthenticatedException() {
        super("User is not authenticated");
    }

    public UserNotAuthenticatedException(String message) {
        super(message);
    }
}
