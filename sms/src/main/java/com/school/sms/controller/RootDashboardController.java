package com.school.sms.controller;

import com.school.sms.dto.response.*;
import com.school.sms.model.SystemAlert;
import com.school.sms.service.RootDashboardService;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT_ADMIN', 'BRANCH_ADMIN', 'HR_ADMIN', 'FINANCE_ADMIN', 'AUDITOR')")
public class RootDashboardController {

    private final RootDashboardService rootDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @RequestParam(required = false) Long branchId) {
        try {
            Map<String, Object> map = rootDashboardService.getSummary(branchId);
            DashboardSummaryResponse dto = DashboardSummaryResponse.builder()
                    .totalActiveStudents((Long) map.get("totalActiveStudents"))
                    .totalTeachingStaff((Long) map.get("totalTeachingStaff"))
                    .totalNonTeachingStaff((Long) map.get("totalNonTeachingStaff"))
                    .monthlyRevenue((Double) map.get("monthlyRevenue"))
                    .outstandingFees((Double) map.get("outstandingFees"))
                    .activeVehiclesCount((Long) map.get("activeVehiclesCount"))
                    .hostelOccupancyRate((Double) map.get("hostelOccupancyRate"))
                    .healthScore((Map<String, Object>) map.get("healthScore"))
                    .build();
            return ResponseEntity.ok(ApiResponse.success("Summary metrics loaded successfully", dto));
        } catch (Exception e) {
            log.error("Error loading summary metrics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load summary metrics: " + e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<StudentMetricsResponse>> getStudents(
            @RequestParam(required = false) Long branchId) {
        try {
            Map<String, Object> map = rootDashboardService.getStudentMetrics(branchId);
            StudentMetricsResponse dto = StudentMetricsResponse.builder()
                    .totalActiveStudents((Long) map.get("totalActiveStudents"))
                    .newAdmissions((Long) map.get("newAdmissions"))
                    .todayAttendancePercentage((Double) map.get("todayAttendancePercentage"))
                    .studentTeacherRatio((Double) map.get("studentTeacherRatio"))
                    .pendingAdmissions((Long) map.get("pendingAdmissions"))
                    .classWiseDistribution((Map<String, Long>) map.get("classWiseDistribution"))
                    .build();
            return ResponseEntity.ok(ApiResponse.success("Student metrics loaded successfully", dto));
        } catch (Exception e) {
            log.error("Error loading student metrics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load student metrics: " + e.getMessage()));
        }
    }

    @GetMapping("/hr")
    public ResponseEntity<ApiResponse<HrMetricsResponse>> getHr(
            @RequestParam(required = false) Long branchId) {
        try {
            Map<String, Object> map = rootDashboardService.getHrMetrics(branchId);
            HrMetricsResponse dto = HrMetricsResponse.builder()
                    .totalTeachingStaff((Long) map.get("totalTeachingStaff"))
                    .totalNonTeachingStaff((Long) map.get("totalNonTeachingStaff"))
                    .todayAttendancePercentage((Double) map.get("todayAttendancePercentage"))
                    .onLeaveToday((Long) map.get("onLeaveToday"))
                    .upcomingPayroll((Double) map.get("upcomingPayroll"))
                    .departmentDistribution((Map<String, Long>) map.get("departmentDistribution"))
                    .build();
            return ResponseEntity.ok(ApiResponse.success("HR metrics loaded successfully", dto));
        } catch (Exception e) {
            log.error("Error loading HR metrics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load HR metrics: " + e.getMessage()));
        }
    }

    @GetMapping("/finance")
    public ResponseEntity<ApiResponse<FinanceMetricsResponse>> getFinance(
            @RequestParam(required = false) Long branchId) {
        try {
            Map<String, Object> map = rootDashboardService.getFinanceMetrics(branchId);
            FinanceMetricsResponse dto = FinanceMetricsResponse.builder()
                    .revenueThisMonth((Double) map.get("revenueThisMonth"))
                    .outstandingFees((Double) map.get("outstandingFees"))
                    .netProfit((Double) map.get("netProfit"))
                    .monthlyExpense((Double) map.get("monthlyExpense"))
                    .salaryPayoutPending((Double) map.get("salaryPayoutPending"))
                    .recentTransactions((List<Map<String, Object>>) map.get("recentTransactions"))
                    .build();
            return ResponseEntity.ok(ApiResponse.success("Finance metrics loaded successfully", dto));
        } catch (Exception e) {
            log.error("Error loading finance metrics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load finance metrics: " + e.getMessage()));
        }
    }

    @GetMapping("/operations")
    public ResponseEntity<ApiResponse<OperationsMetricsResponse>> getOperations(
            @RequestParam(required = false) Long branchId) {
        try {
            Map<String, Object> map = rootDashboardService.getOperationsMetrics(branchId);
            OperationsMetricsResponse dto = OperationsMetricsResponse.builder()
                    .activeVehicles((Long) map.get("activeVehicles"))
                    .vehiclesUnderMaintenance((Long) map.get("vehiclesUnderMaintenance"))
                    .hostelOccupancy((Double) map.get("hostelOccupancy"))
                    .inventoryAlerts((Integer) map.get("inventoryAlerts"))
                    .securityIncidents((Long) map.get("securityIncidents"))
                    .maintenanceRequests((Long) map.get("maintenanceRequests"))
                    .build();
            return ResponseEntity.ok(ApiResponse.success("Operations metrics loaded successfully", dto));
        } catch (Exception e) {
            log.error("Error loading operations metrics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load operations metrics: " + e.getMessage()));
        }
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAttendance(
            @RequestParam(required = false) Long branchId) {
        try {
            Map<String, Object> trends = rootDashboardService.getAttendanceTrends(branchId);
            return ResponseEntity.ok(ApiResponse.success("Attendance trends loaded successfully", trends));
        } catch (Exception e) {
            log.error("Error loading attendance trends", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load attendance trends: " + e.getMessage()));
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlerts(
            @RequestParam(required = false) Long branchId) {
        try {
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
            return ResponseEntity.ok(ApiResponse.success("Critical alerts loaded successfully", dtos));
        } catch (Exception e) {
            log.error("Error loading critical alerts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load critical alerts: " + e.getMessage()));
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActivities(
            @RequestParam(required = false) Long branchId) {
        try {
            List<Map<String, Object>> feed = rootDashboardService.getActivityFeed(branchId);
            return ResponseEntity.ok(ApiResponse.success("Activity feed loaded successfully", feed));
        } catch (Exception e) {
            log.error("Error loading activity feed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to load activity feed: " + e.getMessage()));
        }
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long branchId) {
        try {
            byte[] csvBytes = rootDashboardService.exportToCsv(type, branchId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDisposition(ContentDisposition.attachment()
                    .filename("dashboard_" + (type != null ? type.toLowerCase() : "summary") + ".csv")
                    .build());
            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error exporting CSV", e);
            // Return a plain error response (could be refined)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/students/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentAnalytics(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> data = rootDashboardService.getStudentAnalytics(branchId);
        return ResponseEntity.ok(ApiResponse.success("Student analytics loaded successfully", data));
    }

    @GetMapping("/finance/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinanceAnalytics(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> data = rootDashboardService.getFinanceAnalytics(branchId);
        return ResponseEntity.ok(ApiResponse.success("Finance analytics loaded successfully", data));
    }

    @GetMapping("/attendance/details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAttendanceDetails(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> data = rootDashboardService.getAttendanceDetails(date, branchId);
        return ResponseEntity.ok(ApiResponse.success("Attendance details loaded successfully", data));
    }

    @GetMapping("/health/compliance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComplianceDetails(
            @RequestParam(required = false) Long branchId) {
        Map<String, Object> data = rootDashboardService.getComplianceDetails(branchId);
        return ResponseEntity.ok(ApiResponse.success("Compliance details loaded successfully", data));
    }

    @PutMapping("/alerts/{id}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        rootDashboardService.resolveAlert(id, payload.get("notes"), payload.get("assignedTo"));
        return ResponseEntity.ok(ApiResponse.success("Alert resolved successfully", null));
    }
}
