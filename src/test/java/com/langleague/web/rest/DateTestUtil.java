package com.langleague.web.rest;

import static java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;

/**
 * Utility class for testing date and time.
 */
public final class DateTestUtil {

    private DateTestUtil() {}

    /**
     * Convert a {@code ZonedDateTime} to a string format.
     *
     * @param zonedDateTime the zoned date time to convert
     * @return the formatted string
     */
    public static String formatDateTime(ZonedDateTime zonedDateTime) {
        if (zonedDateTime == null) {
            return null;
        }
        return ISO_OFFSET_DATE_TIME.format(zonedDateTime);
    }

    /**
     * Assert that two Instant are equal to the second.
     *
     * @param expected the expected instant
     * @param actual   the actual instant
     */
    public static void assertInstantEquals(Instant expected, Instant actual) {
        assertThat(actual).isEqualTo(expected);
    }

    /**
     * Assert that two ZonedDateTime are equal to the second.
     *
     * @param expected the expected zoned date time
     * @param actual   the actual zoned date time
     */
    public static void assertZonedDateTimesAreEqual(ZonedDateTime expected, ZonedDateTime actual) {
        assertThat(actual).isEqualTo(expected);
    }

    /**
     * Parses a date time string.
     *
     * @param dateTime the string to parse
     * @return the parsed ZonedDateTime
     * @throws DateTimeParseException if the text cannot be parsed
     */
    public static ZonedDateTime parseDateTime(String dateTime) {
        return ZonedDateTime.parse(dateTime, ISO_OFFSET_DATE_TIME);
    }
}
