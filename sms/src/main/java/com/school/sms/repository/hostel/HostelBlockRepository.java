package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.HostelBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelBlockRepository extends JpaRepository<HostelBlock, Long> {
    List<HostelBlock> findByBranchId(Long branchId);
}
