// controller/DashboardController.java
package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.DashboardResponse;
import com.school.sms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<DashboardResponse>> adminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(
            "Dashboard data",
            dashboardService.getAdminDashboard()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') and @studentSecurityService.isOwnId(#studentId)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> studentDashboard(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Student dashboard data",
            dashboardService.getStudentDashboard(studentId)));
    }
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER') and @teacherSecurityService.isOwnId(#teacherId)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> teacherDashboard(
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Teacher dashboard data",
            dashboardService.getTeacherDashboard(teacherId)));
    }
}