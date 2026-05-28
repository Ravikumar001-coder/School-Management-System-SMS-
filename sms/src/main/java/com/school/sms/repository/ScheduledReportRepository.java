package com.school.sms.repository;

import com.school.sms.model.ScheduledReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledReportRepository extends JpaRepository<ScheduledReport, Long> {
    List<ScheduledReport> findByNextRunAtBefore(LocalDateTime time);
    List<ScheduledReport> findByBranchId(Long branchId);
}
