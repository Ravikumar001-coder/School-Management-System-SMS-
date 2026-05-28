// repository/AttendanceRepository.java
package com.school.sms.repository;

import com.school.sms.model.Attendance;
import com.school.sms.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository 
        extends JpaRepository<Attendance, Long> {

    boolean existsByStudentIdAndDateAndSubjectIdAndAcademicYearIdAndPeriodNumber(
        Long studentId, LocalDate date, Long subjectId, Long academicYearId, Integer periodNumber);

    Optional<Attendance> findByStudentIdAndDateAndSubjectIdAndAcademicYearIdAndPeriodNumber(
        Long studentId, LocalDate date, Long subjectId, Long academicYearId, Integer periodNumber);

    // Get all attendance for a student in date range
    List<Attendance> findByStudentIdAndDateBetween(
        Long studentId, LocalDate fromDate, LocalDate toDate);

    // Get class attendance for a date
    List<Attendance> findByClassRoomIdAndDate(
        Long classRoomId, LocalDate date);

    List<Attendance> findByClassRoomIdAndDateAndSubjectIdAndPeriodNumber(
        Long classRoomId, LocalDate date, Long subjectId, Integer periodNumber);

    // Count by status for a student
    Long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    // All attendance by date
    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);

    // Attendance for specific student and date
    List<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);

    // Monthly attendance report
    @Query("SELECT a FROM Attendance a " +
           "WHERE a.classRoom.id = :classId " +
           "AND a.date >= :startDate " +
           "AND a.date <= :endDate")
    List<Attendance> findByClassAndMonth(
        Long classId, java.time.LocalDate startDate, java.time.LocalDate endDate);

    // Count present days in range
    @Query("SELECT COUNT(a) FROM Attendance a " +
           "WHERE a.student.id = :studentId " +
           "AND a.status = 'PRESENT' " +
           "AND a.date BETWEEN :fromDate AND :toDate")
    Long countPresentDays(Long studentId, LocalDate fromDate, LocalDate toDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id IN :studentIds AND a.status = :status AND a.academicYear.id = :yearId")
    Long countByStudentIdsAndStatusAndYear(List<Long> studentIds, AttendanceStatus status, Long yearId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id IN :studentIds AND a.academicYear.id = :yearId")
    Long countByStudentIdsAndYear(List<Long> studentIds, Long yearId);
}