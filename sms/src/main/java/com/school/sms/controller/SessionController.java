package com.school.sms.controller;

import com.school.sms.model.User;
import com.school.sms.model.UserSession;
import com.school.sms.repository.UserRepository;
import com.school.sms.service.RefreshTokenService;
import com.school.sms.service.UserSessionService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class SessionController {

    private final UserSessionService userSessionService;
    private final UserRepository userRepository;

    // =============================================
    // GET /api/v1/sessions
    // Returns all active sessions for the authenticated user
    // =============================================
    @GetMapping
    public ResponseEntity<List<SessionResponse>> getSessions(
            Authentication authentication,
            HttpServletRequest request) {

        User user = resolveUser(authentication);
        String currentHash = extractCurrentTokenHash(request);

        List<SessionResponse> sessions = userSessionService.getActiveSessions(user)
                .stream()
                .map(s -> toResponse(s, currentHash))
                .toList();

        return ResponseEntity.ok(sessions);
    }

    // =============================================
    // DELETE /api/v1/sessions/{sessionId}
    // Revoke a specific session by its public sessionId
    // =============================================
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> revokeSession(
            Authentication authentication,
            @PathVariable String sessionId) {

        userSessionService.revokeSessionById(authentication.getName(), sessionId);
        return ResponseEntity.ok(Map.of("message", "Session revoked successfully."));
    }

    // =============================================
    // DELETE /api/v1/sessions/others
    // Revoke all sessions except the current one ("Logout all other devices")
    // =============================================
    @DeleteMapping("/others")
    public ResponseEntity<?> revokeOtherSessions(
            Authentication authentication,
            HttpServletRequest request) {

        String rawToken = extractRefreshCookie(request);
        if (rawToken == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cannot identify current session without refresh cookie."));
        }

        int revoked = userSessionService.revokeAllOtherSessions(authentication.getName(), rawToken);
        return ResponseEntity.ok(Map.of(
                "message", "All other sessions revoked.",
                "revokedCount", revoked
        ));
    }

    // =============================================
    // Private helpers
    // =============================================

    private User resolveUser(Authentication authentication) {
        return userRepository.findByUsernameOrEmail(
                        authentication.getName(), authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String extractCurrentTokenHash(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> AuthController.REFRESH_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .map(RefreshTokenService::sha256)
                .findFirst()
                .orElse(null);
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> AuthController.REFRESH_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private SessionResponse toResponse(UserSession s, String currentHash) {
        boolean isCurrent = currentHash != null && currentHash.equals(s.getRefreshTokenHash());
        return new SessionResponse(
                s.getSessionId(),
                s.getDeviceName(),
                s.getDeviceType(),
                s.getBrowser(),
                s.getIpAddress(),
                "Unknown",
                s.getLastActiveAt(),
                s.getCreatedAt(),
                isCurrent
        );
    }

    // =============================================
    // Response record
    // =============================================

    public record SessionResponse(
            String sessionId,
            String deviceName,
            String deviceType,
            String browser,
            String ip,
            String location,
            Instant lastActive,
            Instant createdAt,
            boolean currentSession
    ) {}
}
