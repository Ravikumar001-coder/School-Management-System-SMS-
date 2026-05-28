package com.school.sms.controller.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.LeaveRequest;
import com.school.sms.service.hrms.LeaveManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hrms/leave")
@RequiredArgsConstructor
public class HrmsLeaveController {

    private final LeaveManagementService leaveService;

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getPendingRequests() {
        return ResponseEntity.ok(ApiResponse.success("Pending requests fetched", leaveService.getPendingRequests()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<LeaveRequest>> approveLeave(
            @PathVariable Long id, 
            @RequestParam(required = false, defaultValue = "1") Long approverId) {
        LeaveRequest request = leaveService.approveLeave(id, approverId);
        return ResponseEntity.ok(ApiResponse.success("Leave approved", request));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<LeaveRequest>> rejectLeave(
            @PathVariable Long id, 
            @RequestParam(required = false, defaultValue = "1") Long approverId,
            @RequestParam(required = false) String reason) {
        LeaveRequest request = leaveService.rejectLeave(id, approverId, reason);
        return ResponseEntity.ok(ApiResponse.success("Leave rejected", request));
    }
}
