package com.langleague.app.web.rest;

import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.service.AnalyticsService;
import com.langleague.app.service.dto.StudentDTO;
import com.langleague.app.service.dto.TeacherDashboardDTO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for Teacher Analytics.
 */
@RestController
@RequestMapping("/api/teacher/analytics")
public class AnalyticsResource {

    private static final Logger LOG = LoggerFactory.getLogger(AnalyticsResource.class);

    private final AnalyticsService analyticsService;

    public AnalyticsResource(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * {@code GET  /dashboard} : get teacher dashboard statistics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the stats in body.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<TeacherDashboardDTO> getDashboardStats() {
        LOG.debug("REST request to get Teacher Dashboard Stats");
        TeacherDashboardDTO stats = analyticsService.getTeacherDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * {@code GET  /students} : get list of students enrolled in teacher's books.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of students in body.
     */
    @GetMapping("/students")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<List<StudentDTO>> getMyStudents() {
        LOG.debug("REST request to get My Students");
        List<StudentDTO> students = analyticsService.getMyStudents();
        return ResponseEntity.ok(students);
    }
}
