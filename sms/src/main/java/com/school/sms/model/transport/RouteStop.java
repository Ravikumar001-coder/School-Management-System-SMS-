package com.school.sms.model.transport;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "route_stops", indexes = {
    @Index(name = "idx_route_stops_route_id", columnList = "route_id"),
    @Index(name = "idx_route_stops_sequence", columnList = "route_id, stop_sequence")
})
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private TransportRoute route;

    @Column(name = "stop_name", nullable = false, length = 100)
    private String stopName;

    @Column(name = "stop_code", length = 20)
    private String stopCode;

    @Column(name = "stop_sequence", nullable = false)
    private Integer stopSequence;

    private Double latitude;
    private Double longitude;

    @Column(name = "pickup_time")
    private LocalTime pickupTime;

    @Column(name = "drop_time")
    private LocalTime dropTime;

    @Column(name = "stop_radius_meters")
    @Builder.Default
    private Integer stopRadiusMeters = 200;

    @Column(length = 200)
    private String landmark;

    @Column(name = "student_capacity")
    @Builder.Default
    private Integer studentCapacity = 50;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StopStatus status = StopStatus.ACTIVE;

    public enum StopStatus {
        ACTIVE, INACTIVE
    }
}
