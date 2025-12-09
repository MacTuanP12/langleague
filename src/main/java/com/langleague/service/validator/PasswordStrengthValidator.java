package com.langleague.service.validator;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.*;
import java.util.Set;

/**
 * Validator for strong password requirements.
 * Password must:
 * - Be at least 8 characters
 * - Contain at least one uppercase letter
 * - Contain at least one lowercase letter
 * - Contain at least one digit
 * - Contain at least one special character
 * - Not be a common password
 */
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordStrengthValidator.Validator.class)
@Documented
public @interface PasswordStrengthValidator {
    String message() default "Password must be at least 8 characters with uppercase, lowercase, digit, and special character";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<PasswordStrengthValidator, String> {

        private static final Set<String> COMMON_PASSWORDS = Set.of(
            "password",
            "password123",
            "12345678",
            "qwerty123",
            "abc12345",
            "admin123",
            "user1234",
            "welcome123",
            "letmein123",
            "monkey123"
        );

        @Override
        public boolean isValid(String password, ConstraintValidatorContext context) {
            if (password == null || password.trim().isEmpty()) {
                return false;
            }

            // Check minimum length
            if (password.length() < 8) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Password must be at least 8 characters").addConstraintViolation();
                return false;
            }

            // Check for at least one uppercase letter
            if (!password.matches(".*[A-Z].*")) {
                context.disableDefaultConstraintViolation();
                context
                    .buildConstraintViolationWithTemplate("Password must contain at least one uppercase letter")
                    .addConstraintViolation();
                return false;
            }

            // Check for at least one lowercase letter
            if (!password.matches(".*[a-z].*")) {
                context.disableDefaultConstraintViolation();
                context
                    .buildConstraintViolationWithTemplate("Password must contain at least one lowercase letter")
                    .addConstraintViolation();
                return false;
            }

            // Check for at least one digit
            if (!password.matches(".*\\d.*")) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Password must contain at least one digit").addConstraintViolation();
                return false;
            }

            // Check for at least one special character
            if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>_\\-+=\\[\\]\\\\;'/`~].*")) {
                context.disableDefaultConstraintViolation();
                context
                    .buildConstraintViolationWithTemplate("Password must contain at least one special character (!@#$%^&*...)")
                    .addConstraintViolation();
                return false;
            }

            // Check against common passwords
            if (COMMON_PASSWORDS.contains(password.toLowerCase())) {
                context.disableDefaultConstraintViolation();
                context
                    .buildConstraintViolationWithTemplate("This password is too common. Please choose a stronger password")
                    .addConstraintViolation();
                return false;
            }

            return true;
        }
    }
}
