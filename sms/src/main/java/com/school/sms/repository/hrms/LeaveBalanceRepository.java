package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByStaffIdAndYear(Long staffId, Integer year);
    Optional<LeaveBalance> findByStaffIdAndLeaveTypeIdAndYear(Long staffId, Long leaveTypeId, Integer year);
}
