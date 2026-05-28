package com.school.sms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "teachers", indexes = {
    @Index(name = "idx_teacher_branch", columnList = "branch_id"),
    @Index(name = "idx_teacher_dept", columnList = "department_id"),
    @Index(name = "idx_teacher_status", columnList = "status"),
    @Index(name = "idx_teacher_payroll", columnList = "payroll_status")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EqualsAndHashCode(callSuper = true)
public class Teacher extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(unique = true, nullable = false)
    private String employeeId;

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
    private String emergencyContact;

    // Professional Assignment
    private String designation;
    private String qualification;
    private String specialization;
    private Double salary;
    private LocalDate joiningDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    // Enterprise HRMS Fields
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType; // FULL_TIME, PART_TIME, CONTRACT, VISITING
    
    private String workShift;
    private Integer experienceYears;
    private Integer leaveBalance;
    private String maritalStatus;
    private String nationality;
    
    // Payroll & Banking
    private String bankAccountNo;
    private String ifscCode;
    
    @Column(unique = true)
    private String panCard;
    
    @Column(unique = true)
    private String aadharCard;
    
    private String pfNumber;
    private String esiNumber;
    
    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode; // BANK_TRANSFER, CASH, CHEQUE
    
    @Enumerated(EnumType.STRING)
    private PayrollStatus payrollStatus; // PENDING, ACTIVE, ON_HOLD

    // Lifecycle & Security
    private LocalDate probationEndDate;
    private LocalDate contractEndDate;
    private LocalDate resignationDate;
    private String exitReason;
    
    @Column(unique = true)
    private String biometricId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporting_manager_id")
    private Teacher reportingManager;

    @Enumerated(EnumType.STRING)
    private VerificationStatus backgroundCheckStatus;
    
    @Enumerated(EnumType.STRING)
    private VerificationStatus documentVerificationStatus;

    @Enumerated(EnumType.STRING)
    private TeacherStatus status; // ACTIVE, INACTIVE, ON_LEAVE, RESIGNED

    @ManyToMany
    @JoinTable(
        name = "teacher_subjects",
        joinColumns = @JoinColumn(name = "teacher_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Subject> subjects;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (employmentType == null) employmentType = EmploymentType.FULL_TIME;
        if (payrollStatus == null) payrollStatus = PayrollStatus.ACTIVE;
        if (backgroundCheckStatus == null) backgroundCheckStatus = VerificationStatus.PENDING;
        if (documentVerificationStatus == null) documentVerificationStatus = VerificationStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Builder Bridges
    public static class TeacherBuilder {
        public TeacherBuilder emergencyContact(String contact) {
            this.emergencyContact = contact;
            return this;
        }
    }
}