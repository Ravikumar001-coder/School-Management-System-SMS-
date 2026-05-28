package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, Long> {
    List<HostelAllocation> findByStudentId(Long studentId);
    Optional<HostelAllocation> findByStudentIdAndStatus(Long studentId, HostelAllocation.AllocationStatus status);
    List<HostelAllocation> findByStatus(HostelAllocation.AllocationStatus status);
    List<HostelAllocation> findByBedRoomIdAndStatus(Long roomId, HostelAllocation.AllocationStatus status);

    long countByStatus(HostelAllocation.AllocationStatus status);
}
