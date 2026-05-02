// src/main/java/com/school/sms/controller/AuthController.java

package com.school.sms.controller;

import com.school.sms.dto.request.ChangePasswordRequest;
import com.school.sms.dto.request.LoginRequest;
import com.school.sms.dto.response.AuthResponse;
import com.school.sms.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    static final String REFRESH_COOKIE_NAME = "refresh_token";

    private final AuthService authService;

    @Value("${app.security.cookie.secure:true}")
    private boolean secureCookie;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshTokenDurationMs;

    // =============================================
    // POST /api/v1/auth/login
    // =============================================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthService.LoginResult result = authService.login(request);

        // Write the refresh token into a Secure + HttpOnly + SameSite=Strict cookie
        // Path is restricted to /api/v1/auth/refresh — it won't be sent on other requests
        setRefreshCookie(response, result.rawRefreshToken(), (int) (refreshTokenDurationMs / 1000));

        return ResponseEntity.ok(result.response());
    }

    // =============================================
    // POST /api/v1/auth/refresh
    // CSRF strategy: SameSite=Strict cookie + custom header double-submit check
    // =============================================
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        String rawRefreshToken = extractRefreshCookie(request);
        if (rawRefreshToken == null) {
            return ResponseEntity.status(401)
                    .body(AuthResponse.builder().message("No refresh token cookie found.").build());
        }

        try {
            AuthService.RefreshResult result = authService.refreshToken(rawRefreshToken);

            // Rotate: overwrite the cookie with the new token
            setRefreshCookie(response, result.newRawRefreshToken(), (int) (refreshTokenDurationMs / 1000));

            return ResponseEntity.ok(result.response());
        } catch (Exception e) {
            // On any failure (expired, replayed, invalid), clear the cookie
            clearRefreshCookie(response);
            return ResponseEntity.status(401)
                    .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    // =============================================
    // POST /api/v1/auth/logout
    // =============================================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        String rawRefreshToken = extractRefreshCookie(request);
        authService.logout(rawRefreshToken);
        clearRefreshCookie(response);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // =============================================
    // GET /api/v1/auth/me
    // =============================================
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUserProfile(authentication.getName()));
    }

    // =============================================
    // POST /api/v1/auth/change-password
    // =============================================
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletResponse response) {

        authService.changePassword(authentication.getName(), request);

        // Invalidate the refresh cookie: password changed, all sessions revoked
        clearRefreshCookie(response);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully. Please login again."));
    }

    // =============================================
    // POST /api/v1/auth/reset-password/{userId}
    // =============================================
    @PostMapping("/reset-password/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resetPassword(
            Authentication authentication,
            @PathVariable Long userId) {

        if (authentication == null || !authService.isAdmin(authentication.getName())) {
            throw new AccessDeniedException("Forbidden");
        }

        String resetValue = authService.resetPasswordToDefault(userId);
        return ResponseEntity.ok(Map.of(
                "message", "Password reset to: " + resetValue,
                "userId", userId,
                "defaultPassword", resetValue
        ));
    }

    // =============================================
    // POST /api/v1/auth/reset-password/by-student-id/{studentId}
    // =============================================
    @PostMapping("/reset-password/by-student-id/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resetPasswordByStudentId(
            Authentication authentication,
            @PathVariable String studentId) {

        if (authentication == null || !authService.isAdmin(authentication.getName())) {
            throw new AccessDeniedException("Forbidden");
        }

        String resetValue = authService.resetStudentPasswordToDefault(studentId);
        return ResponseEntity.ok(Map.of(
                "message", "Password reset to: " + resetValue,
                "studentId", studentId,
                "defaultPassword", resetValue
        ));
    }

    // =============================================
    // Cookie helpers
    // =============================================

    private void setRefreshCookie(HttpServletResponse response, String rawToken, int maxAgeSeconds) {
        // Build a manually formatted Set-Cookie header to enforce SameSite=Strict,
        // which the Servlet Cookie API does not natively support in all containers.
        String cookieValue = String.format(
                "%s=%s; Max-Age=%d; Path=/api/v1/auth/refresh; HttpOnly; %sSameSite=Strict",
                REFRESH_COOKIE_NAME,
                rawToken,
                maxAgeSeconds,
                secureCookie ? "Secure; " : ""
        );
        response.addHeader("Set-Cookie", cookieValue);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        String cookieValue = String.format(
                "%s=; Max-Age=0; Path=/api/v1/auth/refresh; HttpOnly; %sSameSite=Strict",
                REFRESH_COOKIE_NAME,
                secureCookie ? "Secure; " : ""
        );
        response.addHeader("Set-Cookie", cookieValue);
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}