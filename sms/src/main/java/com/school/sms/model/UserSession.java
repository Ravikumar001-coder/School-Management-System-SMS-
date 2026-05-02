package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Opaque public identifier exposed in the Session Management API.
     * Clients use this UUID to revoke a specific session without exposing the internal DB id.
     */
    @Column(nullable = false, unique = true, updatable = false)
    @Builder.Default
    private String sessionId = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** SHA-256 hash of the refresh token — mirrors RefreshToken.tokenHash for fast join-free lookups. */
    @Column(nullable = false)
    private String refreshTokenHash;

    private String deviceType;      // Desktop / Mobile / Tablet
    private String deviceName;      // Parsed from User-Agent
    private String browser;         // Chrome, Safari, Firefox …
    private String userAgent;       // Full raw User-Agent string
    private String ipAddress;
    private String location;        // Optional; populated async

    /** Stable fingerprint: hash(userAgent + acceptLanguage + screenResolution). */
    private String deviceFingerprint;

    private Instant createdAt;
    private Instant lastActiveAt;
    private Instant revokedAt;

    @Builder.Default
    private boolean active = true;
}
