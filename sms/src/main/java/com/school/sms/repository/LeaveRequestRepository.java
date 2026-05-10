// src/main/java/com/school/sms/repository/LeaveRequestRepository.java
package com.school.sms.repository;

import com.school.sms.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStudentIdOrderByStartDateDesc(Long studentId);
}
