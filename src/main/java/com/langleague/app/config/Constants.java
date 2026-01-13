package com.langleague.app.config;

/**
 * Application constants.
 */
public final class Constants {

    // Regex for acceptable logins - JavaScript-compatible version
    // Matches: email format (user@domain.com) OR username format (alphanumeric with _.-@)
    public static final String LOGIN_REGEX = "^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$";

    public static final String SYSTEM = "system";
    public static final String DEFAULT_LANGUAGE = "en";

    private Constants() {}
}
