// src/main/java/com/school/sms/service/StudentService.java

package com.school.sms.service;

import com.school.sms.dto.request.StudentRequest;
import com.school.sms.dto.response.StudentResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.school.sms.security.RequirePermission;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

    // Backward-compatible method used by existing controller
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ========================
    // CREATE STUDENT
    // ========================
    @Transactional
    @RequirePermission("STUDENTS_CREATE")
    public StudentResponse createStudent(StudentRequest request) {
        
        // Find the classroom
        ClassRoom classRoom = classRoomRepository.findById(
                Objects.requireNonNull(request.getClassRoomId(), "Class id is required"))
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Class not found!"));

        // Auto-generate student ID gap-free
        AcademicYear currentYear = academicYearRepository.findByLabel(request.getAcademicYear())
                .orElseGet(() -> academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null));
        
        if (currentYear == null) throw new RuntimeException("No active academic year found");
        
        String studentId = receiptNumberService.nextStudentId(currentYear);

        // Create user account for student (for login)
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .username(studentId)
                .password(passwordEncoder.encode(studentId))
                .enabled(true)
                .firstLogin(true)
                .build();
        user = userRepository.save(Objects.requireNonNull(user));

        // Assign STUDENT role
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Default STUDENT role not found in DB"));

        userRoleRepository.save(UserRole.builder()
                .user(user)
                .role(studentRole)
                .assignedBy("SYSTEM")
                .build());

        // Create student profile
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
                .parentName(request.getParentName())
                .parentPhone(request.getParentPhone())
                .parentEmail(request.getParentEmail())
                .guardianRelationship(request.getGuardianRelationship())
                .bloodGroup(request.getBloodGroup())
                .profilePhoto(request.getProfilePhoto())
                .classRoom(classRoom)
                .academicYear(academicYearRepository.findByLabel(request.getAcademicYear())
                        .orElseGet(() -> academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null)))
                .status(StudentStatus.ACTIVE)
                .admissionClass(request.getAdmissionClass())
                .courses(request.getCourses())
                .branch(branchRepository.findFirstByActiveTrue().orElse(null))
                .build();

        student = studentRepository.save(Objects.requireNonNull(student));

        // Auto-provision or link parent account
        if (request.getParentPhone() != null && !request.getParentPhone().trim().isEmpty()) {
            try {
                autoProvisionParent(student, request);
            } catch (Exception e) {
                // Log and continue, student creation shouldn't fail if parent link fails
                System.err.println("Failed to auto-provision parent: " + e.getMessage());
            }
        }

        // Audit: log student creation
        auditLogService.logCreate("STUDENT", student.getId(),
                String.format("{\"studentId\":\"%s\",\"name\":\"%s %s\"}",
                        student.getStudentId(), student.getFirstName(), student.getLastName()),
                student.getAcademicYear() != null ? student.getAcademicYear().getLabel() : null);

        return mapToResponse(student);
    }

    // ========================
    // GET FILTERED STUDENTS (Paginated)
    // ========================
    @RequirePermission("STUDENTS_VIEW")
    public Page<StudentResponse> getStudentsFiltered(String keyword, Long classId, Pageable pageable) {
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasClassId = classId != null;

        if (!hasKeyword && !hasClassId) {
            System.out.println("[DEBUG] No filters provided, using studentRepository.findAllActive()");
            return studentRepository.findAllActive(pageable).map(this::mapToResponse);
        }

        System.out.println("[DEBUG] Filters provided - keyword: " + keyword + ", classId: " + classId);
        return studentRepository.findFiltered(keyword, classId, Objects.requireNonNull(pageable))
                .map(this::mapToResponse);
    }

    // ========================
    // GET ALL STUDENTS (Paginated)
    // ========================
    @RequirePermission("STUDENTS_VIEW")
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(Objects.requireNonNull(pageable))
                .map(this::mapToResponse);
    }

    // ========================
    // GET STUDENT BY ID
    // ========================
    @Cacheable(value = "students", key = "#id")
    @RequirePermission("STUDENTS_VIEW")
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    // ========================
    // UPDATE STUDENT
    // ========================
    @Transactional
    @CacheEvict(value = "students", key = "#id")
    @RequirePermission("STUDENTS_EDIT")
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Student not found!"));

        ClassRoom classRoom = classRoomRepository.findById(
                        Objects.requireNonNull(request.getClassRoomId(), "Class id is required"))
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Class not found!"));

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setAddress(request.getAddress());
        student.setParentName(request.getParentName());
        student.setParentPhone(request.getParentPhone());
        student.setParentEmail(request.getParentEmail());
        student.setGuardianRelationship(request.getGuardianRelationship());
        student.setBloodGroup(request.getBloodGroup());
        if (request.getProfilePhoto() != null) {
            student.setProfilePhoto(request.getProfilePhoto());
        }
        student.setAcademicYear(academicYearRepository.findByLabel(request.getAcademicYear())
                .orElseGet(() -> academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null)));
        student.setClassRoom(classRoom);
        student.setAdmissionClass(request.getAdmissionClass());
        student.setCourses(request.getCourses());

        User user = student.getUser();
        if (user != null) {
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            userRepository.save(user);
        }

        student = studentRepository.save(student);

        // Audit: log student update
        auditLogService.logUpdate("STUDENT", student.getId(), "PROFILE", null, null,
                student.getAcademicYear() != null ? student.getAcademicYear().getLabel() : null);

        return mapToResponse(student);
    }

    // ========================
    // DELETE STUDENT
    // ========================
    @Transactional
    @CacheEvict(value = "students", allEntries = true)
    @RequirePermission("STUDENTS_DELETE")
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Student not found!"));
        
        // Soft delete logic
        student.setStatus(StudentStatus.INACTIVE);
        student.softDelete("ADMIN"); 
        studentRepository.save(student);

        // Audit: log student deletion
        auditLogService.logDelete("STUDENT", student.getId(), 
            String.format("{\"studentId\":\"%s\"}", student.getStudentId()),
            student.getAcademicYear() != null ? student.getAcademicYear().getLabel() : null);
    }

    // ========================
    // SEARCH STUDENTS
    // ========================
    @RequirePermission("STUDENTS_VIEW")
    public List<StudentResponse> searchStudents(String keyword) {
        return studentRepository
                .searchByKeyword(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ========================
    // GET STUDENTS BY CLASS
    // ========================
    @RequirePermission("STUDENTS_VIEW")
    public List<StudentResponse> getStudentsByClass(Long classId) {
        return studentRepository.findByClassRoomId(Objects.requireNonNull(classId))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long countTotalStudents() {
        return studentRepository.count();
    }

    public Long nativeCountStudents() {
        return studentRepository.countNative();
    }

    public boolean isOwnProfile(Long studentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return false;
        }

        String principal = authentication.getName();
        return studentRepository.findById(Objects.requireNonNull(studentId))
            .map(student -> {
                if (student.getUser() != null) {
                String username = student.getUser().getUsername();
                String userEmail = student.getUser().getEmail();
                return (username != null && username.equalsIgnoreCase(principal))
                    || (userEmail != null && userEmail.equalsIgnoreCase(principal));
                }
                return student.getEmail() != null
                    && student.getEmail().equalsIgnoreCase(principal);
            })
                .orElse(false);
    }

    // ========================
    // HELPER METHODS
    // ========================

    private void autoProvisionParent(Student student, StudentRequest request) {
        String mobile = request.getParentPhone().trim();
        Parent parent = parentRepository.findByMobileNumberAndDeletedAtIsNull(mobile)
                .orElseGet(() -> {
                    Parent newParent = Parent.builder()
                            .fullName(request.getParentName() != null ? request.getParentName() : "Guardian of " + student.getFirstName())
                            .mobileNumber(mobile)
                            .email(request.getParentEmail())
                            .relationshipDefault(request.getGuardianRelationship() != null ? request.getGuardianRelationship().toUpperCase() : "GUARDIAN")
                            .academicYear(student.getAcademicYear())
                            .isActive(true)
                            .build();
                    return parentRepository.save(newParent);
                });

        // Check if link already exists
        boolean alreadyLinked = parent.getStudentLinks().stream()
                .anyMatch(l -> l.getStudent().getId().equals(student.getId()));
        
        if (!alreadyLinked) {
            ParentStudentLink link = ParentStudentLink.builder()
                    .parent(parent)
                    .student(student)
                    .relationshipType(request.getGuardianRelationship() != null ? request.getGuardianRelationship().toUpperCase() : "GUARDIAN")
                    .isPrimaryContact(true)
                    .feeResponsible(true)
                    .pickupAuthorized(true)
                    .createdBy("SYSTEM_AUTO")
                    .build();
            parentStudentLinkRepository.save(link);
        }
    }

    private String generateStudentId() {
        return receiptNumberService.nextStudentId();
    }

    private StudentResponse mapToResponse(Student student) {
        String className = student.getClassRoom() != null ? student.getClassRoom().getName() : "";
        String sectionName = student.getClassRoom() != null ? student.getClassRoom().getSection() : "";

        return StudentResponse.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .address(student.getAddress())
                .parentName(student.getParentName())
                .parentPhone(student.getParentPhone())
                .parentEmail(student.getParentEmail())
                .guardianRelationship(student.getGuardianRelationship())
                .bloodGroup(student.getBloodGroup())
                .academicYear(student.getAcademicYear() != null ? student.getAcademicYear().getLabel() : null)
                .classRoomId(student.getClassRoom() != null
                        ? student.getClassRoom().getId() : null)
                .className(className)
                .sectionName(sectionName)
                .status(student.getStatus() != null ? 
                        student.getStatus().name() : "ACTIVE")
                .profilePhoto(student.getProfilePhoto())
                .admissionClass(student.getAdmissionClass())
                .courses(student.getCourses())
                .build();
    }
}