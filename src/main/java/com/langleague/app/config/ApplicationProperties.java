package com.langleague.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Langleague.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Liquibase liquibase = new Liquibase();
    private final Ai ai = new Ai();

    // jhipster-needle-application-properties-property

    public Liquibase getLiquibase() {
        return liquibase;
    }

    public Ai getAi() {
        return ai;
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

    public static class Ai {

        private String googleKey;

        public String getGoogleKey() {
            return googleKey;
        }

        public void setGoogleKey(String googleKey) {
            this.googleKey = googleKey;
        }
    }
    // jhipster-needle-application-properties-property-class
}
