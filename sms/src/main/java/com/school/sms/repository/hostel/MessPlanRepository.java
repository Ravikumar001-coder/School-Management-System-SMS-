package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.MessPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessPlanRepository extends JpaRepository<MessPlan, Long> {
    List<MessPlan> findByBranchId(Long branchId);
}
