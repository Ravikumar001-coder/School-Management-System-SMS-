// src/main/java/com/school/sms/controller/StudentController.java

package com.school.sms.controller;

import com.school.sms.dto.request.StudentRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.StudentResponse;
import com.school.sms.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // GET all students with pagination
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getAllStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long classId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        System.out.println("[DEBUG] StudentController.getAllStudents - params: keyword=" + keyword + ", classId=" + classId);
        long totalInDb = studentService.countTotalStudents();
        System.out.println("[DEBUG] Total students in DB (Hibernate count): " + totalInDb);
        
        try {
             // Direct Native SQL check to verify the connection is seeing the table
             Long nativeCount = studentService.nativeCountStudents();
             System.out.println("[DEBUG] Total students in DB (NATIVE SQL count): " + nativeCount);
        } catch (Exception e) {
             System.err.println("[DEBUG] Native SQL check failed: " + e.getMessage());
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<StudentResponse> students = studentService.getStudentsFiltered(keyword, classId, pageable);
        
        System.out.println("[DEBUG] Found students in this page: " + students.getNumberOfElements());
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }

    // GET student by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'TEACHER') or " +
                  "(hasRole('STUDENT') and @studentSecurityService.isOwnProfile(#id))")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student found", student));
    }

    // POST create student
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
            @Valid @RequestBody StudentRequest request) {
        
        StudentResponse student = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created", student));
    }

    // PUT update student
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        
        StudentResponse student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated", student));
    }

    // DELETE (soft delete) student
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deactivated successfully"));
    }

    // GET search students
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> searchStudents(
            @RequestParam String keyword) {
        
        List<StudentResponse> students = studentService.searchStudents(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search results", students));
    }

    // GET students by class
    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getStudentsByClass(
            @PathVariable Long classId) {
        
        List<StudentResponse> students = studentService.getStudentsByClass(classId);
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }
}