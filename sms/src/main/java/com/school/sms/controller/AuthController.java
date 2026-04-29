// src/main/java/com/school/sms/controller/AuthController.java

package com.school.sms.controller;

import com.school.sms.dto.request.ChangePasswordRequest;
import com.school.sms.dto.request.LoginRequest;
import com.school.sms.dto.response.AuthResponse;
import com.school.sms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST http://localhost:8080/api/v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body(java.util.Map.of(
                "message", "Logged out successfully"
        ));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        AuthResponse response = authService.getCurrentUserProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok().body(java.util.Map.of(
                "message", "Password changed successfully"
        ));
    }

    @PostMapping("/reset-password/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resetPassword(Authentication authentication,
                                           @PathVariable Long userId) {
        if (authentication == null || !authService.isAdmin(authentication.getName())) {
            throw new AccessDeniedException("Forbidden");
        }

        String resetValue = authService.resetPasswordToDefault(userId);
        return ResponseEntity.ok().body(java.util.Map.of(
            "message", "Password reset to: " + resetValue,
            "userId", userId,
            "defaultPassword", resetValue
        ));
    }

    @PostMapping("/reset-password/by-student-id/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resetPasswordByStudentId(Authentication authentication,
                                                      @PathVariable String studentId) {
        if (authentication == null || !authService.isAdmin(authentication.getName())) {
            throw new AccessDeniedException("Forbidden");
        }

        String resetValue = authService.resetStudentPasswordToDefault(studentId);
        return ResponseEntity.ok().body(java.util.Map.of(
            "message", "Password reset to: " + resetValue,
            "studentId", studentId,
            "defaultPassword", resetValue
        ));
    }
}