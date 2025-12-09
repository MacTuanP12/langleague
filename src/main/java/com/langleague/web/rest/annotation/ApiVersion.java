package com.langleague.web.rest.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Annotation for API versioning
 * Usage: @ApiVersion("1") or @ApiVersion("2")
 */
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@RequestMapping
public @interface ApiVersion {
    /**
     * API version number (e.g., "1", "2")
     */
    String value() default "1";

    /**
     * Whether this is the default version
     */
    boolean isDefault() default false;
}
