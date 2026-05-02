package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * SHA-256 hash of the raw token.
     * We NEVER store the raw token in the database.
     * The raw token is returned once (in an HttpOnly cookie) and then hashed for all DB lookups.
     */
    @Column(nullable = false, unique = true)
    private String tokenHash;

    /**
     * UUID linking a chain of rotated tokens.
     * If a token from a previous rotation is presented, we detect replay:
     * revoke ALL tokens in this family and invalidate all associated sessions.
     */
    @Column(nullable = false)
    private String tokenFamily;

    @Column(nullable = false)
    private Instant expiryDate;

    /** Timestamp set when this token is revoked (replay detection, forced logout). */
    private Instant revokedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
