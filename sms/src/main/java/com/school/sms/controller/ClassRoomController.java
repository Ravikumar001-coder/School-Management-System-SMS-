// controller/ClassRoomController.java
package com.school.sms.controller;

import com.school.sms.dto.request.ClassRoomRequest;
import com.school.sms.dto.response.*;
import com.school.sms.service.ClassRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class ClassRoomController {

    private final ClassRoomService classRoomService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<ClassRoomResponse>> create(
            @Valid @RequestBody ClassRoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                    "Class created",
                    classRoomService.createClassRoom(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassRoomResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(
            "Classes fetched",
            classRoomService.getAllClassRooms()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassRoomResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            "Class found",
            classRoomService.getClassRoomById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<ClassRoomResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ClassRoomRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            "Class updated",
            classRoomService.updateClassRoom(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Long id) {
        classRoomService.deleteClassRoom(id);
        return ResponseEntity.ok(ApiResponse.success("Class deleted"));
    }
}