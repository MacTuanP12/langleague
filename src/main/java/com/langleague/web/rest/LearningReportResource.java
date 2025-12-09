package com.langleague.web.rest;

import com.langleague.security.AuthoritiesConstants;
import com.langleague.service.LearningReportService;
import com.langleague.service.dto.LearningReportDTO;
import com.langleague.web.rest.errors.BadRequestAlertException;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing learning reports and statistics.
 * Use cases: UC 26 (View learning progress), UC 33 (Generate learning report),
 * UC 41 (Learning history view), UC 51-53 (Admin statistics)
 */
@Tag(name = "Reports", description = "Learning reports and analytics")
@RestController
@RequestMapping("/api/learning-reports")
public class LearningReportResource {

    private static final Logger LOG = LoggerFactory.getLogger(LearningReportResource.class);

    private static final String ENTITY_NAME = "learningReport";

    private final LearningReportService learningReportService;

    public LearningReportResource(LearningReportService learningReportService) {
        this.learningReportService = learningReportService;
    }

    /**
     * {@code GET  /learning-reports/my-progress} : Get current user's learning progress summary.
     * Use case 26: View learning progress
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and learning report in body.
     */
    @GetMapping("/my-progress")
    public ResponseEntity<LearningReportDTO> getMyProgress() {
        LOG.debug("REST request to get current user's learning progress");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        LearningReportDTO report = learningReportService.getUserLearningReport(userLogin);
        return ResponseEntity.ok().body(report);
    }

    /**
     * {@code GET  /learning-reports/export} : Export learning progress as PDF.
     * Use case 33: Generate learning report
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and PDF content.
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport() {
        LOG.debug("REST request to export learning report");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        byte[] pdfContent = learningReportService.generatePdfReport(userLogin);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "learning-report.pdf");

        return ResponseEntity.ok().headers(headers).body(pdfContent);
    }

    /**
     * {@code GET  /learning-reports/history} : Get learning history timeline.
     * Use case 41: Learning history view
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and history data in body.
     */
    @GetMapping("/history")
    public ResponseEntity<LearningReportDTO> getLearningHistory() {
        LOG.debug("REST request to get learning history");
        String userLogin = com.langleague.security.SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated")
        );

        LearningReportDTO history = learningReportService.getUserLearningHistory(userLogin);
        return ResponseEntity.ok().body(history);
    }

    /**
     * {@code GET  /learning-reports/admin/user-visits} : Get user visit statistics (Admin only).
     * Use case 51: View user visit reports
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and statistics in body.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @GetMapping("/admin/user-visits")
    public ResponseEntity<LearningReportDTO> getUserVisitStatistics() {
        LOG.debug("REST request to get user visit statistics");
        LearningReportDTO stats = learningReportService.getUserVisitStatistics();
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /learning-reports/admin/statistics} : Get admin overview statistics (Admin only).
     * Use case: Admin dashboard overview
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and aggregated statistics in body.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @GetMapping("/admin/statistics")
    public ResponseEntity<LearningReportDTO> getAdminStatistics() {
        LOG.debug("REST request to get admin overview statistics");
        LearningReportDTO stats = learningReportService.getAdminStatistics();
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /learning-reports/admin/completion-stats} : Get completion statistics (Admin only).
     * Use case 52: View completion statistics
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and statistics in body.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @GetMapping("/admin/completion-stats")
    public ResponseEntity<LearningReportDTO> getCompletionStatistics() {
        LOG.debug("REST request to get completion statistics");
        LearningReportDTO stats = learningReportService.getCompletionStatistics();
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /learning-reports/admin/engagement-stats} : Get engagement statistics (Admin only).
     * Use case 53: View engagement statistics
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and statistics in body.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @GetMapping("/admin/engagement-stats")
    public ResponseEntity<LearningReportDTO> getEngagementStatistics() {
        LOG.debug("REST request to get engagement statistics");
        LearningReportDTO stats = learningReportService.getEngagementStatistics();
        return ResponseEntity.ok().body(stats);
    }
}
