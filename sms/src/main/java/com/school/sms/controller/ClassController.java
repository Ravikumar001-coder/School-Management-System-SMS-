package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.ClassRoom;
import com.school.sms.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassRoom>>> getClasses() {
        return ResponseEntity.ok(ApiResponse.success(
                "Classes fetched",
                classService.getAllClasses()));
    }
}
