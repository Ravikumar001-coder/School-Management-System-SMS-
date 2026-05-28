package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Department;
import com.school.sms.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final com.school.sms.repository.SubjectRepository subjectRepository;
    private final com.school.sms.repository.TeacherRepository teacherRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Departments fetched", departmentRepository.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Department>> create(@RequestBody Department department) {
        return ResponseEntity.ok(ApiResponse.success("Department created", departmentRepository.save(department)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        long subjectCount = subjectRepository.countByDepartmentId(id);
        long teacherCount = teacherRepository.countByDepartmentId(id);
        
        if (subjectCount > 0 || teacherCount > 0) {
            return ResponseEntity.status(409).body(ApiResponse.error(
                "Cannot delete department. It is linked to " + subjectCount + " subjects and " + teacherCount + " teachers."
            ));
        }
        
        departmentRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted"));
    }
}
