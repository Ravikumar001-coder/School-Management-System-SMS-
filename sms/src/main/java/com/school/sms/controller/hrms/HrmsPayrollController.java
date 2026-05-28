package com.school.sms.controller.hrms;

import com.school.sms.dto.request.hrms.PayrollGenerateRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.PayrollRun;
import com.school.sms.repository.hrms.PayrollRunRepository;
import com.school.sms.service.hrms.PayrollProcessingEngine;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hrms/payroll")
@RequiredArgsConstructor
public class HrmsPayrollController {

    private final PayrollProcessingEngine payrollEngine;
    private final PayrollRunRepository payrollRunRepository;

    @PostMapping("/run")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<PayrollRun>> runPayroll(
            @Valid @RequestBody PayrollGenerateRequest request,
            @RequestParam(required = false, defaultValue = "1") Long processedById) {
            
        PayrollRun run = payrollEngine.executeMonthlyPayroll(request, processedById);
        return ResponseEntity.ok(ApiResponse.success("Payroll executed successfully", run));
    }

    @GetMapping("/runs")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<Page<PayrollRun>>> getAllPayrollRuns(Pageable pageable) {
        Page<PayrollRun> runs = payrollRunRepository.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success("Fetched payroll runs", runs));
    }
}
