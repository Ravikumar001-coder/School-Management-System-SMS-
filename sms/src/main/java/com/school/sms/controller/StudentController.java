// src/main/java/com/school/sms/controller/StudentController.java

package com.school.sms.controller;

import com.school.sms.dto.request.StudentRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.StudentResponse;
import com.school.sms.service.StudentService;
import com.school.sms.service.ExcelExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final ExcelExportService excelExportService;

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
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<StudentResponse> students = studentService.getStudentsFiltered(keyword, classId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }

    // Export Students to Excel
    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<byte[]> exportStudents() {
        try {
            List<StudentResponse> students = studentService.getAllStudentsList();
            List<String> headers = List.of("Student ID", "First Name", "Last Name", "Email", "Phone", "Status");
            
            List<Map<String, Object>> data = students.stream().map(s -> {
                Map<String, Object> row = new HashMap<>();
                row.put("Student ID", s.getStudentId() != null ? s.getStudentId() : "");
                row.put("First Name", s.getFirstName() != null ? s.getFirstName() : "");
                row.put("Last Name", s.getLastName() != null ? s.getLastName() : "");
                row.put("Email", s.getEmail() != null ? s.getEmail() : "");
                row.put("Phone", s.getPhone() != null ? s.getPhone() : "");
                row.put("Status", s.getStatus() != null ? s.getStatus() : "");
                return row;
            }).collect(Collectors.toList());

            byte[] excelBytes = excelExportService.exportToExcel("Students", headers, data);

            HttpHeaders headers_http = new HttpHeaders();
            headers_http.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers_http.setContentDisposition(ContentDisposition.attachment().filename("students_list.xlsx").build());

            return new ResponseEntity<>(excelBytes, headers_http, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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