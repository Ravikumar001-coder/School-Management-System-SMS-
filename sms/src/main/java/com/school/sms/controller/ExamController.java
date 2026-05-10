// controller/ExamController.java
package com.school.sms.controller;

import com.school.sms.dto.request.BulkMarkRequest;
import com.school.sms.dto.request.ExamRequest;
import com.school.sms.dto.response.*;
import com.school.sms.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<ExamResponse>> create(
            @Valid @RequestBody ExamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                    "Exam created",
                    examService.createExam(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(
            "Exams fetched", examService.getAllExams()));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getByClass(
            @PathVariable Long classId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Class exams", examService.getExamsByClass(classId)));
    }

    // Enter marks for whole class
    @PostMapping("/marks/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> enterBulkMarks(
            @Valid @RequestBody BulkMarkRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            "Marks entered",
            examService.enterBulkMarks(request)));
    }

    // Get all marks for an exam
    @GetMapping("/{examId}/marks")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<List<MarkResponse>>> getMarks(
            @PathVariable Long examId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Exam marks", examService.getExamMarks(examId)));
    }

    // Student report card
    @GetMapping("/report-card/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER') or " +
                  "(hasRole('STUDENT') and @studentSecurityService.isOwnId(#studentId))")
    public ResponseEntity<ApiResponse<List<MarkResponse>>> reportCard(
            @PathVariable Long studentId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            "Report card",
            examService.getStudentReportCard(studentId, academicYear)));
    }

    // Class topper
    @GetMapping("/{examId}/topper")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<MarkResponse>> topper(
            @PathVariable Long examId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Class topper",
            examService.getClassTopper(examId)));
    }
}