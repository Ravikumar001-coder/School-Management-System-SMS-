package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.ScheduledReport;
import com.school.sms.service.ScheduledReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/export/reports", "/api/export/reports"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT_ADMIN')")
public class ScheduledReportController {

    private final ScheduledReportService scheduledReportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ScheduledReport>> create(@RequestBody ScheduledReport report) {
        ScheduledReport saved = scheduledReportService.saveReport(report);
        return ResponseEntity.ok(ApiResponse.success("Scheduled report created successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduledReport>>> getAll(
            @RequestParam(required = false) Long branchId) {
        List<ScheduledReport> list = (branchId != null) 
                ? scheduledReportService.getByBranch(branchId)
                : scheduledReportService.getAll();
        return ResponseEntity.ok(ApiResponse.success("Scheduled reports loaded", list));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        scheduledReportService.deleteReport(id);
        return ResponseEntity.ok(ApiResponse.success("Scheduled report deleted successfully"));
    }
}
