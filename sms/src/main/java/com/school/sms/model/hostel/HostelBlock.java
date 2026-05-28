package com.school.sms.model.hostel;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Branch;
import com.school.sms.model.User;
import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hostel_blocks", indexes = {
    @Index(name = "idx_hostel_blocks_branch", columnList = "branch_id")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HostelBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "block_name", nullable = false, length = 100)
    private String blockName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender_type", nullable = false)
    private GenderType genderType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warden_id")
    private User warden;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BlockStatus status = BlockStatus.ACTIVE;

    @Column(name = "block_code", unique = true, length = 50)
    private String blockCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "building_type")
    private BuildingType buildingType;

    private Integer capacity;
    
    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "rfid_enabled")
    @Builder.Default
    private Boolean rfidEnabled = false;

    @Column(name = "biometric_enabled")
    @Builder.Default
    private Boolean biometricEnabled = false;

    @Column(name = "mess_attached")
    @Builder.Default
    private Boolean messAttached = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

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

    public enum GenderType {
        BOYS, GIRLS, MIXED
    }

    public enum BlockStatus {
        ACTIVE, INACTIVE, MAINTENANCE
    }

    public enum BuildingType {
        OWNED, LEASED, TEMPORARY
    }
}
