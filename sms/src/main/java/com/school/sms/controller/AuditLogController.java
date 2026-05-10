package com.school.sms.controller;

import com.school.sms.model.AuditLog;
import com.school.sms.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAllLogs(Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getAllLogs(pageable));
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<Page<AuditLog>> getLogsForEntity(
            @PathVariable String type,
            @PathVariable Long id,
            Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getLogsForEntity(type, id, pageable));
    }

    @GetMapping("/actor/{username}")
    public ResponseEntity<Page<AuditLog>> getLogsByActor(
            @PathVariable String username,
            Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getLogsByActor(username, pageable));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<AuditLog>> getLogsByType(
            @PathVariable String type,
            Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getLogsByEntityType(type, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<AuditLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getLogsByDateRange(from, to, pageable));
    }
}
