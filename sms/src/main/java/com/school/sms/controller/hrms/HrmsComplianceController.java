package com.school.sms.controller.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.PfEsiReport;
import com.school.sms.service.hrms.PfEsiComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hrms/compliance")
@RequiredArgsConstructor
public class HrmsComplianceController {

    private final PfEsiComplianceService complianceService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<PfEsiReport>> generateReport(
            @RequestParam Long branchId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        return ResponseEntity.ok(complianceService.generateMonthlyReport(branchId, year, month));
    }

    @GetMapping("/reports")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<List<PfEsiReport>>> getReports(
            @RequestParam Integer year,
            @RequestParam Integer month) {
        return ResponseEntity.ok(complianceService.getReports(year, month));
    }

    @PutMapping("/{id}/challan")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<PfEsiReport>> submitChallan(
            @PathVariable Long id,
            @RequestParam String challanUrl) {
        return ResponseEntity.ok(complianceService.submitChallan(id, challanUrl));
    }
}
