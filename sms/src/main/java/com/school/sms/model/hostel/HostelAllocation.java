package com.school.sms.model.hostel;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Student;
import com.school.sms.model.User;
import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hostel_allocations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "academic_year_id", "status"})
}, indexes = {
    @Index(name = "idx_hostel_alloc_student", columnList = "student_id"),
    @Index(name = "idx_hostel_alloc_bed", columnList = "bed_id"),
    @Index(name = "idx_hostel_alloc_status", columnList = "status")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HostelAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bed_id", nullable = false)
    private HostelBed bed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(name = "allocation_date", nullable = false)
    private LocalDate allocationDate;

    @Column(name = "vacated_date")
    private LocalDate vacatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocated_by")
    private User allocatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AllocationStatus status = AllocationStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "expected_checkout_date")
    private LocalDate expectedCheckoutDate;

    @Column(name = "allocation_type", length = 50)
    @Builder.Default
    private String allocationType = "REGULAR"; // REGULAR, TEMPORARY, EMERGENCY

    @Column(name = "locker_assigned")
    @Builder.Default
    private Boolean lockerAssigned = false;

    @Column(name = "rfid_card_assigned")
    @Builder.Default
    private Boolean rfidCardAssigned = false;

    @Column(name = "transport_linked")
    @Builder.Default
    private Boolean transportLinked = false;

    @Column(name = "mess_plan_id")
    private Long messPlanId;

    @Column(name = "admin_approval")
    @Builder.Default
    private Boolean adminApproval = false;

    @Column(name = "parent_consent")
    @Builder.Default
    private Boolean parentConsent = false;

    @Column(name = "guardian_approval")
    @Builder.Default
    private Boolean guardianApproval = false;

    @Column(name = "medical_notes", columnDefinition = "TEXT")
    private String medicalNotes;

    @Column(name = "special_needs", columnDefinition = "TEXT")
    private String specialNeeds;

    @Column(name = "disciplinary_status", length = 100)
    private String disciplinaryStatus;

    @Column(name = "emergency_contact", length = 50)
    private String emergencyContact;

    @Column(name = "transfer_reason", columnDefinition = "TEXT")
    private String transferReason;

    @Column(name = "previous_room", length = 50)
    private String previousRoom;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AllocationStatus {
        ACTIVE, VACATED, TRANSFERRED
    }
}
