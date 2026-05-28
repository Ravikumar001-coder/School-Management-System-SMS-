package com.school.sms.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TeacherRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String bloodGroup;
    private String profilePhoto;

    // Professional
    private String designation;
    private String qualification;
    private String specialization;
    private Double salary;
    private LocalDate joiningDate;
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT, VISITING
    private String workShift;
    private Integer experienceYears;
    private Long departmentId;

    // Payroll & Banking
    private String bankAccountNo;
    private String ifscCode;
    
    @NotBlank(message = "PAN Card is required for payroll")
    private String panCard;
    
    @NotBlank(message = "Aadhar Card is required for verification")
    private String aadharCard;
    
    private String pfNumber;
    private String esiNumber;
    private String paymentMode; // BANK_TRANSFER, CASH, CHEQUE

    // Lifecycle
    private LocalDate probationEndDate;
    private LocalDate contractEndDate;
    private String biometricId;
    private Long reportingManagerId;
    private String status;

    // Assignments
    private List<Long> subjectIds;
    private List<Long> assignedClassIds;

    private String emergencyContact;
}