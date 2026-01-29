package com.langleague.app.service;

import java.util.regex.Pattern;

/**
 * Validator for password strength requirements.
 */
public class PasswordValidator {

    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 100;
    // Password pattern: 1 uppercase, 1 number, 1 special char, min 8 chars.
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"#$%&''()*+,-./:;<=>?@\\[\\]^_`{|}~]).{8,}$"
    );

    private PasswordValidator() {}

    public static boolean isValid(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        if (password.length() < MIN_LENGTH || password.length() > MAX_LENGTH) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    public static boolean isLengthInvalid(String password) {
        return password == null || password.isEmpty() || password.length() < MIN_LENGTH || password.length() > MAX_LENGTH;
    }
}
