package com.school.sms.controller.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.StaffAttendance;
import com.school.sms.service.hrms.BiometricAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hrms/attendance")
@RequiredArgsConstructor
public class HrmsAttendanceController {

    private final BiometricAttendanceService attendanceService;

    @PostMapping("/sync")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<StaffAttendance>> syncAttendance(
            @RequestParam Long staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime checkOut) {
        return ResponseEntity.ok(attendanceService.syncBiometricPunch(staffId, date, checkIn, checkOut));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<List<StaffAttendance>>> getLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceLogs(date));
    }
}
