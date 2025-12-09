package com.langleague.security;

import com.langleague.web.rest.errors.BadRequestAlertException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

/**
 * Utility class for validating resource ownership and access permissions
 */
@Component
public class OwnershipValidator {

    /**
     * Validate that the current user is the owner of the resource
     *
     * @param resourceOwnerLogin the login of the resource owner
     * @param entityName the name of the entity for error messages
     * @throws AccessDeniedException if user is not the owner and not admin
     */
    public void validateOwnership(String resourceOwnerLogin, String entityName) {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", entityName, "notauthenticated")
        );

        boolean isOwner = currentUserLogin.equals(resourceOwnerLogin);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You don't have permission to access this " + entityName);
        }
    }

    /**
     * Validate that the current user is the owner or staff
     */
    public void validateOwnershipOrStaff(String resourceOwnerLogin, String entityName) {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", entityName, "notauthenticated")
        );

        boolean isOwner = currentUserLogin.equals(resourceOwnerLogin);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);
        boolean isStaff = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.STAFF);

        if (!isOwner && !isAdmin && !isStaff) {
            throw new AccessDeniedException("You don't have permission to access this " + entityName);
        }
    }

    /**
     * Check if current user is owner
     */
    public boolean isOwner(String resourceOwnerLogin) {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElse(null);
        return currentUserLogin != null && currentUserLogin.equals(resourceOwnerLogin);
    }

    /**
     * Check if current user is owner or admin
     */
    public boolean isOwnerOrAdmin(String resourceOwnerLogin) {
        return isOwner(resourceOwnerLogin) || SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);
    }

    /**
     * Get current user login or throw exception
     */
    public String getCurrentUserLoginOrThrow(String entityName) {
        return SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", entityName, "notauthenticated")
        );
    }

    /**
     * Validate that user has specific authority
     */
    public void requireAuthority(String authority, String entityName) {
        if (!SecurityUtils.hasCurrentUserThisAuthority(authority)) {
            throw new AccessDeniedException("You need " + authority + " role to access this " + entityName);
        }
    }

    /**
     * Validate that user has at least one of the authorities
     */
    public void requireAnyAuthority(String entityName, String... authorities) {
        boolean hasAnyAuthority = false;
        for (String authority : authorities) {
            if (SecurityUtils.hasCurrentUserThisAuthority(authority)) {
                hasAnyAuthority = true;
                break;
            }
        }

        if (!hasAnyAuthority) {
            throw new AccessDeniedException("You don't have required permissions to access this " + entityName);
        }
    }
}
