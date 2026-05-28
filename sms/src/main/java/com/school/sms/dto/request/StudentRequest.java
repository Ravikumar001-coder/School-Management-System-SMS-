package com.school.sms.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String address;
    private String bloodGroup;
    private String profilePhoto;
    
    // Academic Assignment
    @NotNull(message = "Class is required")
    private Long classRoomId;
    
    private Long departmentId;
    private String section;
    private String rollNumber;
    
    // Enterprise SIS Fields
    private String aadharCard;
    private String nationality;
    private String religion;
    private String category;
    private String emergencyContact;
    private String medicalConditions;
    private String previousSchool;
    private String admissionSource;
    private LocalDate admissionDate;
    private String admissionClass;
    private String courses;
    private Boolean isNewAdmission;
    private LocalDate graduationDate;
    private Long promotedFromClassroomId;
    private String previousStudentId;
    private String transferCertificateNo;
    
    // Parent Integration
    @NotNull(message = "Parent details are required")
    private ParentRequest parent;

    private String guardianRelationship; // FATHER, MOTHER, GUARDIAN
    private Boolean isPrimaryGuardian;
}