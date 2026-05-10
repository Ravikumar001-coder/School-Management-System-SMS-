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
import org.springframework.http.HttpHeaders;
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

    public static final String REFRESH_COOKIE_NAME = "refreshToken";
    private final AuthService authService;

    // ── POST /auth/login ──────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthService.LoginResult result = authService.login(request);
        setRefreshCookie(response, result.refreshToken());
        return ResponseEntity.ok(result.response());
    }

    // ── POST /auth/refresh ────────────────────────────────────────────────────
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = extractRefreshCookie(request);
        if (rawToken == null) {
            return ResponseEntity.status(401).body(Map.of("message", "No refresh token provided."));
        }
        try {
            AuthService.RefreshResult result = authService.refreshToken(rawToken);
            setRefreshCookie(response, result.newRawRefreshToken());
            return ResponseEntity.ok(result.response());
        } catch (Exception e) {
            clearRefreshCookie(response);
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    // ── POST /auth/logout ─────────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = extractRefreshCookie(request);
        authService.logout(rawToken);
        clearRefreshCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // ── GET /auth/me ──────────────────────────────────────────────────────────
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUserProfile(authentication.getName()));
    }

    // ── POST /auth/change-password ────────────────────────────────────────────
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // ── POST /auth/reset-password/{userId} ───────────────────────────────────
    @PostMapping("/reset-password/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resetPassword(Authentication authentication,
                                           @PathVariable Long userId) {
        if (authentication == null || !authService.isAdmin(authentication.getName())) {
            throw new AccessDeniedException("Forbidden");
        }
        String resetValue = authService.resetPasswordToDefault(userId);
        return ResponseEntity.ok(Map.of(
            "message", "Password reset successfully",
            "userId", userId,
            "defaultPassword", resetValue
        ));
    }

    // ── POST /auth/reset-password/by-student-id/{studentId} ──────────────────
    @PostMapping("/reset-password/by-student-id/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resetPasswordByStudentId(Authentication authentication,
                                                      @PathVariable String studentId) {
        if (authentication == null || !authService.isAdmin(authentication.getName())) {
            throw new AccessDeniedException("Forbidden");
        }
        String resetValue = authService.resetStudentPasswordToDefault(studentId);
        return ResponseEntity.ok(Map.of(
            "message", "Password reset successfully",
            "studentId", studentId,
            "defaultPassword", resetValue
        ));
    }

    // ── Cookie helpers ────────────────────────────────────────────────────────
    private void setRefreshCookie(HttpServletResponse response, String rawToken) {
        String cookieHeader = String.format(
            "%s=%s; Path=/; HttpOnly; SameSite=Strict; Max-Age=%d",
            REFRESH_COOKIE_NAME, rawToken, 7 * 24 * 60 * 60
        );
        response.addHeader(HttpHeaders.SET_COOKIE, cookieHeader);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        String cookieHeader = String.format(
            "%s=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
            REFRESH_COOKIE_NAME
        );
        response.addHeader(HttpHeaders.SET_COOKIE, cookieHeader);
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