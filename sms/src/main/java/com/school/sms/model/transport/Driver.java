package com.school.sms.model.transport;

import com.school.sms.model.Branch;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "drivers", indexes = {
    @Index(name = "idx_drivers_branch", columnList = "branch_id"),
    @Index(name = "idx_drivers_status", columnList = "status"),
    @Index(name = "idx_drivers_license", columnList = "license_number", unique = true)
})
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", unique = true, length = 30)
    private String employeeId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(name = "alternate_phone", length = 15)
    private String alternatePhone;

    @Column(length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(name = "emergency_contact", length = 15)
    private String emergencyContact;

    @Column(name = "license_number", nullable = false, unique = true, length = 30)
    private String licenseNumber;

    @Column(name = "license_type", length = 20)
    private String licenseType; // LMV, HMV, HMPV

    @Column(name = "license_issue_date")
    private LocalDate licenseIssueDate;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "police_verification_status", length = 20)
    @Builder.Default
    private String policeVerificationStatus = "PENDING"; // PENDING, VERIFIED, FAILED

    @Column(name = "medical_certificate_expiry")
    private LocalDate medicalCertificateExpiry;

    @Column(name = "profile_photo", length = 500)
    private String profilePhoto;

    @Column(name = "aadhaar_number", length = 20)
    private String aadhaarNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DriverStatus status = DriverStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DriverStatus {
        ACTIVE, INACTIVE, SUSPENDED, BLACKLISTED
    }
}
