package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "teacher_sync_queue")
public class TeacherSyncQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "payload_type", nullable = false)
    private String payloadType; // ATTENDANCE, HOMEWORK, DIARY

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    private String status; // PENDING, SYNCED, FAILED

    @Column(name = "retry_count")
    private Integer retryCount;

    @Column(name = "last_attempt_at")
    private LocalDateTime lastAttemptAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (retryCount == null) retryCount = 0;
        if (status == null) status = "PENDING";
    }
}
