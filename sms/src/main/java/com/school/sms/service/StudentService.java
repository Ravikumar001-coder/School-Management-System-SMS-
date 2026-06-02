package com.school.sms.service;

import com.school.sms.dto.request.StudentRequest;
import com.school.sms.dto.request.ParentRequest;
import com.school.sms.dto.response.StudentResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.exception.BadRequestException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AcademicYearRepository academicYearRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final ReceiptNumberService receiptNumberService;
    private final BranchRepository branchRepository;
    private final ParentRepository parentRepository;
    private final ParentStudentLinkRepository parentStudentLinkRepository;
    private final ExcelExportService excelExportService;

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        log.info("[ENTERPRISE ADMISSION] Starting flow for: {} {}", request.getFirstName(), request.getLastName());

        // 1. VALIDATION & RESOLUTION
        if (studentRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())) {
            throw new BadRequestException("Student with email already exists: " + request.getEmail());
        }

        AcademicYear academicYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new BadRequestException("No active academic year found"));

        ClassRoom classRoom = classRoomRepository.findById(request.getClassRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        Branch branch = branchRepository.findFirstByActiveTrue()
                .orElseThrow(() -> new BadRequestException("No active branch found"));

        // 2. GENERATE IDENTITY
        String studentId = receiptNumberService.nextStudentId(academicYear);
        String rollNumber = request.getRollNumber() != null ? request.getRollNumber() : "PENDING";

        // 3. CREATE USER ACCOUNT (Optional for Portal Access)
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .username(studentId)
                .password(passwordEncoder.encode(studentId))
                .enabled(true)
                .firstLogin(true)
                .build();
        user = userRepository.save(user);

        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("STUDENT role not found"));
        userRoleRepository.save(UserRole.builder().user(user).role(studentRole).assignedBy("SYSTEM").build());

        // 4. RESOLVE OR CREATE PARENT
        Parent parent = resolveOrCreateParent(request.getParent(), branch);

        // 5. CREATE STUDENT PROFILE
        Student student = Student.builder()
                .studentId(studentId)
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .profilePhoto(request.getProfilePhoto())
                .rollNumber(rollNumber)
                .section(request.getSection())
                .aadharCard(request.getAadharCard())
                .nationality(request.getNationality())
                .religion(request.getReligion())
                .category(request.getCategory())
                .emergencyContact(request.getEmergencyContact())
                .medicalConditions(request.getMedicalConditions())
                .previousSchool(request.getPreviousSchool())
                .admissionSource(request.getAdmissionSource())
                .isNewAdmission(true)
                .admissionDate(request.getAdmissionDate() != null ? request.getAdmissionDate() : LocalDate.now())
                .classRoom(classRoom)
                .academicYear(academicYear)
                .branch(branch)
                .status(StudentStatus.ACTIVE)
                .createdBy("ADMIN")
                .build();

        student = studentRepository.save(student);

        // 6. LINK PARENT
        ParentStudentLink link = ParentStudentLink.builder()
                .parent(parent)
                .student(student)
                .relationship(request.getGuardianRelationship() != null ? request.getGuardianRelationship() : "GUARDIAN")
                .isPrimaryGuardian(request.getIsPrimaryGuardian() != null ? request.getIsPrimaryGuardian() : true)
                .build();
        parentStudentLinkRepository.save(link);

        // 7. AUDIT LOG
        auditLogService.logCreate("STUDENT", student.getId(), "ADMISSION COMPLETED", academicYear.getLabel());

        log.info("[ENTERPRISE ADMISSION] Success: {}", studentId);
        return mapToResponse(student);
    }

    private Parent resolveOrCreateParent(ParentRequest req, Branch branch) {
        // Try resolving by ID first
        if (req.getId() != null) {
            return parentRepository.findById(req.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Linked parent not found"));
        }

        // Try resolving by phone (to support siblings)
        Optional<Parent> existing = parentRepository.findByPhoneAndDeletedAtIsNull(req.getPhone());
        if (existing.isPresent()) {
            return existing.get();
        }

        // Create new Parent & User account
        String username = "PAR-" + req.getPhone();
        User parentUser = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .username(username)
                .password(passwordEncoder.encode(req.getPhone()))
                .enabled(true)
                .firstLogin(true)
                .build();
        parentUser = userRepository.save(parentUser);

        Role parentRole = roleRepository.findByName("PARENT")
                .orElseThrow(() -> new RuntimeException("PARENT role not found"));
        userRoleRepository.save(UserRole.builder().user(parentUser).role(parentRole).assignedBy("SYSTEM").build());

        Parent parent = Parent.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .occupation(req.getOccupation())
                .address(req.getAddress())
                .user(parentUser)
                .branch(branch)
                .isActive(true)
                .build();
        
        return parentRepository.save(parent);
    }

    public List<StudentResponse> getAllStudentsList() {
        return studentRepository.searchByKeyword("").stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Page<StudentResponse> getStudentsFiltered(String keyword, Long classId, Pageable pageable) {
        return studentRepository.findFiltered(keyword, classId, pageable).map(this::mapToResponse);
    }

    public Long countStudentsFiltered(Long classId, String section, String statusStr) {
        StudentStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = StudentStatus.valueOf(statusStr.toUpperCase());
            } catch (Exception e) {
                // Ignore invalid status
            }
        }
        return studentRepository.countFiltered(classId, section, status);
    }

    @Transactional
    public void performBulkAction(String action, List<Long> studentIds) {
        List<Student> students = studentRepository.findAllById(studentIds);
        for (Student s : students) {
            if ("ACTIVATE".equalsIgnoreCase(action)) {
                s.setStatus(StudentStatus.ACTIVE);
                s.setDeletedAt(null);
            } else if ("DEACTIVATE".equalsIgnoreCase(action)) {
                s.setStatus(StudentStatus.INACTIVE);
            } else if ("DELETE".equalsIgnoreCase(action)) {
                s.softDelete("ADMIN");
            }
        }
        studentRepository.saveAll(students);
    }

    public void sendBulkSms(List<Long> studentIds, String message) {
        List<Student> students = studentRepository.findAllById(studentIds);
        for (Student s : students) {
            String parentPhone = s.getParentPhone();
            if (parentPhone == null && s.getParentLinks() != null && !s.getParentLinks().isEmpty()) {
                parentPhone = s.getParentLinks().get(0).getParent().getPhone();
            }
            if (parentPhone != null && !parentPhone.isBlank()) {
                log.info("[SMS MOCK] Sending SMS to {} (Parent of {} {}): {}", 
                    parentPhone, s.getFirstName(), s.getLastName(), message);
            }
        }
    }

    public byte[] exportStudents(Long classId, String section, String format) throws IOException {
        // Fetch filtered students for export. Currently ignoring pagination for full export.
        // We'll use getStudentsFiltered with a large page size for simplicity.
        org.springframework.data.domain.PageRequest pr = org.springframework.data.domain.PageRequest.of(0, 10000);
        List<StudentResponse> students = studentRepository.findFiltered("", classId, pr).stream()
                .filter(s -> section == null || section.isBlank() || section.equals(s.getClassRoom() != null ? s.getClassRoom().getSection() : ""))
                .map(this::mapToResponse)
                .collect(Collectors.toList());

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

        if ("csv".equalsIgnoreCase(format)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PrintWriter writer = new PrintWriter(out);
            writer.println(String.join(",", headers));
            for (Map<String, Object> row : data) {
                writer.println(headers.stream()
                        .map(h -> String.valueOf(row.getOrDefault(h, "")))
                        .map(val -> "\"" + val.replace("\"", "\"\"") + "\"")
                        .collect(Collectors.joining(",")));
            }
            writer.flush();
            return out.toByteArray();
        } else {
            // Default to excel
            return excelExportService.exportToExcel("Students", headers, data);
        }
    }

    public List<StudentResponse> searchStudents(String keyword) {
        return studentRepository.searchByKeyword(keyword).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<StudentResponse> getStudentsByClass(Long classId) {
        return studentRepository.findByClassRoom_Id(classId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ========================
    // PROMOTION ENGINE
    // ========================
    @Transactional
    public void promoteStudents(List<Long> studentIds, Long targetClassRoomId, String targetAcademicYearLabel) {
        log.info("[PROMOTION ENGINE] Promoting {} students to class ID {}", studentIds.size(), targetClassRoomId);
        
        AcademicYear targetYear = academicYearRepository.findByLabel(targetAcademicYearLabel)
                .orElseThrow(() -> new ResourceNotFoundException("Target academic year not found"));
        
        ClassRoom targetClass = classRoomRepository.findById(targetClassRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Target classroom not found"));

        for (Long id : studentIds) {
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
            
            // Archive current state
            student.setPromotedFromClassroomId(student.getClassRoom().getId());
            student.setPreviousStudentId(student.getStudentId());
            
            // Assign to new class and year
            student.setClassRoom(targetClass);
            student.setAcademicYear(targetYear);
            student.setIsNewAdmission(false);
            student.setAdmissionSource("Promotion");
            
            studentRepository.save(student);
        }
        log.info("[PROMOTION ENGINE] Bulk promotion completed successfully.");
    }

    // ========================
    // GRADUATION ENGINE
    // ========================
    @Transactional
    public void graduateStudents(List<Long> studentIds, LocalDate graduationDate) {
        log.info("[GRADUATION ENGINE] Graduating {} students", studentIds.size());
        
        for (Long id : studentIds) {
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
            
            student.setStatus(StudentStatus.GRADUATED);
            student.setGraduationDate(graduationDate != null ? graduationDate : LocalDate.now());
            
            studentRepository.save(student);
        }
        log.info("[GRADUATION ENGINE] Bulk graduation completed.");
    }

    // ========================
    // TRANSFER ENGINE
    // ========================
    @Transactional
    public void transferOutStudent(Long id, String tcNumber) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        student.setStatus(StudentStatus.INACTIVE);
        student.setTransferCertificateNo(tcNumber);
        studentRepository.save(student);
        
        log.info("[TRANSFER ENGINE] Student {} marked as transferred with TC {}", id, tcNumber);
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return mapToResponse(student);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        s.setFirstName(request.getFirstName());
        s.setLastName(request.getLastName());
        s.setEmail(request.getEmail());
        s.setPhone(request.getPhone());
        s.setDateOfBirth(request.getDateOfBirth());
        s.setGender(request.getGender());
        s.setAddress(request.getAddress());
        s.setBloodGroup(request.getBloodGroup());
        s.setRollNumber(request.getRollNumber());
        s.setSection(request.getSection());
        s.setAadharCard(request.getAadharCard());
        s.setMedicalConditions(request.getMedicalConditions());
        
        // Schema updates
        s.setNationality(request.getNationality());
        s.setReligion(request.getReligion());
        s.setCategory(request.getCategory());
        s.setEmergencyContact(request.getEmergencyContact());
        s.setPreviousSchool(request.getPreviousSchool());
        s.setAdmissionSource(request.getAdmissionSource());
        s.setAdmissionDate(request.getAdmissionDate());
        s.setAdmissionClass(request.getAdmissionClass());
        s.setCourses(request.getCourses());
        s.setIsNewAdmission(request.getIsNewAdmission());
        s.setGraduationDate(request.getGraduationDate());
        s.setPromotedFromClassroomId(request.getPromotedFromClassroomId());
        s.setPreviousStudentId(request.getPreviousStudentId());
        s.setTransferCertificateNo(request.getTransferCertificateNo());

        // Update direct denormalized parent columns on students table
        if (request.getParent() != null) {
            s.setParentName(request.getParent().getFirstName() + " " + request.getParent().getLastName());
            s.setParentPhone(request.getParent().getPhone());
            s.setParentEmail(request.getParent().getEmail());
        }
        if (request.getGuardianRelationship() != null) {
            s.setGuardianRelationship(request.getGuardianRelationship());
        }
        
        // Synchronize linked parent entity if present
        if (s.getParentLinks() != null && !s.getParentLinks().isEmpty() && request.getParent() != null) {
            Parent p = s.getParentLinks().get(0).getParent();
            p.setFirstName(request.getParent().getFirstName());
            p.setLastName(request.getParent().getLastName());
            p.setPhone(request.getParent().getPhone());
            p.setEmail(request.getParent().getEmail());
            p.setOccupation(request.getParent().getOccupation());
            p.setAddress(request.getParent().getAddress());
            parentRepository.save(p);
            
            ParentStudentLink link = s.getParentLinks().get(0);
            if (request.getGuardianRelationship() != null) {
                link.setRelationship(request.getGuardianRelationship());
                parentStudentLinkRepository.save(link);
            }
        }

        if (request.getClassRoomId() != null) {
            ClassRoom cr = classRoomRepository.findById(request.getClassRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));
            s.setClassRoom(cr);
        }

        s = studentRepository.save(s);
        return mapToResponse(s);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        student.setStatus(StudentStatus.INACTIVE);
        student.softDelete("ADMIN");
        studentRepository.save(student);
    }

    private StudentResponse mapToResponse(Student s) {
        // Find primary parent for aggregated view
        Parent primaryParent = s.getParentLinks() != null && !s.getParentLinks().isEmpty()
                ? s.getParentLinks().get(0).getParent()
                : null;
        String rel = s.getParentLinks() != null && !s.getParentLinks().isEmpty()
                ? s.getParentLinks().get(0).getRelationship()
                : "GUARDIAN";

        return StudentResponse.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .dateOfBirth(s.getDateOfBirth())
                .gender(s.getGender())
                .bloodGroup(s.getBloodGroup())
                .address(s.getAddress())
                .academicYear(s.getAcademicYear() != null ? s.getAcademicYear().getLabel() : null)
                .classRoomId(s.getClassRoom() != null ? s.getClassRoom().getId() : null)
                .className(s.getClassRoom() != null ? s.getClassRoom().getName() : null)
                .sectionName(s.getClassRoom() != null ? s.getClassRoom().getSection() : null)
                .rollNumber(s.getRollNumber())
                .section(s.getSection())
                .aadharCard(s.getAadharCard())
                .nationality(s.getNationality())
                .religion(s.getReligion())
                .category(s.getCategory())
                .emergencyContact(s.getEmergencyContact())
                .medicalConditions(s.getMedicalConditions())
                .previousSchool(s.getPreviousSchool())
                .admissionSource(s.getAdmissionSource())
                .admissionDate(s.getAdmissionDate())
                .status(s.getStatus() != null ? s.getStatus().name() : "ACTIVE")
                .profilePhoto(s.getProfilePhoto())
                .parentId(primaryParent != null ? primaryParent.getId() : null)
                .parentName(s.getParentName())
                .parentPhone(s.getParentPhone())
                .parentEmail(s.getParentEmail())
                .parentRelationship(rel)
                .guardianRelationship(s.getGuardianRelationship())
                .admissionClass(s.getAdmissionClass())
                .courses(s.getCourses())
                .isNewAdmission(s.getIsNewAdmission())
                .graduationDate(s.getGraduationDate())
                .promotedFromClassroomId(s.getPromotedFromClassroomId())
                .previousStudentId(s.getPreviousStudentId())
                .transferCertificateNo(s.getTransferCertificateNo())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .createdBy(s.getCreatedBy())
                .updatedBy(s.getUpdatedBy())
                .branchId(s.getBranch() != null ? s.getBranch().getId() : null)
                .branchName(s.getBranch() != null ? s.getBranch().getName() : null)
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .build();
    }
}