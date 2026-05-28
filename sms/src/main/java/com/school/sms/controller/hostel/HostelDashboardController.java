package com.school.sms.controller.hostel;

import com.school.sms.service.hostel.HostelDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/hostel/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER', 'ADMIN', 'WARDEN')")
public class HostelDashboardController {

    private final HostelDashboardService dashboardService;

    @GetMapping("/stats/branches/{branchId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long branchId) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(branchId));
    }
}
