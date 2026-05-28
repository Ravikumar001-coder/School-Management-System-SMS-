package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffLeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStaffIdOrderByStartDateDesc(Long staffId);
    List<LeaveRequest> findByStatus(LeaveRequest.RequestStatus status);
}
