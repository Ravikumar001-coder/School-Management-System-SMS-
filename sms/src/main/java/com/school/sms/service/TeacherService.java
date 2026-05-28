package com.school.sms.service;

import com.school.sms.dto.request.TeacherRequest;
import com.school.sms.dto.response.TeacherResponse;
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

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final DepartmentRepository departmentRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final AcademicYearRepository academicYearRepository;
    private final ReceiptNumberService receiptNumberService;

    @Transactional
    public TeacherResponse createTeacher(TeacherRequest request) {
        log.info("[HRMS ONBOARDING] Starting flow for: {} {}", request.getFirstName(), request.getLastName());

        // 1. UNIQUE IDENTITY VALIDATION (PHASE 10)
        validateIdentity(request);

        // 2. GENERATE EMPLOYEE ID
        String employeeId = receiptNumberService.nextTeacherId();

        // 3. CREATE LOGIN ACCOUNT
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .username(employeeId)
                .password(passwordEncoder.encode(employeeId))
                .enabled(true)
                .firstLogin(true)
                .build();
        user = userRepository.save(user);

        // 4. ASSIGN TEACHER ROLE
        Role teacherRole = roleRepository.findByName("TEACHER")
                .orElseThrow(() -> new RuntimeException("TEACHER role not found"));
        userRoleRepository.save(UserRole.builder().user(user).role(teacherRole).assignedBy("SYSTEM").build());

        // 5. RESOLVE RELATIONS
        List<Subject> subjects = request.getSubjectIds() != null 
                ? subjectRepository.findAllById(request.getSubjectIds()) 
                : List.of();
        
        Department dept = request.getDepartmentId() != null 
                ? departmentRepository.findById(request.getDepartmentId()).orElse(null) 
                : null;

        Branch branch = branchRepository.findFirstByActiveTrue()
                .orElseThrow(() -> new BadRequestException("No active branch found"));

        // 6. CREATE TEACHER PROFILE (HRMS)
        Teacher teacher = Teacher.builder()
                .user(user)
                .employeeId(employeeId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .joiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : java.time.LocalDate.now())
                .address(request.getAddress())
                .profilePhoto(request.getProfilePhoto())
                .bloodGroup(request.getBloodGroup())
                .emergencyContact(request.getEmergencyContact())
                
                // Professional
                .designation(request.getDesignation())
                .qualification(request.getQualification())
                .specialization(request.getSpecialization())
                .salary(request.getSalary())
                .employmentType(parseEnum(EmploymentType.class, request.getEmploymentType(), EmploymentType.FULL_TIME))
                .workShift(request.getWorkShift())
                .experienceYears(request.getExperienceYears())
                .department(dept)
                .branch(branch)
                
                // Payroll & Banking
                .bankAccountNo(request.getBankAccountNo())
                .ifscCode(request.getIfscCode())
                .panCard(request.getPanCard())
                .aadharCard(request.getAadharCard())
                .pfNumber(request.getPfNumber())
                .esiNumber(request.getEsiNumber())
                .paymentMode(parseEnum(PaymentMode.class, request.getPaymentMode(), PaymentMode.BANK_TRANSFER))
                .payrollStatus(PayrollStatus.ACTIVE)
                
                // Lifecycle & Security
                .probationEndDate(request.getProbationEndDate())
                .contractEndDate(request.getContractEndDate())
                .biometricId(request.getBiometricId())
                .status(parseStatus(request.getStatus()))
                .subjects(subjects)
                .createdBy("ADMIN")
                .build();

        teacher = teacherRepository.save(teacher);
        updateClassAssignments(teacher, request.getAssignedClassIds());

        // 7. AUDIT LOG
        auditLogService.logCreate("TEACHER", teacher.getId(), "HRMS ONBOARDING COMPLETED", null);

        log.info("[HRMS ONBOARDING] Success: {}", employeeId);
        return mapToResponse(teacher);
    }

    private void validateIdentity(TeacherRequest req) {
        if (teacherRepository.existsByEmailAndDeletedAtIsNull(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }
        if (req.getPanCard() != null && teacherRepository.existsByPanCardAndDeletedAtIsNull(req.getPanCard())) {
            throw new BadRequestException("PAN Card already registered: " + req.getPanCard());
        }
        if (req.getAadharCard() != null && teacherRepository.existsByAadharCardAndDeletedAtIsNull(req.getAadharCard())) {
            throw new BadRequestException("Aadhar Card already registered: " + req.getAadharCard());
        }
    }

    public Page<TeacherResponse> getFilteredTeachers(Long deptId, Long subjectId, Long classId, String search, Pageable pageable) {
        String keyword = (search != null && !search.isBlank()) ? search.trim() : null;
        return teacherRepository.findFiltered(deptId, subjectId, classId, keyword, pageable).map(this::mapToResponse);
    }

    public List<TeacherResponse> searchTeachers(String keyword) {
        return teacherRepository.findFiltered(null, null, null, keyword, Pageable.unpaged()).getContent().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public TeacherResponse getTeacherById(Long id) {
        Teacher t = teacherRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
        return mapToResponse(t);
    }

    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher t = teacherRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
        
        t.setFirstName(request.getFirstName());
        t.setLastName(request.getLastName());
        t.setEmail(request.getEmail());
        t.setPhone(request.getPhone());
        t.setGender(request.getGender());
        t.setDateOfBirth(request.getDateOfBirth());
        t.setAddress(request.getAddress());
        t.setProfilePhoto(request.getProfilePhoto());
        t.setBloodGroup(request.getBloodGroup());
        t.setEmergencyContact(request.getEmergencyContact());
        
        t.setDesignation(request.getDesignation());
        t.setQualification(request.getQualification());
        t.setSpecialization(request.getSpecialization());
        t.setSalary(request.getSalary());
        t.setEmploymentType(parseEnum(EmploymentType.class, request.getEmploymentType(), t.getEmploymentType()));
        t.setWorkShift(request.getWorkShift());
        t.setExperienceYears(request.getExperienceYears());
        
        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
            t.setDepartment(dept);
        }

        if (request.getSubjectIds() != null) {
            List<Subject> subjects = subjectRepository.findAllById(request.getSubjectIds());
            t.setSubjects(subjects);
        }

        t.setBankAccountNo(request.getBankAccountNo());
        t.setIfscCode(request.getIfscCode());
        t.setPanCard(request.getPanCard());
        t.setAadharCard(request.getAadharCard());
        t.setPfNumber(request.getPfNumber());
        t.setEsiNumber(request.getEsiNumber());
        t.setPaymentMode(parseEnum(PaymentMode.class, request.getPaymentMode(), t.getPaymentMode()));
        
        t.setProbationEndDate(request.getProbationEndDate());
        t.setContractEndDate(request.getContractEndDate());
        t.setBiometricId(request.getBiometricId());
        t.setStatus(parseStatus(request.getStatus()));

        t = teacherRepository.save(t);
        updateClassAssignments(t, request.getAssignedClassIds());
        
        return mapToResponse(t);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher t = teacherRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
        t.setStatus(TeacherStatus.INACTIVE);
        t.softDelete("ADMIN");
        teacherRepository.save(t);
    }

    public TeacherResponse mapToResponse(Teacher t) {
        List<Long> subjectIds = t.getSubjects() == null ? List.of() : t.getSubjects().stream().map(Subject::getId).collect(Collectors.toList());
        List<Long> classIds = classRoomRepository.findByClassTeacherId(t.getId()).stream().map(ClassRoom::getId).collect(Collectors.toList());

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
                .status(t.getStatus() != null ? t.getStatus().name() : "ACTIVE")
                .departmentId(t.getDepartment() != null ? t.getDepartment().getId() : null)
                .departmentName(t.getDepartment() != null ? t.getDepartment().getName() : "General")
                .designation(t.getDesignation())
                .employmentType(t.getEmploymentType() != null ? t.getEmploymentType().name() : null)
                .workShift(t.getWorkShift())
                .experienceYears(t.getExperienceYears())
                .leaveBalance(t.getLeaveBalance())
                .bankAccountNo(t.getBankAccountNo())
                .ifscCode(t.getIfscCode())
                .panCard(t.getPanCard())
                .aadharCard(t.getAadharCard())
                .pfNumber(t.getPfNumber())
                .esiNumber(t.getEsiNumber())
                .paymentMode(t.getPaymentMode() != null ? t.getPaymentMode().name() : null)
                .payrollStatus(t.getPayrollStatus() != null ? t.getPayrollStatus().name() : null)
                .biometricId(t.getBiometricId())
                .backgroundCheckStatus(t.getBackgroundCheckStatus() != null ? t.getBackgroundCheckStatus().name() : null)
                .documentVerificationStatus(t.getDocumentVerificationStatus() != null ? t.getDocumentVerificationStatus().name() : null)
                .probationEndDate(t.getProbationEndDate())
                .contractEndDate(t.getContractEndDate())
                .emergencyContact(t.getEmergencyContact())
                .bloodGroup(t.getBloodGroup())
                .subjectIds(subjectIds)
                .assignedClassIds(classIds)
                .build();
    }

    private <T extends Enum<T>> T parseEnum(Class<T> enumType, String value, T defaultValue) {
        if (value == null || value.isBlank()) return defaultValue;
        try {
            return Enum.valueOf(enumType, value.trim().toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private TeacherStatus parseStatus(String status) {
        return parseEnum(TeacherStatus.class, status, TeacherStatus.ACTIVE);
    }

    private void updateClassAssignments(Teacher teacher, List<Long> assignedClassIds) {
        List<ClassRoom> current = classRoomRepository.findByClassTeacherId(teacher.getId());
        current.forEach(c -> c.setClassTeacher(null));
        classRoomRepository.saveAll(current);
        if (assignedClassIds != null && !assignedClassIds.isEmpty()) {
            List<ClassRoom> targets = classRoomRepository.findAllById(assignedClassIds);
            targets.forEach(c -> c.setClassTeacher(teacher));
            classRoomRepository.saveAll(targets);
        }
    }
}