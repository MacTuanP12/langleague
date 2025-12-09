package com.langleague.config;

import static org.springframework.security.config.Customizer.withDefaults;

import com.langleague.security.*;
import com.langleague.security.OAuth2AuthenticationSuccessHandler;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.jwt.Jwt;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import tech.jhipster.config.JHipsterProperties;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    private final JHipsterProperties jHipsterProperties;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    public SecurityConfiguration(
        JHipsterProperties jHipsterProperties,
        CustomOAuth2UserService customOAuth2UserService,
        OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler
    ) {
        this.jHipsterProperties = jHipsterProperties;
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, MvcRequestMatcher.Builder mvc) throws Exception {
        // Configure JWT -> GrantedAuthorities converter so that our custom "auth" claim (space separated roles)
        // is converted into GrantedAuthority values understood by hasRole/hasAuthority checks.
        JwtAuthenticationConverter jwtAuthConverter = new JwtAuthenticationConverter();
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix(""); // our tokens already have ROLE_ prefix
        // Use custom converter that reads the `auth` claim if present
        jwtAuthConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Object authClaim = jwt.getClaim(SecurityUtils.AUTHORITIES_CLAIM);
            if (authClaim instanceof String str && !str.isBlank()) {
                return Arrays.stream(str.split(" ")).map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
            }
            // fallback to default behaviour (scope/roles mapping)
            return grantedAuthoritiesConverter.convert(jwt);
        });
        // Register converter with resource server
        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)));

        http
            // Enable CORS
            .cors(withDefaults())
            // Disable CSRF (API + JWT không cần CSRF)
            .csrf(csrf -> csrf.disable())
            // Security headers
            .headers(headers ->
                headers
                    .contentSecurityPolicy(csp -> csp.policyDirectives(jHipsterProperties.getSecurity().getContentSecurityPolicy()))
                    .frameOptions(FrameOptionsConfig::sameOrigin)
                    .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )
            // URL authorization
            .authorizeHttpRequests(authz ->
                authz
                    // ============================================================
                    // STATIC RESOURCES - Public
                    // ============================================================
                    .requestMatchers(
                        mvc.pattern("/index.html"),
                        mvc.pattern("/*.js"),
                        mvc.pattern("/*.txt"),
                        mvc.pattern("/*.json"),
                        mvc.pattern("/*.map"),
                        mvc.pattern("/*.css")
                    )
                    .permitAll()
                    .requestMatchers(mvc.pattern("/*.ico"), mvc.pattern("/*.png"), mvc.pattern("/*.svg"), mvc.pattern("/*.webapp"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/app/**"), mvc.pattern("/i18n/**"), mvc.pattern("/content/**"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/swagger-ui/**"), mvc.pattern("/v3/api-docs/**"))
                    .permitAll()
                    // ============================================================
                    // MANAGEMENT ENDPOINTS - Health check public
                    // ============================================================
                    .requestMatchers(mvc.pattern("/management/health/**"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/management/info"))
                    .permitAll()
                    // ============================================================
                    // PUBLIC AUTHENTICATION APIS
                    // ============================================================
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/authenticate"))
                    .permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/authenticate"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/register"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/captcha"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/captcha/**"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/activate"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/account/reset-password/init"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/account/reset-password/finish"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/auth/**"))
                    .permitAll()
                    .requestMatchers(mvc.pattern("/api/oauth2/**"))
                    .permitAll()
                    // ============================================================
                    // ADMIN-ONLY APIS
                    // User Management, Authorities, System Reports
                    // ============================================================
                    .requestMatchers(mvc.pattern("/api/admin/**"))
                    .hasAuthority("ROLE_ADMIN")
                    .requestMatchers(mvc.pattern("/api/authorities/**"))
                    .hasAuthority("ROLE_ADMIN")
                    // System-wide reports and statistics
                    .requestMatchers(mvc.pattern("/api/learning-reports/admin/**"))
                    .hasAuthority("ROLE_ADMIN")
                    // ============================================================
                    // ACCOUNT MANAGEMENT - Authenticated users manage their own account
                    // ============================================================
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/account"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/account"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/account"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/account/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/account/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern("/api/account/change-password"))
                    .authenticated()
                    // ============================================================
                    // USER PERSONAL DATA - Authenticated users manage their own data
                    // ============================================================
                    // User's personal learning data (can create/update their own)
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/study-sessions/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/study-sessions"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/study-sessions/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/study-sessions/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/exercise-results/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/exercise-results"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/user-vocabularies/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/user-vocabularies"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/user-vocabularies/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/user-vocabularies/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/user-grammars/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/user-grammars"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/user-grammars/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/user-grammars/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/book-progress/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/book-progress"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/book-progress/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/book-progress/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/chapter-progress/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/chapter-progress"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/chapter-progress/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/chapter-progress/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/learning-streaks/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/learning-streaks"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/learning-streaks/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/learning-streaks/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/user-achievements/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/user-achievements"))
                    .authenticated()
                    // User can manage their own comments, reviews, favorites
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/comments/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/comments"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/comments/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/comments/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/book-reviews/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/book-reviews"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/book-reviews/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/book-reviews/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/favorites/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/favorites"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/favorites/**"))
                    .authenticated()
                    // User personal reports
                    .requestMatchers(mvc.pattern("/api/learning-reports/my-progress"))
                    .authenticated()
                    .requestMatchers(mvc.pattern("/api/learning-reports/export"))
                    .authenticated()
                    .requestMatchers(mvc.pattern("/api/learning-reports/history"))
                    .authenticated()
                    // Notification management
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/notifications/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/notifications/**"))
                    .authenticated()
                    // ============================================================
                    // FILE UPLOAD - Different access levels based on file type
                    // ============================================================
                    // Avatar upload - authenticated users
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/files/upload/avatar"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/files/upload/avatar-url"))
                    .authenticated()
                    // Document upload - Admin & Staff only
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/files/upload/document"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    // Audio/Image upload - authenticated (for exercises, content)
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/files/upload/**"))
                    .authenticated()
                    // File download - authenticated users
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/files/download/**"))
                    .authenticated()
                    // File deletion - authenticated (user can delete their own)
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/files/**"))
                    .authenticated()
                    // ============================================================
                    // USER BOOK LIBRARY - Authenticated users manage their book library
                    // ============================================================
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/user/my-books/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/user/my-books/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/user/my-books/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/user/my-books/**"))
                    .authenticated()
                    // ============================================================
                    // USER CHAPTER LIBRARY - Authenticated users manage their saved chapters
                    // ============================================================
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/user/saved-chapters/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/user/saved-chapters/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/user/saved-chapters/**"))
                    .authenticated()
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/user/saved-chapters/**"))
                    .authenticated()
                    // ============================================================
                    // CONTENT MANAGEMENT - ADMIN & STAFF
                    // Books, Chapters, Exercises, Words, Grammar, etc.
                    // ============================================================
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/books"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/books/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/books/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/api/books/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/chapters"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/chapters/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/chapters/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/api/chapters/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/words"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/words/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/words/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/api/words/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/word-examples"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/word-examples/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/word-examples/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/grammars"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/grammars/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/grammars/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/grammar-examples"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/grammar-examples/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/grammar-examples/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    // Exercise Management
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/listening-exercises"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/listening-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/listening-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/listening-options"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/listening-options/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/listening-options/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/reading-exercises"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/reading-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/reading-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/reading-options"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/reading-options/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/reading-options/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/writing-exercises"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/writing-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/writing-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/speaking-exercises"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/speaking-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/speaking-exercises/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    // Achievement & Streak Management
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/achievements"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/achievements/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/achievements/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/streak-icons"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/streak-icons/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/streak-icons/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/streak-milestones"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.PUT, "/api/streak-milestones/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/streak-milestones/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    // Notification creation (broadcast) - Admin only
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/notifications"))
                    .hasAuthority("ROLE_ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/api/notifications/**"))
                    .hasAuthority("ROLE_ADMIN")
                    // Bulk operations - Admin & Staff
                    .requestMatchers(mvc.pattern("/api/bulk-operations/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    .requestMatchers(mvc.pattern("/api/bulk/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    // ============================================================
                    // STAFF OPERATIONS - Book uploads and content management
                    // ============================================================
                    .requestMatchers(mvc.pattern("/api/staff/book-uploads/**"))
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                    // ============================================================
                    // READ OPERATIONS - All authenticated users
                    // ============================================================
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/**"))
                    .authenticated()
                    // ============================================================
                    // DEFAULT - Require authentication
                    // ============================================================
                    .anyRequest()
                    .authenticated()
            )
            // Stateless session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Exception handling for JWT
            .exceptionHandling(exceptions ->
                exceptions
                    .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                    .accessDeniedHandler(new BearerTokenAccessDeniedHandler())
            )
            // OAuth2 login configuration
            .oauth2Login(oauth2 ->
                oauth2
                    .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                    .successHandler(oAuth2AuthenticationSuccessHandler)
            ); // (Configured earlier with a custom JwtAuthenticationConverter) // JWT Resource Server - jwtDecoder bean is provided by SecurityJwtConfiguration

        return http.build();
    }

    @Bean
    MvcRequestMatcher.Builder mvc(HandlerMappingIntrospector introspector) {
        return new MvcRequestMatcher.Builder(introspector);
    }
}
