package com.school.sms.repository;

import com.school.sms.model.User;
import com.school.sms.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    List<UserSession> findByUserAndActiveOrderByLastActiveAtDesc(User user, boolean active);

    Optional<UserSession> findByRefreshTokenHash(String refreshTokenHash);

    Optional<UserSession> findBySessionIdAndUser(String sessionId, User user);

    /** Revoke all active sessions for a user EXCEPT the one with the given sessionId. */
    @Modifying
    @Query("UPDATE UserSession s SET s.active = false, s.revokedAt = :now " +
           "WHERE s.user = :user AND s.active = true AND s.sessionId <> :currentSessionId")
    int revokeAllExcept(User user, String currentSessionId, Instant now);

    /** Revoke all sessions for a user (full logout). */
    @Modifying
    @Query("UPDATE UserSession s SET s.active = false, s.revokedAt = :now " +
           "WHERE s.user = :user AND s.active = true")
    int revokeAll(User user, Instant now);
}
