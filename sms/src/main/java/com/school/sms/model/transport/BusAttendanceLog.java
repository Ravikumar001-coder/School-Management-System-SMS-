package com.school.sms.model.transport;

import com.school.sms.model.Student;
import com.school.sms.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bus_attendance_logs", indexes = {
    @Index(name = "idx_bal_student_id", columnList = "student_id"),
    @Index(name = "idx_bal_vehicle_id", columnList = "vehicle_id"),
    @Index(name = "idx_bal_route_id", columnList = "route_id"),
    @Index(name = "idx_bal_scanned_at", columnList = "scanned_at")
})
public class BusAttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private TransportRoute route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id")
    private RouteStop stop;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_type", nullable = false)
    private AttendanceType attendanceType;

    @Column(name = "scanned_at", nullable = false)
    private LocalDateTime scannedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "scan_method", nullable = false)
    private ScanMethod scanMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id")
    private User operator;

    @Column(name = "synced_to_main_attendance")
    @Builder.Default
    private Boolean syncedToMainAttendance = false;

    @Column(name = "latitude")
    private Double latitude;


    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (scannedAt == null) scannedAt = LocalDateTime.now();
    }

    public enum AttendanceType {
        BOARDED, ALIGHTED
    }

    public enum ScanMethod {
        RFID, NFC, QR, MANUAL
    }
}
