package com.langleague;

import com.langleague.config.AsyncConfiguration;
import com.langleague.config.EmbeddedSQL;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { LangleagueApp.class, AsyncConfiguration.class })
@EmbeddedSQL
@ActiveProfiles("test")
public @interface IntegrationTest {}
