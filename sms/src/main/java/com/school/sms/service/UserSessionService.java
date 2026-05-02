package com.school.sms.service;

import com.school.sms.model.User;
import com.school.sms.model.UserSession;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.UserSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSessionService {

    private final UserSessionRepository userSessionRepository;
    private final UserRepository userRepository;

    // =============================================
    // Session Creation (called at login)
    // =============================================

    /**
     * Creates a new session record tied to the hashed refresh token.
     *
     * @param user             the authenticated user
     * @param rawRefreshToken  the raw token (will be hashed before storage)
     * @param request          the HTTP request for IP + User-Agent extraction
     * @return the created session (sessionId is the public opaque identifier)
     */
    @Transactional
    public UserSession createSession(User user, String rawRefreshToken, HttpServletRequest request) {
        String tokenHash = RefreshTokenService.sha256(rawRefreshToken);
        String userAgent = request.getHeader("User-Agent");

        UserSession session = UserSession.builder()
                .user(user)
                .refreshTokenHash(tokenHash)
                .ipAddress(extractClientIp(request))
                .userAgent(userAgent)
                .browser(parseBrowser(userAgent))
                .deviceType(parseDeviceType(userAgent))
                .deviceName(parseDeviceName(userAgent))
                .createdAt(Instant.now())
                .lastActiveAt(Instant.now())
                .active(true)
                .build();

        return userSessionRepository.save(session);
    }

    // =============================================
    // Session Update (called on token rotation)
    // =============================================

    /**
     * Updates an existing session after a token rotation.
     * The old hash is replaced with the new hash; lastActiveAt is refreshed.
     */
    @Transactional
    public void updateSessionAfterRotation(String oldTokenHash, String newTokenHash) {
        userSessionRepository.findByRefreshTokenHash(oldTokenHash).ifPresent(session -> {
            session.setRefreshTokenHash(newTokenHash);
            session.setLastActiveAt(Instant.now());
            userSessionRepository.save(session);
        });
    }

    // =============================================
    // Session Revocation
    // =============================================

    /**
     * Revokes the session associated with a raw refresh token.
     * Called on explicit per-device logout.
     */
    @Transactional
    public void revokeSession(String rawRefreshToken) {
        String hash = RefreshTokenService.sha256(rawRefreshToken);
        userSessionRepository.findByRefreshTokenHash(hash).ifPresent(session -> {
            session.setActive(false);
            session.setRevokedAt(Instant.now());
            userSessionRepository.save(session);
        });
    }

    /**
     * Revokes a specific session by its public sessionId.
     * Used by the Session Management API (DELETE /api/sessions/{id}).
     */
    @Transactional
    public void revokeSessionById(String username, String sessionId) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        userSessionRepository.findBySessionIdAndUser(sessionId, user).ifPresent(session -> {
            session.setActive(false);
            session.setRevokedAt(Instant.now());
            userSessionRepository.save(session);
        });
    }

    /**
     * Revokes all sessions EXCEPT the current one.
     * Used by "Logout all other devices".
     */
    @Transactional
    public int revokeAllOtherSessions(String username, String currentRawRefreshToken) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String currentHash = RefreshTokenService.sha256(currentRawRefreshToken);
        UserSession currentSession = userSessionRepository.findByRefreshTokenHash(currentHash).orElse(null);
        String currentSessionId = currentSession != null ? currentSession.getSessionId() : "__none__";

        return userSessionRepository.revokeAllExcept(user, currentSessionId, Instant.now());
    }

    /**
     * Revokes ALL sessions for a user.
     * Called on password change or admin-forced logout.
     */
    @Transactional
    public int revokeAllSessions(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userSessionRepository.revokeAll(user, Instant.now());
    }

    // =============================================
    // Session Queries (for Session Management API)
    // =============================================

    public List<UserSession> getActiveSessions(User user) {
        return userSessionRepository.findByUserAndActiveOrderByLastActiveAtDesc(user, true);
    }

    // =============================================
    // Private parsers
    // =============================================

    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String parseDeviceType(String userAgent) {
        if (userAgent == null) return "Unknown";
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) return "Mobile";
        if (ua.contains("tablet") || ua.contains("ipad")) return "Tablet";
        return "Desktop";
    }

    private String parseDeviceName(String userAgent) {
        if (userAgent == null) return "Unknown Device";
        // Extract OS from UA string for a human-friendly name
        if (userAgent.contains("Windows NT 10")) return "Windows 10/11";
        if (userAgent.contains("Windows NT 6")) return "Windows 7/8";
        if (userAgent.contains("Mac OS X")) return "macOS";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iPhone")) return "iPhone";
        if (userAgent.contains("iPad")) return "iPad";
        if (userAgent.contains("Linux")) return "Linux";
        return "Unknown Device";
    }

    private String parseBrowser(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Edg/")) return "Edge";
        if (userAgent.contains("OPR/") || userAgent.contains("Opera")) return "Opera";
        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Safari")) return "Safari";
        if (userAgent.contains("Firefox")) return "Firefox";
        return "Unknown";
    }
}
