package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.HostelAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HostelAttendanceRepository extends JpaRepository<HostelAttendance, Long> {
    List<HostelAttendance> findByBranchIdAndDateBetween(Long branchId, LocalDate startDate, LocalDate endDate);
    Optional<HostelAttendance> findByBlockIdAndDateAndAttendanceType(Long blockId, LocalDate date, HostelAttendance.AttendanceType type);
}
