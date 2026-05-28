// controller/AttendanceController.java
package com.school.sms.controller;

import com.school.sms.dto.request.BulkAttendanceRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Mark attendance for whole class
    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markBulk(
            @Valid @RequestBody BulkAttendanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            "Attendance marked",
            attendanceService.markBulkAttendance(request)));
    }

    // Student's attendance report
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER') or " +
                  "(hasRole('STUDENT') and @studentSecurityService.isOwnId(#studentId))")
    public ResponseEntity<ApiResponse<Map<String, Object>>> studentReport(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                LocalDate to) {

        return ResponseEntity.ok(ApiResponse.success(
            "Attendance report",
            attendanceService.getStudentReport(studentId, from, to)));
    }

    // Class attendance for a date
    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> classAttendance(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Integer periodNumber) {

        return ResponseEntity.ok(ApiResponse.success(
            "Class attendance",
            attendanceService.getClassAttendance(classId, date, subjectId, periodNumber)));
    }
}