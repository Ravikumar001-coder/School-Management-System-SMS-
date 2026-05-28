package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentResponse {
    private Long id;
    private String studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String address;
    
    // Academic Info
    private String academicYear;
    private Long classRoomId;
    private String className;
    private String sectionName;
    private String rollNumber;
    private String section;
    
    // Enterprise Info
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
    
    private String status;
    private String profilePhoto;
    
    // Parent Info (Aggregated for simple views)
    private Long parentId;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    private String parentRelationship;
    private String guardianRelationship;

    // Audit and System Info
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private Long branchId;
    private String branchName;
    private Long userId;
}