package com.school.sms.repository;

import com.school.sms.model.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, Long> {
    List<SystemAlert> findByResolvedFalseOrderByCreatedAtDesc();
    List<SystemAlert> findByBranchIdAndResolvedFalseOrderByCreatedAtDesc(Long branchId);
}
