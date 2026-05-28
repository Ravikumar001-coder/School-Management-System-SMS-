package com.school.sms.model.transport;

import com.school.sms.model.AcademicYear;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transport_fee_slabs", indexes = {
    @Index(name = "idx_tfs_route_id", columnList = "route_id"),
    @Index(name = "idx_tfs_stop_id", columnList = "stop_id"),
    @Index(name = "idx_tfs_academic_year", columnList = "academic_year_id")
})
public class TransportFeeSlab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private TransportRoute route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id")
    private RouteStop stop;

    @Column(name = "distance_from_school")
    private Double distanceFromSchool; // km

    @Column(name = "one_way_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal oneWayFee;

    @Column(name = "two_way_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal twoWayFee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SlabStatus status = SlabStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum SlabStatus {
        ACTIVE, INACTIVE
    }
}
