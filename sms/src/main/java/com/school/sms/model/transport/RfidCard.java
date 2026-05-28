package com.school.sms.model.transport;

import com.school.sms.model.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rfid_cards", indexes = {
    @Index(name = "idx_rfid_card_uid", columnList = "card_uid", unique = true),
    @Index(name = "idx_rfid_student_id", columnList = "student_id"),
    @Index(name = "idx_rfid_status", columnList = "status")
})
public class RfidCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "card_uid", nullable = false, unique = true, length = 50)
    private String cardUid;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", unique = true)
    private Student student;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CardStatus status = CardStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (issueDate == null) issueDate = LocalDate.now();
    }

    public enum CardStatus {
        ACTIVE, INACTIVE, EXPIRED, LOST, REPLACED
    }
}
