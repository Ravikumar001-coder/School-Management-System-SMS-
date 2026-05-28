package com.school.sms.controller;

import com.school.sms.dto.request.DiaryEntryRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.TimetableResponse;
import com.school.sms.model.User;
import com.school.sms.service.TeacherOSService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/teacher")
@RequiredArgsConstructor
public class TeacherOSController {

    private final TeacherOSService teacherOSService;

    @GetMapping("/timetable")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<TimetableResponse>>> getTimetable(
            @RequestParam(required = false) Long teacherId,
            @RequestParam String day,
            @AuthenticationPrincipal User user) {
        
        if (teacherId == null) {
            return ResponseEntity.ok(ApiResponse.success(
                "Timetable fetched", 
                teacherOSService.getTeacherTimetableByUser(user.getId(), day)));
        }
        return ResponseEntity.ok(ApiResponse.success(
            "Timetable fetched", 
            teacherOSService.getTeacherTimetable(teacherId, day)));
    }

    @PostMapping("/diary")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> saveDiary(
            @RequestBody DiaryEntryRequest request,
            @AuthenticationPrincipal User user) {
        teacherOSService.saveDiaryEntry(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Diary entry saved"));
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(
            @AuthenticationPrincipal User user) {
        Map<String, Object> stats = new java.util.HashMap<>(teacherOSService.getDashboardStatsByUser(user.getId()));
        stats.put("debug_userId", user.getId()); 
        return ResponseEntity.ok(ApiResponse.success("Stats fetched", stats));
    }

    @GetMapping("/scope")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getScope(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
            "Teacher scope fetched", 
            teacherOSService.getTeacherScope(user.getId())));
    }

    @PatchMapping("/todos/{id}/toggle")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> toggleTodo(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        teacherOSService.toggleTodo(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Todo toggled"));
    }
    @PostMapping("/todos")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> addTodo(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        teacherOSService.addTodo(user.getId(), body.get("title"), body.get("priority"));
        return ResponseEntity.ok(ApiResponse.success("Todo added"));
    }

    @DeleteMapping("/todos/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> deleteTodo(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        teacherOSService.deleteTodo(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Todo deleted"));
    }

    @PutMapping("/todos/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> updateTodo(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        teacherOSService.updateTodo(user.getId(), id, body.get("title"), body.get("priority"));
        return ResponseEntity.ok(ApiResponse.success("Todo updated"));
    }

    @GetMapping("/notifications/{id}/read")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> markRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        teacherOSService.markNotificationRead(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @GetMapping("/resources")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getResources(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
            "Resources fetched", 
            teacherOSService.getStudyMaterials(user.getId())));
    }

    @PostMapping("/resources")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> addResource(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        teacherOSService.addStudyMaterial(user.getId(), body);
        return ResponseEntity.ok(ApiResponse.success("Resource added"));
    }

    @DeleteMapping("/resources/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Object>> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        teacherOSService.deleteStudyMaterial(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted"));
    }
}
