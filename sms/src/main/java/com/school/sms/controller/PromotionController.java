package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Student;
import com.school.sms.model.admin.PromotionLog;
import com.school.sms.repository.StudentRepository;
import com.school.sms.service.admin.StudentPromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Promotion Controller
 * Provides endpoints to:
 *  - List students by classRoom for preview before promotion
 *  - Execute bulk promotion with selected/excluded student lists
 *  - Fetch promotion history logs
 */
@RestController
@RequestMapping("/api/v1/admin/promotion")
@RequiredArgsConstructor
public class PromotionController {

    private final StudentPromotionService promotionService;
    private final StudentRepository studentRepository;

    /**
     * GET /api/v1/admin/promotion/students?classId={id}
     * Fetch students from a specific class for promotion preview.
     */
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<Student>>> getStudentsByClass(@RequestParam Long classId) {
        List<Student> students = studentRepository.findByClassRoom_Id(classId);
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }

    /**
     * POST /api/v1/admin/promotion/execute
     * Execute bulk promotion from source class → target class for a new academic year.
     */
    @PostMapping("/execute")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<PromotionLog>> executePromotion(
            @RequestBody PromotionRequest request) {
        PromotionLog log = promotionService.executeBulkPromotion(
                request.getSourceClassId(),
                request.getTargetClassId(),
                request.getSourceYearId(),
                request.getTargetYearId(),
                request.getPromotedStudentIds(),
                request.getFailedStudentIds(),
                request.getAdminId()
        );
        return ResponseEntity.ok(ApiResponse.success("Promotion executed successfully", log));
    }

    /**
     * GET /api/v1/admin/promotion/history
     * Fetch promotion log history.
     */
    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<PromotionLog>>> getHistory() {
        List<PromotionLog> history = promotionService.getPromotionHistory();
        return ResponseEntity.ok(ApiResponse.success("History fetched", history));
    }

    // ── Inner DTO ─────────────────────────────────────────────────────────────
    @lombok.Data
    public static class PromotionRequest {
        private Long sourceClassId;
        private Long targetClassId;
        private Long sourceYearId;
        private Long targetYearId;
        private List<Long> promotedStudentIds;
        private List<Long> failedStudentIds;
        private Long adminId;
    }
}
