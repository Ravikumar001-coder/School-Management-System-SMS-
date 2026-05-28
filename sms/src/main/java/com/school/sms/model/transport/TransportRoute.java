package com.school.sms.model.transport;

import com.school.sms.model.Branch;
import com.school.sms.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transport_routes", indexes = {
    @Index(name = "idx_transport_routes_branch", columnList = "branch_id"),
    @Index(name = "idx_transport_routes_status", columnList = "status"),
    @Index(name = "idx_transport_routes_code", columnList = "route_code", unique = true)
})
public class TransportRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_code", nullable = false, unique = true, length = 20)
    private String routeCode;

    @Column(name = "route_name", nullable = false, length = 100)
    private String routeName;

    @Enumerated(EnumType.STRING)
    @Column(name = "route_type", nullable = false)
    private RouteType routeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "start_location", length = 200)
    private String startLocation;

    @Column(name = "end_location", length = 200)
    private String endLocation;

    @Column(name = "estimated_distance_km")
    private Double estimatedDistanceKm;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "active_days", length = 20)
    private String activeDays; // e.g., "MON,TUE,WED,THU,FRI"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RouteStatus status = RouteStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RouteType {
        MORNING, AFTERNOON, BOTH
    }

    public enum RouteStatus {
        ACTIVE, INACTIVE, ARCHIVED
    }
}
