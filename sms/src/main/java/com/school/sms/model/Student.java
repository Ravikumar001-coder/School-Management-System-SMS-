package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_students_classroom_id", columnList = "classroom_id"),
    @Index(name = "idx_students_user_id", columnList = "user_id"),
    @Index(name = "idx_students_branch_year", columnList = "branch_id, academic_year_id"),
    @Index(name = "idx_students_status", columnList = "status")
})
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(unique = true, nullable = false)
    private String studentId; // e.g., "STU-2024-001"

    private String firstName;
    private String lastName;
    
    @Column(unique = true)
    private String email;
    
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String bloodGroup;
    private String profilePhoto;
    
    @Column(columnDefinition = "TEXT")
    private String courses;

    private String parentEmail;
    private String parentName;
    private String parentPhone;
    private String guardianRelationship;
    
    // Enterprise Academic Fields
    private String rollNumber;
    private String section;
    private String religion;
    private String nationality;
    private String category;
    private String emergencyContact;
    private String aadharCard;
    
    @Column(columnDefinition = "TEXT")
    private String medicalConditions;
    
    private String previousSchool;
    private String admissionSource;
    private Boolean isNewAdmission;
    private LocalDate admissionDate;
    private String admissionClass;
    
    // Academic Assignment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id")
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    // Lifecycle Tracking
    @Enumerated(EnumType.STRING)
    private StudentStatus status; // ACTIVE, INACTIVE, GRADUATED, SUSPENDED

    private LocalDate graduationDate;
    private Long promotedFromClassroomId;
    private String previousStudentId;
    private String transferCertificateNo;

    // Relationships
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ParentStudentLink> parentLinks;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isNewAdmission == null) isNewAdmission = true;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Legacy Bridge for TeacherOS / Reporting
    public String getParentEmail() {
        if (this.parentEmail != null) {
            return this.parentEmail;
        }
        if (parentLinks != null && !parentLinks.isEmpty()) {
            return parentLinks.get(0).getParent().getEmail();
        }
        return null;
    }

    public String getParentName() {
        if (this.parentName != null) {
            return this.parentName;
        }
        if (parentLinks != null && !parentLinks.isEmpty()) {
            Parent p = parentLinks.get(0).getParent();
            return p.getFirstName() + " " + p.getLastName();
        }
        return null;
    }

    public String getParentPhone() {
        if (this.parentPhone != null) {
            return this.parentPhone;
        }
        if (parentLinks != null && !parentLinks.isEmpty()) {
            return parentLinks.get(0).getParent().getPhone();
        }
        return null;
    }

    public String getGuardianRelationship() {
        if (this.guardianRelationship != null) {
            return this.guardianRelationship;
        }
        if (parentLinks != null && !parentLinks.isEmpty()) {
            return parentLinks.get(0).getRelationship();
        }
        return null;
    }
}