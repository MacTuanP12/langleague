package com.langleague.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Langleague.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
public class ApplicationProperties {

    private String baseUrl = "http://localhost:8080";

    private final Liquibase liquibase = new Liquibase();
    private final OAuth2 oauth2 = new OAuth2();
    private final Chatbot chatbot = new Chatbot();
    private final FileStorage fileStorage = new FileStorage();

    // jhipster-needle-application-properties-property
    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        // ✅ Thêm setter
        this.baseUrl = baseUrl;
    }

    public Liquibase getLiquibase() {
        return liquibase;
    }

    public OAuth2 getOauth2() {
        return oauth2;
    }

    public Chatbot getChatbot() {
        return chatbot;
    }

    public FileStorage getFileStorage() {
        return fileStorage;
    }

    // jhipster-needle-application-properties-property-getter

    public static class Liquibase {

        private Boolean asyncStart = true;

        public Boolean getAsyncStart() {
            return asyncStart;
        }

        public void setAsyncStart(Boolean asyncStart) {
            this.asyncStart = asyncStart;
        }
    }

    public static class OAuth2 {

        private String frontendUrl = "http://localhost:9000";

        public String getFrontendUrl() {
            return frontendUrl;
        }

        public void setFrontendUrl(String frontendUrl) {
            this.frontendUrl = frontendUrl;
        }
    }

    public static class Chatbot {

        private String apiUrl;
        private String apiKey;
        private Long timeout;

        public String getApiUrl() {
            return apiUrl;
        }

        public void setApiUrl(String apiUrl) {
            this.apiUrl = apiUrl;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public Long getTimeout() {
            return timeout;
        }

        public void setTimeout(Long timeout) {
            this.timeout = timeout;
        }
    }

    public static class FileStorage {

        private String basePath;

        public String getBasePath() {
            return basePath;
        }

        public void setBasePath(String basePath) {
            this.basePath = basePath;
        }
    }
    // jhipster-needle-application-properties-property-class
}
