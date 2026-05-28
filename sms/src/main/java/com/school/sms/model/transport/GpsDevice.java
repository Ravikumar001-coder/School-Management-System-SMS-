package com.school.sms.model.transport;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gps_devices", indexes = {
    @Index(name = "idx_gps_vehicle_id", columnList = "vehicle_id"),
    @Index(name = "idx_gps_imei", columnList = "imei_number", unique = true),
    @Index(name = "idx_gps_status", columnList = "device_status")
})
public class GpsDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_uid", nullable = false, unique = true, length = 50)
    private String deviceUid;

    @Column(name = "imei_number", nullable = false, unique = true, length = 20)
    private String imeiNumber;

    @Column(name = "provider_name", length = 30)
    private String providerName; // TELTONIKA, CONCOX, RUPTELA, ANDROID, GENERIC

    @Column(name = "api_key", length = 200)
    private String apiKey;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", unique = true)
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_status")
    @Builder.Default
    private DeviceStatus deviceStatus = DeviceStatus.ACTIVE;

    @Column(name = "last_ping_at")
    private LocalDateTime lastPingAt;

    @Column(name = "battery_status")
    private Integer batteryStatus; // 0-100

    @Column(name = "signal_strength")
    private Integer signalStrength; // 0-100

    @Column(name = "firmware_version", length = 20)
    private String firmwareVersion;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum DeviceStatus {
        ACTIVE, INACTIVE, OFFLINE, FAULTY
    }
}
