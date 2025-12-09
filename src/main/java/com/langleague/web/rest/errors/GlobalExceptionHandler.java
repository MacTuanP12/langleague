package com.langleague.web.rest.errors;

import com.langleague.web.rest.vm.ApiResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Global exception handler for consistent error responses
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex
            .getBindingResult()
            .getAllErrors()
            .forEach(error -> {
                String fieldName = ((FieldError) error).getField();
                String errorMessage = error.getDefaultMessage();
                fieldErrors.put(fieldName, errorMessage);
            });

        LOG.warn("Validation failed: {}", fieldErrors);

        ApiResponse<Void> response = ApiResponse.error("Validation failed", "VALIDATION_ERROR", fieldErrors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle malformed JSON or invalid request body
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        LOG.warn("Malformed JSON request: {}", ex.getMessage());

        String message = "Invalid request format. Please check your JSON structure.";

        // Try to provide more specific error message
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("JSON parse error")) {
                message = "Invalid JSON format. Please check your request body.";
            } else if (ex.getMessage().contains("Required request body is missing")) {
                message = "Request body is required.";
            }
        }

        ApiResponse<Void> response = ApiResponse.error(message, "INVALID_REQUEST_FORMAT");
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle constraint violations
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            fieldErrors.put(propertyPath, message);
        }

        LOG.warn("Constraint violation: {}", fieldErrors);

        ApiResponse<Void> response = ApiResponse.error("Constraint violation", "CONSTRAINT_VIOLATION", fieldErrors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle BadRequestAlertException
     */
    @ExceptionHandler(BadRequestAlertException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequestAlert(BadRequestAlertException ex, WebRequest request) {
        LOG.warn("Bad request: {} - {}", ex.getErrorKey(), ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), ex.getErrorKey());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle EmailAlreadyUsedException
     */
    @ExceptionHandler(EmailAlreadyUsedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleEmailAlreadyUsed(EmailAlreadyUsedException ex) {
        LOG.warn("Email already in use");

        ApiResponse<Void> response = ApiResponse.error("Email is already in use", "EMAIL_ALREADY_USED");
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle LoginAlreadyUsedException
     */
    @ExceptionHandler(LoginAlreadyUsedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleLoginAlreadyUsed(LoginAlreadyUsedException ex) {
        LOG.warn("Login name already in use");

        ApiResponse<Void> response = ApiResponse.error("Login name is already in use", "LOGIN_ALREADY_USED");
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle InvalidPasswordException
     */
    @ExceptionHandler(InvalidPasswordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleInvalidPassword(InvalidPasswordException ex) {
        LOG.warn("Invalid password provided");

        ApiResponse<Void> response = ApiResponse.error("Password does not meet requirements", "INVALID_PASSWORD");
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle authentication errors
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        LOG.warn("Authentication failed: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error("Authentication failed. Invalid credentials.", "AUTHENTICATION_FAILED");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Handle access denied errors
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        LOG.warn("Access denied: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error("You don't have permission to access this resource", "ACCESS_DENIED");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        LOG.warn("Illegal argument: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), "ILLEGAL_ARGUMENT");
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle IllegalStateException
     */
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiResponse<Void>> handleIllegalState(IllegalStateException ex) {
        LOG.warn("Illegal state: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), "ILLEGAL_STATE");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Handle DataIntegrityViolationException - database constraint violations
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        LOG.error("Data integrity violation: {}", ex.getMessage(), ex);

        String message = "Data constraint violation. ";
        String errorCode = "DATA_INTEGRITY_VIOLATION";

        // Parse the root cause for more specific error messages
        Throwable rootCause = ex.getRootCause();
        if (rootCause != null) {
            String rootMessage = rootCause.getMessage();
            if (rootMessage != null) {
                if (rootMessage.contains("Duplicate entry") || rootMessage.contains("unique constraint")) {
                    message = "A record with this information already exists. Please check for duplicates.";
                    errorCode = "DUPLICATE_ENTRY";
                } else if (rootMessage.contains("foreign key constraint")) {
                    message = "Referenced record does not exist. Please check your data.";
                    errorCode = "FOREIGN_KEY_VIOLATION";
                } else if (rootMessage.contains("cannot be null") || rootMessage.contains("not-null")) {
                    message = "Required field cannot be null.";
                    errorCode = "NOT_NULL_VIOLATION";
                }
            }
        }

        ApiResponse<Void> response = ApiResponse.error(message, errorCode);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Handle UserNotAuthenticatedException
     */
    @ExceptionHandler(UserNotAuthenticatedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ApiResponse<Void>> handleUserNotAuthenticated(UserNotAuthenticatedException ex) {
        LOG.warn("User not authenticated: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error("You must be logged in to perform this action", "USER_NOT_AUTHENTICATED");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Handle AppUserNotFoundException
     */
    @ExceptionHandler(AppUserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<Void>> handleAppUserNotFound(AppUserNotFoundException ex) {
        LOG.warn("AppUser not found: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error("User profile not found. Please complete your registration.", "APPUSER_NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handle NullPointerException - typically indicates missing required fields
     */
    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleNullPointer(NullPointerException ex) {
        LOG.error("Null pointer exception: {}", ex.getMessage(), ex);

        ApiResponse<Void> response = ApiResponse.error(
            "Required field is missing or null. Please check your request data.",
            "NULL_POINTER"
        );
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handle ResourceNotFoundException - proper way to handle not found errors
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        LOG.warn("Resource not found: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), "RESOURCE_NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handle RuntimeException - catch-all for unexpected runtime errors
     * Only catches truly unexpected exceptions - specific exceptions should have their own handlers
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        // Log with full stack trace for debugging
        LOG.error("Unexpected runtime exception: {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);

        // For security, don't expose internal error details to client
        ApiResponse<Void> response = ApiResponse.error("An unexpected error occurred. Please try again later.", "RUNTIME_ERROR");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(Exception ex, WebRequest request) {
        LOG.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ApiResponse<Void> response = ApiResponse.error("An unexpected error occurred. Please try again later.", "INTERNAL_SERVER_ERROR");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
