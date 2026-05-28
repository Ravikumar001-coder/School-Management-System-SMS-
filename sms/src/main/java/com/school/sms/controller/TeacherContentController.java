package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.User;
import com.school.sms.service.TeacherContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/teacher/content")
@RequiredArgsConstructor
public class TeacherContentController {

    private final TeacherContentService teacherContentService;

    @GetMapping("/lesson-plans")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLessonPlans(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lesson plans fetched",
                teacherContentService.getLessonPlans(user.getId())));
    }

    @PostMapping("/lesson-plans")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> createLessonPlan(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> data) {
        teacherContentService.createLessonPlan(user.getId(), data);
        return ResponseEntity.ok(ApiResponse.success("Lesson plan created"));
    }

    @GetMapping("/exam-papers")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getExamPapers(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Exam papers fetched",
                teacherContentService.getExamPapers(user.getId())));
    }

    @PostMapping("/exam-papers")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> createExamPaper(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> data) {
        teacherContentService.createExamPaper(user.getId(), data);
        return ResponseEntity.ok(ApiResponse.success("Exam paper created"));
    }
}
