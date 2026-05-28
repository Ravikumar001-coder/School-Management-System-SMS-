package com.school.sms.dto.request.hrms;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class StaffOnboardingRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactPhone;
    
    @NotBlank(message = "Aadhaar number is required")
    private String aadhaarNumber;
    
    @NotBlank(message = "PAN number is required")
    private String panNumber;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Role ID is required")
    private Long roleId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;
    
    private Long designationId;
    private Long workShiftId;
    private Long reportingManagerId;

    @NotBlank(message = "Employment type is required")
    private String employmentType;
}
