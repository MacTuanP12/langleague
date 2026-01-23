package com.langleague.app.repository;

import com.langleague.app.domain.Enrollment;
import com.langleague.app.service.dto.StudentDTO;
import com.langleague.app.service.dto.TeacherDashboardDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Enrollment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("select enrollment from Enrollment enrollment where enrollment.userProfile.user.login = ?#{authentication.name}")
    List<Enrollment> findByUserIsCurrentUser();

    long countByBookTeacherProfileUserLogin(String login);

    @Query("SELECT COUNT(DISTINCT e.userProfile.id) FROM Enrollment e WHERE e.book.teacherProfile.user.login = ?1")
    long countDistinctStudentByTeacher(String teacherLogin);

    @Query(
        "select enrollment from Enrollment enrollment where enrollment.userProfile.user.login = ?#{authentication.name} and enrollment.book.id = ?1"
    )
    Optional<Enrollment> findOneByUserIsCurrentUserAndBookId(Long bookId);

    @Query(
        "SELECT new com.langleague.app.service.dto.TeacherDashboardDTO$BookStatDTO(b.title, COUNT(e)) " +
        "FROM Book b LEFT JOIN b.enrollments e " +
        "WHERE b.teacherProfile.user.login = ?1 " +
        "GROUP BY b.id, b.title"
    )
    List<TeacherDashboardDTO.BookStatDTO> getBookStatsByTeacher(String teacherLogin);

    @Query(
        "SELECT new com.langleague.app.service.dto.StudentDTO(" +
        "u.id, u.login, u.firstName, u.lastName, u.email, u.imageUrl, " +
        "b.title, MAX(e.enrolledAt), 'ACTIVE') " +
        "FROM Enrollment e " +
        "JOIN e.userProfile up " +
        "JOIN up.user u " +
        "JOIN e.book b " +
        "WHERE b.teacherProfile.user.login = ?1 " +
        "GROUP BY u.id, u.login, u.firstName, u.lastName, u.email, u.imageUrl, b.title"
    )
    List<StudentDTO> findStudentsByTeacher(String teacherLogin);
}
