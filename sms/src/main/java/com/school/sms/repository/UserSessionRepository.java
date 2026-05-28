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
    
    Optional<UserSession> findByRefreshTokenHash(String hash);
    
    Optional<UserSession> findBySessionIdAndUser(String sessionId, User user);
    
    List<UserSession> findByUserAndActiveOrderByLastActiveAtDesc(User user, boolean active);
    
    List<UserSession> findByActiveTrue();

    @Modifying
    @Query("UPDATE UserSession s SET s.active = false, s.revokedAt = :revokedAt WHERE s.user = :user AND s.active = true")
    int revokeAll(User user, Instant revokedAt);

    @Modifying
    @Query("UPDATE UserSession s SET s.active = false, s.revokedAt = :revokedAt WHERE s.user = :user AND s.sessionId <> :currentSessionId AND s.active = true")
    int revokeAllExcept(User user, String currentSessionId, Instant revokedAt);
}
