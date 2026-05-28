package com.school.sms.service.hrms;

import com.school.sms.dto.request.hrms.StaffOnboardingRequest;
import com.school.sms.model.User;
import com.school.sms.model.hrms.Staff;
import com.school.sms.repository.*;
import com.school.sms.repository.hrms.DesignationRepository;
import com.school.sms.repository.hrms.StaffRepository;
import com.school.sms.repository.hrms.WorkShiftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffOnboardingService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final DesignationRepository designationRepository;
    private final WorkShiftRepository workShiftRepository;

    @Transactional
    public Staff onboardNewStaff(StaffOnboardingRequest request) {
        log.info("Starting onboarding process for: {} {}", request.getFirstName(), request.getLastName());
        
        Staff staffData = new Staff();
        staffData.setFirstName(request.getFirstName());
        staffData.setLastName(request.getLastName());
        staffData.setPhone(request.getPhone());
        staffData.setEmail(request.getEmail());
        staffData.setDateOfBirth(request.getDateOfBirth());
        staffData.setGender(request.getGender());
        staffData.setBloodGroup(request.getBloodGroup());
        staffData.setEmergencyContactName(request.getEmergencyContactName());
        staffData.setEmergencyContactPhone(request.getEmergencyContactPhone());
        staffData.setBiometricId(request.getAadhaarNumber()); // use aadhaar as placeholder if not provided
        staffData.setJoiningDate(request.getJoiningDate());
        staffData.setEmploymentType(Staff.EmploymentType.valueOf(request.getEmploymentType()));
        
        // Setup relations
        staffData.setDepartment(departmentRepository.findById(request.getDepartmentId())
            .orElseThrow(() -> new RuntimeException("Department not found")));
        staffData.setRole(roleRepository.findById(request.getRoleId())
            .orElseThrow(() -> new RuntimeException("Role not found")));
        staffData.setBranch(branchRepository.findById(request.getBranchId())
            .orElseThrow(() -> new RuntimeException("Branch not found")));
            
        if (request.getDesignationId() != null) {
            staffData.setDesignation(designationRepository.findById(request.getDesignationId())
                .orElseThrow(() -> new RuntimeException("Designation not found")));
        }
        if (request.getWorkShiftId() != null) {
            staffData.setWorkShift(workShiftRepository.findById(request.getWorkShiftId())
                .orElseThrow(() -> new RuntimeException("Work shift not found")));
        }
        if (request.getReportingManagerId() != null) {
            staffData.setReportingManager(staffRepository.findById(request.getReportingManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found")));
        }

        // 1. Generate Employee Code
        String empCode = "EMP" + LocalDate.now().getYear() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        staffData.setEmployeeCode(empCode);
        staffData.setStatus(Staff.StaffStatus.PROBATION);
        
        // 2. Auto-generate System User Account
        User user = new User();
        user.setUsername(staffData.getEmail());
        user.setPassword(passwordEncoder.encode("Welcome@123")); // Temporary password
        user.setRole(staffData.getRole().getName());
        user = userRepository.save(user);
        
        staffData.setUser(user);
        
        // 3. Save Staff Record
        staffData = staffRepository.save(staffData);
        
        // 4. Trigger Welcome Email / Tasks
        log.info("Successfully onboarded {}. Generated User ID: {}", empCode, user.getId());
        
        return staffData;
    }
}
