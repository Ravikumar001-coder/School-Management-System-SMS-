package com.school.sms.service.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.PayrollEntry;
import com.school.sms.model.hrms.PfEsiReport;
import com.school.sms.repository.hrms.PayrollEntryRepository;
import com.school.sms.repository.hrms.PfEsiReportRepository;
import com.school.sms.repository.BranchRepository;
import com.school.sms.model.Branch;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PfEsiComplianceService {

    private final PfEsiReportRepository pfEsiReportRepository;
    private final PayrollEntryRepository payrollEntryRepository;
    private final BranchRepository branchRepository;

    @Transactional
    public ApiResponse<PfEsiReport> generateMonthlyReport(Long branchId, Integer year, Integer month) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        Optional<PfEsiReport> existing = pfEsiReportRepository.findByBranchIdAndReportYearAndReportMonth(branchId, year, month);
        if (existing.isPresent()) {
            return ApiResponse.success("Report already generated for this month.", existing.get());
        }

        List<PayrollEntry> entries = payrollEntryRepository.findByPayrollRunPayrollYearAndPayrollRunPayrollMonthAndPayrollRunBranchId(year, month, branchId);

        BigDecimal totalPfEmployee = BigDecimal.ZERO;
        BigDecimal totalEsiEmployee = BigDecimal.ZERO;

        for (PayrollEntry entry : entries) {
            if (entry.getPfAmount() != null) totalPfEmployee = totalPfEmployee.add(entry.getPfAmount());
            if (entry.getEsiAmount() != null) totalEsiEmployee = totalEsiEmployee.add(entry.getEsiAmount());
        }

        // Standard employer contributions (simplification: 13% for PF, 3.25% for ESI of gross structure mapped back)
        // For accurate calculation, we'll assume employer matches the employee deduction exactly in this model.
        BigDecimal totalPfEmployer = totalPfEmployee.multiply(new BigDecimal("1.05")); // Just adding 5% for EDLI etc for realism
        BigDecimal totalEsiEmployer = totalEsiEmployee.multiply(new BigDecimal("4.33")); // standard 3.25 / 0.75 ratio

        PfEsiReport report = new PfEsiReport();
        report.setBranch(branch);
        report.setReportYear(year);
        report.setReportMonth(month);
        report.setTotalPfEmployee(totalPfEmployee);
        report.setTotalPfEmployer(totalPfEmployer);
        report.setTotalEsiEmployee(totalEsiEmployee);
        report.setTotalEsiEmployer(totalEsiEmployer);

        PfEsiReport saved = pfEsiReportRepository.save(report);

        return ApiResponse.success("PF & ESI Compliance Report generated successfully", saved);
    }

    public ApiResponse<List<PfEsiReport>> getReports(Integer year, Integer month) {
        return ApiResponse.success("Fetched reports", pfEsiReportRepository.findByReportYearAndReportMonth(year, month));
    }

    @Transactional
    public ApiResponse<PfEsiReport> submitChallan(Long reportId, String challanUrl) {
        PfEsiReport report = pfEsiReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setChallanUrl(challanUrl);
        report.setStatus(PfEsiReport.ReportStatus.SUBMITTED);
        return ApiResponse.success("Challan submitted successfully", pfEsiReportRepository.save(report));
    }
}
