package com.langleague.app.web.rest;

import com.langleague.app.repository.BookRepository;
import com.langleague.app.repository.EnrollmentRepository;
import com.langleague.app.security.AuthoritiesConstants;
import com.langleague.app.security.SecurityUtils;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for Teacher Dashboard statistics.
 */
@RestController
@RequestMapping("/api/teacher/dashboard")
public class TeacherDashboardResource {

    private static final Logger LOG = LoggerFactory.getLogger(TeacherDashboardResource.class);

    private final BookRepository bookRepository;
    private final EnrollmentRepository enrollmentRepository;

    public TeacherDashboardResource(BookRepository bookRepository, EnrollmentRepository enrollmentRepository) {
        this.bookRepository = bookRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * {@code GET  /stats} : get teacher dashboard statistics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the stats in body.
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        LOG.debug("REST request to get Teacher Dashboard Stats");
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new AccessDeniedException("User not logged in"));

        // Count books owned by current teacher
        long totalCourses = bookRepository.countByTeacherProfileUserLogin(currentUserLogin);

        // Count total students enrolled in teacher's books
        // Note: This requires a custom query in EnrollmentRepository
        long totalStudents = enrollmentRepository.countByBookTeacherProfileUserLogin(currentUserLogin);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", totalCourses);
        stats.put("totalStudents", totalStudents);
        stats.put("pendingAssignments", 0); // Placeholder
        stats.put("averageRating", 0.0); // Placeholder

        return ResponseEntity.ok(stats);
    }
}
