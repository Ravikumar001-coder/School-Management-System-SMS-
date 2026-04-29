// repository/AttendanceRepository.java
package com.school.sms.repository;

import com.school.sms.model.Attendance;
import com.school.sms.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository 
        extends JpaRepository<Attendance, Long> {

    // Check if attendance already marked
    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);

    boolean existsByStudentIdAndDateAndSubjectId(
        Long studentId, LocalDate date, Long subjectId);

    // Get all attendance for a student in date range
    List<Attendance> findByStudentIdAndDateBetween(
        Long studentId, LocalDate fromDate, LocalDate toDate);

    // Get class attendance for a date
    List<Attendance> findByClassRoomIdAndDate(
        Long classRoomId, LocalDate date);

    // Count by status for a student
    Long countByStudentIdAndStatus(Long studentId, 
                                    AttendanceStatus status);

    // All attendance by date
    List<Attendance> findByDate(LocalDate date);

    // Attendance for specific student and date
    List<Attendance> findByStudentIdAndDate(
        Long studentId, LocalDate date);

    // Monthly attendance report
    @Query("SELECT a FROM Attendance a " +
           "WHERE a.classRoom.id = :classId " +
           "AND MONTH(a.date) = :month " +
           "AND YEAR(a.date)  = :year")
    List<Attendance> findByClassAndMonth(
        Long classId, int month, int year);

    // Count present days in range
    @Query("SELECT COUNT(a) FROM Attendance a " +
           "WHERE a.student.id = :studentId " +
           "AND a.status = 'PRESENT' " +
           "AND a.date BETWEEN :fromDate AND :toDate")
    Long countPresentDays(Long studentId, 
                           LocalDate fromDate, 
                           LocalDate toDate);
}