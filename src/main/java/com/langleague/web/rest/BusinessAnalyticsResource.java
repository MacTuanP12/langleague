package com.langleague.web.rest;

import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.BusinessAnalyticsService;
import com.langleague.service.dto.BusinessAnalyticsDTO;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for Business Analytics.
 * Provides endpoints for DAU/MAU, Retention Rate, and other business KPIs.
 */
@RestController
@RequestMapping("/api/admin")
public class BusinessAnalyticsResource {

    private static final Logger LOG = LoggerFactory.getLogger(BusinessAnalyticsResource.class);

    private final BusinessAnalyticsService businessAnalyticsService;

    public BusinessAnalyticsResource(BusinessAnalyticsService businessAnalyticsService) {
        this.businessAnalyticsService = businessAnalyticsService;
    }

    /**
     * GET /api/admin/business-analytics : Get comprehensive business analytics.
     *
     * @param days the number of days to look back (default: 30)
     * @return the ResponseEntity with status 200 (OK) and business analytics in body
     */
    @GetMapping("/business-analytics")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<BusinessAnalyticsDTO> getBusinessAnalytics(@RequestParam(defaultValue = "30") Integer days) {
        LOG.debug("REST request to get Business Analytics for last {} days", days);

        Instant endDate = Instant.now();
        Instant startDate = endDate.minus(days, ChronoUnit.DAYS);

        BusinessAnalyticsDTO analytics = businessAnalyticsService.getBusinessAnalytics(startDate, endDate);

        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /api/admin/business-analytics/range : Get business analytics for specific date range.
     *
     * @param startDate start date in ISO format
     * @param endDate end date in ISO format
     * @return the ResponseEntity with status 200 (OK) and business analytics in body
     */
    @GetMapping("/business-analytics/range")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<BusinessAnalyticsDTO> getBusinessAnalyticsByRange(
        @RequestParam Instant startDate,
        @RequestParam Instant endDate
    ) {
        LOG.debug("REST request to get Business Analytics from {} to {}", startDate, endDate);

        BusinessAnalyticsDTO analytics = businessAnalyticsService.getBusinessAnalytics(startDate, endDate);

        return ResponseEntity.ok(analytics);
    }
}
