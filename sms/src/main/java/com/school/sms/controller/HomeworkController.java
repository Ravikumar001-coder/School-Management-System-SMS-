package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.User;
import com.school.sms.service.HomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/teacher/homework")
@RequiredArgsConstructor
public class HomeworkController {

    private final HomeworkService homeworkService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listMyHomework(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Homework list fetched",
                homeworkService.listByTeacher(user.getId())));
    }

    @GetMapping("/class/{classRoomId}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN','STUDENT','PARENT')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listByClass(
            @PathVariable Long classRoomId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Homework fetched",
                homeworkService.listByClassRoom(classRoomId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createHomework(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Homework created",
                homeworkService.create(user.getId(), body)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateHomework(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Homework updated",
                homeworkService.update(user.getId(), id, body)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteHomework(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        homeworkService.delete(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Homework deleted"));
    }
}
