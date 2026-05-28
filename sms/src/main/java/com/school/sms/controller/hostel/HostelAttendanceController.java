package com.school.sms.controller.hostel;

import com.school.sms.dto.hostel.HostelDto;
import com.school.sms.model.hostel.HostelAttendance;
import com.school.sms.model.hostel.HostelAttendanceLog;
import com.school.sms.service.hostel.HostelAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hostel/attendance")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER', 'ADMIN', 'WARDEN')")
public class HostelAttendanceController {

    private final HostelAttendanceService attendanceService;

    @PostMapping("/branches/{branchId}/sessions")
    public ResponseEntity<HostelAttendance> createSession(@PathVariable Long branchId, @RequestBody HostelDto.AttendanceSessionRequest request) {
        Long markedById = 1L; // Placeholder for logged-in user
        return ResponseEntity.ok(attendanceService.createAttendanceSession(
                branchId, 
                request.getBlockId(), 
                request.getDate(), 
                request.getAttendanceType(), 
                markedById
        ));
    }

    @PostMapping("/sessions/{sessionId}/logs")
    public ResponseEntity<HostelAttendanceLog> markAttendance(@PathVariable Long sessionId, @RequestBody HostelDto.AttendanceLogRequest request) {
        return ResponseEntity.ok(attendanceService.markStudentAttendance(
                sessionId,
                request.getStudentId(),
                request.getBedId(),
                request.getStatus(),
                request.getRemarks()
        ));
    }
}
