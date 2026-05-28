package com.school.sms.model.transport;

import com.school.sms.model.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transport_notifications", indexes = {
    @Index(name = "idx_tn_student_id", columnList = "student_id"),
    @Index(name = "idx_tn_route_id", columnList = "route_id"),
    @Index(name = "idx_tn_vehicle_id", columnList = "vehicle_id"),
    @Index(name = "idx_tn_type", columnList = "notification_type"),
    @Index(name = "idx_tn_sent_at", columnList = "sent_at")
})
public class TransportNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private TransportRoute route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "sent_via", length = 30)
    private String sentVia; // WHATSAPP, SMS, PUSH, IN_APP

    @Column(name = "delivery_status", length = 20)
    @Builder.Default
    private String deliveryStatus = "PENDING"; // PENDING, SENT, DELIVERED, FAILED

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "parent_acknowledged")
    @Builder.Default
    private Boolean parentAcknowledged = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (sentAt == null) sentAt = LocalDateTime.now();
    }

    public enum NotificationType {
        BOARDED,
        DROPPED,
        DELAYED,
        MISSED_BUS,
        ROUTE_CHANGED,
        EMERGENCY,
        BUS_APPROACHING,
        BUS_ARRIVED
    }
}
