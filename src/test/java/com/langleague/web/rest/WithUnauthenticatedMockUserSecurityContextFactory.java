package com.langleague.web.rest;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

/**
 * Factory to create a SecurityContext with an unauthenticated user.
 */
public class WithUnauthenticatedMockUserSecurityContextFactory implements WithSecurityContextFactory<WithUnauthenticatedMockUser> {

    @Override
    public SecurityContext createSecurityContext(WithUnauthenticatedMockUser annotation) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        // Leave the context empty to simulate an unauthenticated user
        return context;
    }
}
