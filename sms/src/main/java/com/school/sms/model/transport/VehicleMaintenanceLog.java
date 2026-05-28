package com.school.sms.model.transport;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicle_maintenance_logs", indexes = {
    @Index(name = "idx_vml_vehicle_id", columnList = "vehicle_id"),
    @Index(name = "idx_vml_service_date", columnList = "service_date")
})
public class VehicleMaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "maintenance_type", nullable = false, length = 50)
    private String maintenanceType; // ROUTINE, REPAIR, BREAKDOWN, INSPECTION

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    @Column(name = "next_service_date")
    private LocalDate nextServiceDate;

    @Column(name = "vendor_name", length = 100)
    private String vendorName;

    @Column(precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "invoice_url", length = 500)
    private String invoiceUrl;

    @Column(name = "odometer_reading")
    private Long odometerReading;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
