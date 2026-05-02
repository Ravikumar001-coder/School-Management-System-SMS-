package com.school.sms.repository;

import com.school.sms.model.RefreshToken;
import com.school.sms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /** Find an active (non-revoked) token by its SHA-256 hash. */
    Optional<RefreshToken> findByTokenHashAndRevokedAtIsNull(String tokenHash);

    /** Find any token (including revoked) by hash — used for replay detection. */
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /** Revoke all tokens in a token family (replay detected). */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = CURRENT_TIMESTAMP WHERE rt.tokenFamily = :family")
    int revokeAllByFamily(String family);

    /** Delete all tokens belonging to a user (on explicit full logout). */
    @Modifying
    int deleteByUser(User user);

    /** Count active tokens in a family (should be 0 or 1 after rotation). */
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.tokenFamily = :family AND rt.revokedAt IS NULL")
    long countActiveByFamily(String family);
}
