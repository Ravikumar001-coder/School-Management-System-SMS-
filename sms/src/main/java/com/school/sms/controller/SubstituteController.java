package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.User;
import com.school.sms.service.SubstituteService;
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
@RequestMapping("/api/v1/teacher/substitutes")
@RequiredArgsConstructor
public class SubstituteController {

    private final SubstituteService substituteService;

    /** Substitutions assigned to me (as substitute) */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listMine(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "My substitutions",
                substituteService.listForSubstitute(user.getId(), date)));
    }

    /** Substitutions I raised (as original absent teacher) */
    @GetMapping("/raised")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listRaised(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Raised substitutions",
                substituteService.listForOriginalTeacher(user.getId(), date)));
    }

    /** Admin: all substitutions on a date */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listAll(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(
                "All substitutions",
                substituteService.listAll(date)));
    }

    /** Assign a substitute */
    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> assign(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Substitute assigned",
                substituteService.assign(user.getId(), body)));
    }

    /** Update status: COMPLETED, CANCELLED */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        substituteService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(ApiResponse.success("Status updated"));
    }
}
