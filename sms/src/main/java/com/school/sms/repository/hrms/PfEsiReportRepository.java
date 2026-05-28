package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.PfEsiReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PfEsiReportRepository extends JpaRepository<PfEsiReport, Long> {
    List<PfEsiReport> findByReportYearAndReportMonth(Integer year, Integer month);
    Optional<PfEsiReport> findByBranchIdAndReportYearAndReportMonth(Long branchId, Integer year, Integer month);
}
