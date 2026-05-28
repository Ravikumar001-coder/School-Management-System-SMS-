package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.service.SessionAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/sessions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
public class SessionAuditController {

    private final SessionAuditService sessionAuditService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActiveSessions() {
        return ResponseEntity.ok(ApiResponse.success(
            "Active sessions fetched",
            sessionAuditService.getActiveSessions()));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> terminateSession(@PathVariable Long sessionId) {
        sessionAuditService.terminateSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session terminated", null));
    }
}
