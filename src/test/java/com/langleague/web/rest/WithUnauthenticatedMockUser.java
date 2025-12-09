package com.langleague.web.rest;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.springframework.security.test.context.support.WithSecurityContext;

/**
 * Annotation to run a test with an unauthenticated mock user.
 */
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithUnauthenticatedMockUserSecurityContextFactory.class)
public @interface WithUnauthenticatedMockUser {}
