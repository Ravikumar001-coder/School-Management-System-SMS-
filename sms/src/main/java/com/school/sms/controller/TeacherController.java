// controller/TeacherController.java
package com.school.sms.controller;

import com.school.sms.dto.request.TeacherRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.TeacherResponse;
import com.school.sms.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponse>> create(
            @Valid @RequestBody TeacherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                    "Teacher created", 
                    teacherService.createTeacher(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<Page<TeacherResponse>>> getAll(
            @RequestParam(defaultValue = "0")    int page,
            @RequestParam(defaultValue = "10")   int size,
            @RequestParam(defaultValue = "firstName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, 
                                           Sort.by(sortBy));
        return ResponseEntity.ok(ApiResponse.success(
            "Teachers fetched", 
            teacherService.getAllTeachers(pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<TeacherResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            "Teacher found", teacherService.getTeacherById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponse>> update(
            @PathVariable Long id,
            @RequestBody TeacherRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            "Teacher updated", 
            teacherService.updateTeacher(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(
            ApiResponse.success("Teacher deactivated"));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> search(
            @RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(
            "Search results", 
            teacherService.searchTeachers(keyword)));
    }
}