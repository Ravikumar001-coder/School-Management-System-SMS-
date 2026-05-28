package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.AppraisalCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppraisalCycleRepository extends JpaRepository<AppraisalCycle, Long> {
    List<AppraisalCycle> findByStatus(AppraisalCycle.CycleStatus status);
}
