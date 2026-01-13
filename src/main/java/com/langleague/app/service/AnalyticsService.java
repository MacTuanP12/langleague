package com.langleague.app.service;

import com.langleague.app.repository.BookRepository;
import com.langleague.app.repository.EnrollmentRepository;
import com.langleague.app.security.SecurityUtils;
import com.langleague.app.service.dto.StudentDTO;
import com.langleague.app.service.dto.TeacherDashboardDTO;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final BookRepository bookRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AnalyticsService(BookRepository bookRepository, EnrollmentRepository enrollmentRepository) {
        this.bookRepository = bookRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public TeacherDashboardDTO getTeacherDashboardStats() {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalStateException("User not logged in"));

        TeacherDashboardDTO stats = new TeacherDashboardDTO();

        // Total Books
        stats.setTotalBooks(bookRepository.countByTeacherProfileUserLogin(currentUserLogin));

        // Total Students
        stats.setTotalStudents(enrollmentRepository.countDistinctStudentByTeacher(currentUserLogin));

        // Average Score (Placeholder for now, can be implemented with UserResult later)
        stats.setAverageScore(0.0);

        // Book Stats (Enrollments per book)
        stats.setBookStats(enrollmentRepository.getBookStatsByTeacher(currentUserLogin));

        return stats;
    }

    public List<StudentDTO> getMyStudents() {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalStateException("User not logged in"));
        return enrollmentRepository.findStudentsByTeacher(currentUserLogin);
    }
}
