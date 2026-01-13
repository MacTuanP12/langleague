package com.langleague.app.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        final String schemeName = "bearer-jwt";
        final SecurityScheme bearerSecurityScheme = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .name("Authorization")
            .description("Include a valid JWT with the 'Bearer ' prefix, e.g. Bearer eyJhbGciOiJIUzI1NiJ9...");

        return new OpenAPI()
            .info(new Info().title("Langleague API").description("Interactive documentation secured by JWT bearer tokens"))
            .components(new Components().addSecuritySchemes(schemeName, bearerSecurityScheme))
            .addSecurityItem(new SecurityRequirement().addList(schemeName));
    }
}
