package com.school.sms.model.hrms;

import com.school.sms.model.Branch;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "biometric_devices")
public class BiometricDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_name", nullable = false, length = 100)
    private String deviceName;

    @Column(name = "device_type", nullable = false, length = 50)
    private String deviceType;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "api_key")
    private String apiKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "sync_frequency", length = 50)
    private String syncFrequency = "HOURLY";

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "status")
    private Boolean status = true;
}
