package com.langleague.security;

import org.springframework.security.core.AuthenticationException;

/**
 * This exception is thrown in case of a locked user trying to authenticate.
 */
public class UserAccountLockedException extends AuthenticationException {

    private static final long serialVersionUID = 1L;

    public UserAccountLockedException(String message) {
        super(message);
    }

    public UserAccountLockedException(String message, Throwable t) {
        super(message, t);
    }
}
