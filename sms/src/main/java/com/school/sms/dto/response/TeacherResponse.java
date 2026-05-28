package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TeacherResponse {
    private Long id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String qualification;
    private String specialization;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;
    private String gender;
    private String address;
    private String profilePhoto;
    private String status;
    private Double salary;
    
    // Professional
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String employmentType;
    private String workShift;
    private Integer experienceYears;
    private Integer leaveBalance;
    
    // Banking & Compliance
    private String bankAccountNo;
    private String ifscCode;
    private String panCard;
    private String aadharCard;
    private String pfNumber;
    private String esiNumber;
    private String paymentMode;
    private String payrollStatus;
    
    // Security & Lifecycle
    private String biometricId;
    private String backgroundCheckStatus;
    private String documentVerificationStatus;
    private LocalDate probationEndDate;
    private LocalDate contractEndDate;
    private String emergencyContact;
    private String bloodGroup;

    private List<Long> subjectIds;
    private List<Long> assignedClassIds;
}