package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.User;
import com.school.sms.service.AttendanceTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceTemplateController {

    private final AttendanceTemplateService service;

    // ─── Templates ───

    @GetMapping("/templates")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listTemplates(
            @RequestParam Long classRoomId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Templates fetched",
                service.listTemplates(user.getId(), classRoomId)));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> saveTemplate(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Template saved",
                service.saveTemplate(user.getId(), body)));
    }

    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteTemplate(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        service.deleteTemplate(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Template deleted"));
    }

    // ─── Drafts (auto-save) ───

    @GetMapping("/draft")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDraft(
            @RequestParam Long classRoomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer periodNumber,
            @RequestParam(required = false) Long subjectId,
            @AuthenticationPrincipal User user) {
        Map<String, Object> draft = service.getDraft(user.getId(), classRoomId, date, periodNumber, subjectId);
        return ResponseEntity.ok(ApiResponse.success("Draft fetched", draft));
    }

    @PostMapping("/draft")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> saveDraft(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Draft saved",
                service.saveDraft(user.getId(), body)));
    }

    @PatchMapping("/draft/{id}/lock")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Object>> lockDraft(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        service.lockDraft(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Draft locked"));
    }
}
