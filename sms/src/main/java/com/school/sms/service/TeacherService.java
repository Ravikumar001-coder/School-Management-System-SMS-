// service/TeacherService.java
package com.school.sms.service;

import com.school.sms.dto.request.TeacherRequest;
import com.school.sms.dto.response.TeacherResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.time.Year;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository   teacherRepository;
    private final UserRepository      userRepository;
    private final SubjectRepository   subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final RoleRepository      roleRepository;
    private final UserRoleRepository  userRoleRepository;
    private final PasswordEncoder     passwordEncoder;
    private final AuditLogService     auditLogService;
    private final AcademicYearRepository academicYearRepository;
    private final ReceiptNumberService receiptNumberService;

    @Transactional
    public TeacherResponse createTeacher(TeacherRequest request) {

        if (teacherRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())
                || userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                "Teacher with email already exists: " + request.getEmail());
        }

        // Generate employee ID gap-free
        String employeeId = receiptNumberService.nextTeacherId();

        // Create login account
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .username(employeeId)
                .password(passwordEncoder.encode(employeeId))
                .firstLogin(true)
                .build();
        user = userRepository.save(user);

        // Assign TEACHER role
        Role teacherRole = roleRepository.findByName("TEACHER")
                .orElseThrow(() -> new RuntimeException("TEACHER role not found"));
        
        userRoleRepository.save(UserRole.builder()
                .user(user)
                .role(teacherRole)
                .assignedBy("SYSTEM")
                .build());

        // Fetch subjects
        List<Subject> subjects = null;
        if (request.getSubjectIds() != null 
                && !request.getSubjectIds().isEmpty()) {
            subjects = subjectRepository
                    .findAllById(request.getSubjectIds());
        }

        TeacherStatus status = parseStatus(request.getStatus());

        Teacher teacher = Teacher.builder()
                .user(user)
                .employeeId(employeeId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .qualification(request.getQualification())
                .specialization(request.getSpecialization())
                .dateOfBirth(request.getDateOfBirth())
                .joiningDate(request.getJoiningDate())
                .gender(request.getGender())
                .address(request.getAddress())
                .profilePhoto(request.getProfilePhoto())
                .salary(request.getSalary())
                .subjects(subjects)
                .status(status)
                .build();

        teacher = teacherRepository.save(teacher);
        updateClassAssignments(teacher, request.getAssignedClassIds());

        // Audit Log
        AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);
        auditLogService.logCreate("TEACHER", teacher.getId(), 
            String.format("{\"employeeId\":\"%s\",\"email\":\"%s\"}", teacher.getEmployeeId(), teacher.getEmail()),
            currentYear != null ? currentYear.getLabel() : "N/A");

        return mapToResponse(teacher);
    }

    public Page<TeacherResponse> getAllTeachers(Pageable pageable) {
        return teacherRepository.findByDeletedAtIsNull(pageable)
                .map(this::mapToResponse);
    }

    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Teacher", id));
        return mapToResponse(teacher);
    }

    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Teacher", id));

        List<Subject> subjects = null;
        if (request.getSubjectIds() != null 
                && !request.getSubjectIds().isEmpty()) {
            subjects = subjectRepository
                    .findAllById(request.getSubjectIds());
        }

        User user = teacher.getUser();
        if (user != null) {
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            userRepository.save(user);
        }

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setDateOfBirth(request.getDateOfBirth());
        teacher.setJoiningDate(request.getJoiningDate());
        teacher.setGender(request.getGender());
        teacher.setAddress(request.getAddress());
        if (request.getProfilePhoto() != null) {
            teacher.setProfilePhoto(request.getProfilePhoto());
        }
        teacher.setSalary(request.getSalary());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            teacher.setStatus(parseStatus(request.getStatus()));
        }
        teacher.setSubjects(subjects);

        Teacher updated = teacherRepository.save(teacher);
        updateClassAssignments(updated, request.getAssignedClassIds());

        // Audit Log
        AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);
        auditLogService.logUpdate("TEACHER", updated.getId(), "PROFILE", null, null,
            currentYear != null ? currentYear.getLabel() : "N/A");

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Teacher", id));
        
        teacher.setStatus(TeacherStatus.INACTIVE);
        teacher.softDelete("ADMIN"); // Soft delete
        teacherRepository.save(teacher);

        // Audit Log
        AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);
        auditLogService.logDelete("TEACHER", id, 
            String.format("{\"employeeId\":\"%s\"}", teacher.getEmployeeId()),
            currentYear != null ? currentYear.getLabel() : "N/A");
    }

    public List<TeacherResponse> searchTeachers(String keyword) {
        return teacherRepository.searchTeachers(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Helpers ──────────────────────────────────────
    private String generateEmployeeId() {
        return receiptNumberService.nextTeacherId();
    }

    public TeacherResponse mapToResponse(Teacher t) {
        List<Long> subjectIds = t.getSubjects() == null
            ? List.of()
            : t.getSubjects().stream()
                .filter(Objects::nonNull)
                .map(Subject::getId)
                .collect(Collectors.toList());

        List<Long> assignedClassIds = classRoomRepository
            .findByClassTeacherId(t.getId())
            .stream()
            .map(ClassRoom::getId)
            .collect(Collectors.toList());

        return TeacherResponse.builder()
                .id(t.getId())
                .employeeId(t.getEmployeeId())
                .firstName(t.getFirstName())
                .lastName(t.getLastName())
                .email(t.getEmail())
                .phone(t.getPhone())
                .qualification(t.getQualification())
                .specialization(t.getSpecialization())
                .dateOfBirth(t.getDateOfBirth())
                .joiningDate(t.getJoiningDate())
                .gender(t.getGender())
                .address(t.getAddress())
                .profilePhoto(t.getProfilePhoto())
                .salary(t.getSalary())
                .subjectIds(subjectIds)
                .assignedClassIds(assignedClassIds)
                .status(t.getStatus() != null 
                        ? t.getStatus().name() : "ACTIVE")
                .build();
    }

    private TeacherStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return TeacherStatus.ACTIVE;
        }
        try {
            return TeacherStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return TeacherStatus.ACTIVE;
        }
    }

    private void updateClassAssignments(Teacher teacher, List<Long> assignedClassIds) {
        List<ClassRoom> currentlyAssigned = classRoomRepository.findByClassTeacherId(teacher.getId());
        currentlyAssigned.forEach(c -> c.setClassTeacher(null));
        classRoomRepository.saveAll(currentlyAssigned);

        if (assignedClassIds == null || assignedClassIds.isEmpty()) {
            return;
        }

        List<ClassRoom> classesToAssign = classRoomRepository.findAllById(assignedClassIds);
        classesToAssign.forEach(c -> c.setClassTeacher(teacher));
        classRoomRepository.saveAll(classesToAssign);
    }
}