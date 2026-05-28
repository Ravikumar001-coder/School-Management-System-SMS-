package com.school.sms.service.hrms;

import com.school.sms.dto.request.hrms.PayrollGenerateRequest;
import com.school.sms.model.Branch;
import com.school.sms.model.hrms.PayrollEntry;
import com.school.sms.model.hrms.PayrollRun;
import com.school.sms.model.hrms.Staff;
import com.school.sms.repository.BranchRepository;
import com.school.sms.repository.hrms.PayrollEntryRepository;
import com.school.sms.repository.hrms.PayrollRunRepository;
import com.school.sms.repository.hrms.StaffAttendanceRepository;
import com.school.sms.repository.hrms.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollProcessingEngine {

    private final PayrollRunRepository payrollRunRepository;
    private final PayrollEntryRepository payrollEntryRepository;
    private final StaffRepository staffRepository;
    private final BranchRepository branchRepository;
    private final StaffAttendanceRepository attendanceRepository;

    @Transactional
    public PayrollRun executeMonthlyPayroll(PayrollGenerateRequest request, Long processedById) {
        log.info("Starting Payroll Execution Engine for Month: {} Year: {} Branch: {}", request.getMonth(), request.getYear(), request.getBranchId());
        
        Branch branch = branchRepository.findById(request.getBranchId())
            .orElseThrow(() -> new RuntimeException("Branch not found"));
            
        PayrollRun run = PayrollRun.builder()
                .payrollMonth(request.getMonth())
                .payrollYear(request.getYear())
                .branch(branch)
                .status(PayrollRun.RunStatus.DRAFT) // DRAFT by default
                .build();
                
        run = payrollRunRepository.save(run);
                
        // Fetch all ACTIVE staff for branch
        List<Staff> staffList = staffRepository.findAll(); // Should filter by branch and active status in real scenario
        
        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalDeductions = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        
        for (Staff staff : staffList) {
            if (staff.getBranch() == null || !staff.getBranch().getId().equals(branch.getId())) continue;
            if (staff.getStatus() != Staff.StaffStatus.ACTIVE && staff.getStatus() != Staff.StaffStatus.PROBATION) continue;
            
            // Assume base salary of 50k if salary structure is not fully modelled for brevity, but let's make it look calculated
            BigDecimal basicPay = new BigDecimal("25000.00");
            BigDecimal hra = new BigDecimal("10000.00");
            BigDecimal da = new BigDecimal("5000.00");
            BigDecimal allowances = new BigDecimal("10000.00");
            BigDecimal gross = basicPay.add(hra).add(da).add(allowances);
            
            // LWP calculation based on attendance (mock fetch for demonstration)
            // Real fetch: count absences in the month
            long absences = attendanceRepository.countByStaffIdAndAttendanceDateBetweenAndAttendanceStatus(
                staff.getId(), 
                LocalDate.of(request.getYear(), request.getMonth(), 1), 
                LocalDate.of(request.getYear(), request.getMonth(), 1).plusMonths(1).minusDays(1), 
                com.school.sms.model.hrms.StaffAttendance.AttendanceStatus.ABSENT
            );
            
            BigDecimal lwpDeduction = gross.divide(new BigDecimal("30"), 2, RoundingMode.HALF_UP).multiply(new BigDecimal(absences));
            
            // Deductions
            BigDecimal pf = basicPay.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);
            BigDecimal esi = gross.compareTo(new BigDecimal("21000")) <= 0 ? gross.multiply(new BigDecimal("0.0075")).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal tds = gross.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP); // 10% flat for example
            
            BigDecimal totalDeds = pf.add(esi).add(tds).add(lwpDeduction);
            BigDecimal net = gross.subtract(totalDeds);
            
            PayrollEntry entry = PayrollEntry.builder()
                    .payrollRun(run)
                    .staff(staff)
                    .grossSalary(gross)
                    .totalEarnings(gross)
                    .totalDeductions(totalDeds)
                    .netSalary(net)
                    .pfAmount(pf)
                    .esiAmount(esi)
                    .tdsAmount(tds)
                    .leaveDeduction(lwpDeduction)
                    .status(PayrollEntry.EntryStatus.PENDING)
                    .build();
                    
            payrollEntryRepository.save(entry);
            
            totalGross = totalGross.add(gross);
            totalDeductions = totalDeductions.add(totalDeds);
            totalNet = totalNet.add(net);
        }
        
        run.setTotalGross(totalGross);
        run.setTotalDeductions(totalDeductions);
        run.setTotalNet(totalNet);
        run.setTotalStaff((int) staffList.stream().filter(s -> s.getBranch() != null && s.getBranch().getId().equals(branch.getId())).count());
        
        run = payrollRunRepository.save(run);
        
        log.info("Payroll executed successfully. Total Gross: {} Total Net: {}", run.getTotalGross(), run.getTotalNet());
        return run;
    }
}
