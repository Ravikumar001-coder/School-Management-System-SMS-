package com.school.sms.controller;

import com.school.sms.dto.response.*;
import com.school.sms.model.SystemAlert;
import com.school.sms.service.RootDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT_ADMIN', 'BRANCH_ADMIN', 'HR_ADMIN', 'FINANCE_ADMIN', 'AUDITOR')")
public class DashboardRootAdminController {

    private final RootDashboardService rootDashboardService;

    // ─────────────────────────────────────────────────────────────────────────
    // CORE DASHBOARD ENDPOINTS
    // ─────────────────────────────────────────────────────────────────────────

    @GetMapping("/root-admin/overview")
    public ResponseEntity<ApiResponse<RootAdminOverviewResponse>> getOverview(
            @RequestParam(required = false) Long branchId) {
        RootAdminOverviewResponse dto = rootDashboardService.getOverviewResponse(branchId);
        return ResponseEntity.ok(ApiResponse.success("Overview metrics loaded successfully", dto));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAttendance(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> trends = rootDashboardService.getAttendanceTrends(branchId);
        return ResponseEntity.ok(ApiResponse.success("Attendance trends loaded successfully", trends));
    }

    @GetMapping("/finance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinance(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> financeMetrics = rootDashboardService.getFinanceMetrics(branchId);
        return ResponseEntity.ok(ApiResponse.success("Finance metrics loaded successfully", financeMetrics));
    }

    @GetMapping("/hrms")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHrms(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> hrMetrics = rootDashboardService.getHrMetrics(branchId);
        return ResponseEntity.ok(ApiResponse.success("HR and staff metrics loaded successfully", hrMetrics));
    }

    @GetMapping("/operations")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOperations(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> operationsMetrics = rootDashboardService.getOperationsMetrics(branchId);
        return ResponseEntity.ok(ApiResponse.success("Operations metrics loaded successfully", operationsMetrics));
    }

    @GetMapping("/activity-feed")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActivityFeed(
            @RequestParam(required = false) Long branchId) {
        List<Map<String, Object>> feed = rootDashboardService.getActivityFeed(branchId);
        return ResponseEntity.ok(ApiResponse.success("Recent activity timeline loaded successfully", feed));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlerts(
            @RequestParam(required = false) Long branchId) {
        List<SystemAlert> alerts = rootDashboardService.getCriticalAlerts(branchId);
        List<AlertResponse> dtos = alerts.stream().map(a -> AlertResponse.builder()
                .id(a.getId())
                .alertType(a.getType())
                .severity(a.getSeverity())
                .title(a.getTitle())
                .description(a.getMessage())
                .moduleName(a.getModule())
                .isResolved(a.isResolved())
                .createdAt(a.getCreatedAt())
                .build()).toList();
        return ResponseEntity.ok(ApiResponse.success("Dashboard alerts loaded successfully", dtos));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CHART TREND ENDPOINTS
    // ─────────────────────────────────────────────────────────────────────────

    @GetMapping("/chart/attendance")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getAttendanceChart(
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Attendance trend fetched", rootDashboardService.getAttendanceChart(branchId)));
    }

    @GetMapping("/chart/fees")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getFeesChart(
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Fee collection trend fetched", rootDashboardService.getFeesChart(branchId)));
    }

    @GetMapping("/chart/expenses")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getExpensesChart(
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Expense trend fetched", rootDashboardService.getExpensesChart(branchId)));
    }

    @GetMapping("/chart/payroll")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getPayrollChart(
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Payroll trend fetched", rootDashboardService.getPayrollChart(branchId)));
    }

    @GetMapping("/chart/admissions")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getAdmissionsChart(
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Admissions trend fetched", rootDashboardService.getAdmissionsChart(branchId)));
    }

    @GetMapping("/chart/vehicles")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getVehiclesChart(
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle usage trend fetched", rootDashboardService.getVehiclesChart(branchId)));
    }
}
