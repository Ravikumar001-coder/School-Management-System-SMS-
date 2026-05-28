package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.User;
import com.school.sms.model.Teacher;
import com.school.sms.service.TeacherAnalyticsService;
import com.school.sms.service.TeacherOSService;
import com.school.sms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/teacher/analytics")
@RequiredArgsConstructor
public class TeacherAnalyticsController {

    private final TeacherAnalyticsService teacherAnalyticsService;
    private final TeacherOSService teacherOSService;
    private final TeacherRepository teacherRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(
            @AuthenticationPrincipal User user) {
        
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        Map<String, Object> scope = teacherOSService.getTeacherScope(user.getId());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> classes = (List<Map<String, Object>>) scope.get("assignedClasses");
        List<Long> classIds = classes.stream().map(c -> (Long) c.get("id")).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("attendanceTrend", teacherAnalyticsService.getAttendanceTrend(classIds, 30));
        result.put("gradeDistribution", teacherAnalyticsService.getGradeDistribution(classIds));
        
        return ResponseEntity.ok(ApiResponse.success("Analytics summary fetched", result));
    }
}
