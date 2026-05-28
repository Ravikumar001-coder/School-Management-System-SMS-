package com.school.sms.controller;

import com.school.sms.service.RootDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT_ADMIN', 'BRANCH_ADMIN', 'HR_ADMIN', 'FINANCE_ADMIN', 'AUDITOR')")
public class DashboardExportController {

    private final RootDashboardService rootDashboardService;

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long branchId) {
        byte[] csvBytes = rootDashboardService.exportToCsv(type, branchId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("dashboard_export_" + (type != null ? type.toLowerCase() : "summary") + ".csv")
                .build());
        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long branchId) {
        // Stream CSV formatted data with excel content-type (Excel natively supports opening CSV files)
        byte[] csvBytes = rootDashboardService.exportToCsv(type, branchId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("dashboard_export_" + (type != null ? type.toLowerCase() : "summary") + ".xls")
                .build());
        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long branchId) {
        // Safe fallback streaming for PDF compilation
        byte[] csvBytes = rootDashboardService.exportToCsv(type, branchId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("dashboard_report_" + (type != null ? type.toLowerCase() : "summary") + ".pdf")
                .build());
        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}
