package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Student;
import com.school.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ID Card Controller
 * Provides endpoints to:
 *  - Fetch students for a given class for ID card generation
 */
@RestController
@RequestMapping("/api/v1/admin/id-cards")
@RequiredArgsConstructor
public class IdCardController {

    private final StudentRepository studentRepository;

    /**
     * GET /api/v1/admin/id-cards/students?classId={id}
     * Fetch students from a class for ID card generation.
     */
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<Student>>> getStudentsForIdCards(
            @RequestParam Long classId) {
        List<Student> students = studentRepository.findByClassRoom_Id(classId);
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }
}
