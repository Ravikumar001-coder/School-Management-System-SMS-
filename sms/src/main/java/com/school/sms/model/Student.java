// src/main/java/com/school/sms/model/Student.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_students_classroom_id", columnList = "classroom_id"),
    @Index(name = "idx_students_user_id", columnList = "user_id"),
    @Index(name = "idx_students_branch_year", columnList = "branch_id, academic_year_id")
})
@EqualsAndHashCode(callSuper = true)
public class Student extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each student has a user account (for login)
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    // Student specific info
    private String studentId;    // Like "STU-2024-001"

    // Legacy column kept for backward compatibility with existing DB schema.
    @Column(name = "name")
    private String name;
    
    private String firstName;
    private String lastName;
    
    @Column(unique = true)
    private String email;
    
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    private String guardianRelationship;
    private String bloodGroup;
    private String profilePhoto; // File path/URL

    // Which class this student belongs to
    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;


    private String admissionDate;
    private String admissionClass;
    
    @Column(columnDefinition = "TEXT")
    private String courses; // JSON or comma-separated
    
    @Enumerated(EnumType.STRING)
    private StudentStatus status; // ACTIVE, INACTIVE, GRADUATED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    /** Branch FK — defaults to branch 1 (MAIN). Enables multi-tenancy in Phase 4. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        name = buildFullName(firstName, lastName);
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        name = buildFullName(firstName, lastName);
        updatedAt = LocalDateTime.now();
    }

    private String buildFullName(String firstName, String lastName) {
        String first = firstName == null ? "" : firstName.trim();
        String last = lastName == null ? "" : lastName.trim();
        String fullName = (first + " " + last).trim();
        return fullName.isEmpty() ? "UNKNOWN" : fullName;
    }
}