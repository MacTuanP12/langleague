package com.langleague.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * API Versioning Configuration
 * Supports versioning through:
 * 1. URL path: /api/v1/books, /api/v2/books
 * 2. Request header: X-API-Version: 1
 * 3. Accept header: application/vnd.langleague.v1+json
 */
@Configuration
public class ApiVersioningConfiguration {

    public static final String API_V1_MEDIA_TYPE = "application/vnd.langleague.v1+json";
    public static final String API_V2_MEDIA_TYPE = "application/vnd.langleague.v2+json";

    @Bean
    public WebMvcConfigurer apiVersioningConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                configurer
                    .favorParameter(false)
                    .favorPathExtension(false)
                    .ignoreAcceptHeader(false)
                    .defaultContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            }
        };
    }
}
