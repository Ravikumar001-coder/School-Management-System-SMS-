package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.HostelAttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelAttendanceLogRepository extends JpaRepository<HostelAttendanceLog, Long> {
    List<HostelAttendanceLog> findByAttendanceId(Long attendanceId);
    List<HostelAttendanceLog> findByStudentId(Long studentId);
}
