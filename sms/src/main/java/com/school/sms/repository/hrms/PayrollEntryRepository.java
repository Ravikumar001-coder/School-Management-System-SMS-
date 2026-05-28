package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.PayrollEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollEntryRepository extends JpaRepository<PayrollEntry, Long> {
    List<PayrollEntry> findByPayrollRunId(Long payrollRunId);
    List<PayrollEntry> findByStaffId(Long staffId);
    List<PayrollEntry> findByPayrollRunPayrollYearAndPayrollRunPayrollMonthAndPayrollRunBranchId(Integer year, Integer month, Long branchId);
}
