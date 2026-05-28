package com.school.sms.model.transport;

import com.school.sms.model.Branch;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicles_branch", columnList = "branch_id"),
    @Index(name = "idx_vehicles_status", columnList = "current_status"),
    @Index(name = "idx_vehicles_number", columnList = "vehicle_number", unique = true)
})
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_number", nullable = false, unique = true, length = 20)
    private String vehicleNumber;

    @Column(name = "registration_number", unique = true, length = 30)
    private String registrationNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Column(length = 50)
    private String brand;

    @Column(length = 50)
    private String model;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "seating_capacity")
    private Integer seatingCapacity;

    @Column(name = "standing_capacity")
    @Builder.Default
    private Integer standingCapacity = 0;

    @Column(name = "fuel_type", length = 20)
    private String fuelType; // DIESEL, PETROL, CNG, ELECTRIC

    @Column(name = "chassis_number", length = 50)
    private String chassisNumber;

    @Column(name = "engine_number", length = 50)
    private String engineNumber;

    @Column(name = "gps_device_id", length = 50)
    private String gpsDeviceId;

    @Column(name = "insurance_number", length = 50)
    private String insuranceNumber;

    @Column(name = "insurance_expiry_date")
    private LocalDate insuranceExpiryDate;

    @Column(name = "fitness_certificate_number", length = 50)
    private String fitnessCertificateNumber;

    @Column(name = "fitness_expiry_date")
    private LocalDate fitnessExpiryDate;

    @Column(name = "pollution_certificate_expiry")
    private LocalDate pollutionCertificateExpiry;

    @Column(name = "permit_expiry_date")
    private LocalDate permitExpiryDate;

    @Column(name = "rc_document_url", length = 500)
    private String rcDocumentUrl;

    @Column(name = "insurance_document_url", length = 500)
    private String insuranceDocumentUrl;

    @Column(name = "vehicle_photo", length = 500)
    private String vehiclePhoto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    @Builder.Default
    private VehicleStatus currentStatus = VehicleStatus.ACTIVE;

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
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum VehicleType {
        BUS, VAN, MINI_BUS, EV_BUS
    }

    public enum VehicleStatus {
        ACTIVE, MAINTENANCE, INACTIVE, SCRAPPED
    }
}
