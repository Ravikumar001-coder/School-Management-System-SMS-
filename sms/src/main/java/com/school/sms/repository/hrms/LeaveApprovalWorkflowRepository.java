package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.LeaveApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveApprovalWorkflowRepository extends JpaRepository<LeaveApprovalWorkflow, Long> {
    List<LeaveApprovalWorkflow> findByDepartmentIdOrderByLevelAsc(Long departmentId);
}
