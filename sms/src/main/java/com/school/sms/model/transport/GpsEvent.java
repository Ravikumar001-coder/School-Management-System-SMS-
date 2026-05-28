package com.school.sms.model.transport;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gps_events", indexes = {
    @Index(name = "idx_gps_events_vehicle", columnList = "vehicle_id"),
    @Index(name = "idx_gps_events_type", columnList = "event_type"),
    @Index(name = "idx_gps_events_time", columnList = "event_time"),
    @Index(name = "idx_gps_events_severity", columnList = "severity")
})
public class GpsEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private GpsEventType eventType;

    private Double latitude;
    private Double longitude;

    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @Column(length = 10)
    @Builder.Default
    private String severity = "INFO"; // INFO, WARNING, CRITICAL

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "acknowledged")
    @Builder.Default
    private Boolean acknowledged = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (eventTime == null) eventTime = LocalDateTime.now();
    }

    public enum GpsEventType {
        ROUTE_DEVIATION,
        OVERSPEED,
        IDLE,
        ENGINE_OFF,
        SOS,
        GEOFENCE_EXIT,
        GEOFENCE_ENTRY,
        ROUTE_STARTED,
        ROUTE_COMPLETED,
        BREAKDOWN
    }
}
