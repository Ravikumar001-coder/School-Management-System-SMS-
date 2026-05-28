package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.StaffAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffAttendanceRepository extends JpaRepository<StaffAttendance, Long> {
    List<StaffAttendance> findByStaffIdAndAttendanceDateBetween(Long staffId, LocalDate startDate, LocalDate endDate);
    List<StaffAttendance> findByAttendanceDate(LocalDate attendanceDate);
    long countByStaffIdAndAttendanceDateBetweenAndAttendanceStatus(Long staffId, LocalDate startDate, LocalDate endDate, StaffAttendance.AttendanceStatus status);
}
