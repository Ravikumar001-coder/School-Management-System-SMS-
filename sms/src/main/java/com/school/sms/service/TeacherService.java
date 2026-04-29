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
    private final PasswordEncoder     passwordEncoder;

    @Transactional
    public TeacherResponse createTeacher(TeacherRequest request) {

        if (teacherRepository.existsByEmail(request.getEmail())
                || userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                "Teacher with email already exists: " + request.getEmail());
        }

        // Generate employee ID first so it can be used as default username/password.
        String employeeId = generateEmployeeId();

        // Create login account
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
            .username(employeeId)
            .password(passwordEncoder.encode(employeeId))
                .role(Role.TEACHER)
            .firstLogin(true)
                .build();
        user = userRepository.save(user);

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
        return mapToResponse(teacher);
    }

    public Page<TeacherResponse> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Teacher", id));
        return mapToResponse(teacher);
    }

    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
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
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Teacher", id));
        teacher.setStatus(TeacherStatus.INACTIVE);
        teacherRepository.save(teacher);
    }

    public List<TeacherResponse> searchTeachers(String keyword) {
        return teacherRepository.searchTeachers(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Helpers ──────────────────────────────────────
    private String generateEmployeeId() {
        int currentYear = Year.now().getValue();
        long sequence = teacherRepository.count() + 1;

        while (sequence <= 999_999) {
            String candidate = String.format("TCH-%d-%03d", currentYear, sequence);
            if (!teacherRepository.existsByEmployeeId(candidate)
                    && !userRepository.existsByUsername(candidate)) {
                return candidate;
            }
            sequence++;
        }

        throw new IllegalStateException("Unable to generate unique teacher employee ID");
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