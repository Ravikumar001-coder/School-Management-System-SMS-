package com.school.sms.model.transport;

import com.school.sms.model.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_transport_assignments", indexes = {
    @Index(name = "idx_sta_student_id", columnList = "student_id"),
    @Index(name = "idx_sta_route_id", columnList = "route_id"),
    @Index(name = "idx_sta_status", columnList = "status")
})
public class StudentTransportAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private TransportRoute route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_stop_id")
    private RouteStop pickupStop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drop_stop_id")
    private RouteStop dropStop;

    @Column(name = "pickup_shift", length = 20)
    private String pickupShift; // MORNING, AFTERNOON

    @Column(name = "drop_shift", length = 20)
    private String dropShift;

    @Column(name = "transport_fee_plan_id")
    private Long transportFeePlanId;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (assignedDate == null) assignedDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AssignmentStatus {
        ACTIVE, INACTIVE, TRANSFERRED, CANCELLED
    }
}
