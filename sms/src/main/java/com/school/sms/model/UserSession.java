package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_sessions",
    indexes = {
        @Index(name = "idx_sessions_user", columnList = "user_id"),
        @Index(name = "idx_sessions_token_hash", columnList = "refresh_token_hash"),
        @Index(name = "idx_sessions_session_id", columnList = "session_id")
    }
)
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "session_id", unique = true)
    private String sessionId; // Public opaque identifier

    @Column(name = "refresh_token_hash", unique = true)
    private String refreshTokenHash;

    private String ipAddress;
    private String userAgent;
    private String browser;
    private String deviceType;
    private String deviceName;

    private Instant createdAt;
    private Instant lastActiveAt;
    private Instant revokedAt;

    @Builder.Default
    private boolean active = true;

    @PrePersist
    public void prePersist() {
        if (sessionId == null) {
            sessionId = java.util.UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (lastActiveAt == null) {
            lastActiveAt = Instant.now();
        }
    }
}
