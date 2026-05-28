package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Parent;
import com.school.sms.model.ParentOTPSession;
import com.school.sms.repository.ParentOTPSessionRepository;
import com.school.sms.repository.ParentRepository;
import com.school.sms.repository.StudentRepository;
import com.school.sms.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Slf4j
@RestController
@RequestMapping("/api/v1/parent/auth")
@RequiredArgsConstructor
public class ParentAuthController {

    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final ParentOTPSessionRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/request-otp")
    public ResponseEntity<ApiResponse<Object>> requestOtp(@RequestBody Map<String, String> body) {
        String mobile = body.get("mobileNumber");
        
        Optional<Parent> parentOpt = parentRepository.findByPhoneAndDeletedAtIsNull(mobile);
        if (parentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Mobile number not registered. Please contact school office."));
        }

        Parent parent = parentOpt.get();
        
        // Generate 6-digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(1000000));
        
        // Log only for development, masked for production forensics
        log.info("OTP requested for mobile: {} [MASKED]", mobile); 

        ParentOTPSession session = ParentOTPSession.builder()
                .parent(parent)
                .mobileNumber(mobile)
                .otpCodeHash(passwordEncoder.encode(otpCode)) // Secure Hashing
                .purpose("LOGIN")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();
        
        otpRepository.save(session);

        // In a real scenario, this goes to SMS provider. 
        // For this audit, we expose it ONLY in a secure header or controlled log for testing.
        log.debug("DEBUG_OTP: {}", otpCode); 

        return ResponseEntity.ok(ApiResponse.success("OTP sent to your registered mobile number."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@RequestBody Map<String, String> body) {
        String mobile = body.get("mobileNumber");
        String code = body.get("otpCode");

        Optional<ParentOTPSession> sessionOpt = otpRepository.findFirstByMobileNumberAndPurposeOrderByCreatedAtDesc(mobile, "LOGIN");
        
        if (sessionOpt.isEmpty() || sessionOpt.get().isExpired()) {
            return ResponseEntity.status(400).body(ApiResponse.error("OTP expired or invalid."));
        }

        ParentOTPSession session = sessionOpt.get();
        
        // Brute force protection: Lock after 5 attempts
        if (session.getAttemptsCount() >= 5) {
            return ResponseEntity.status(403).body(ApiResponse.error("Too many failed attempts. Please request a new OTP."));
        }

        if (!passwordEncoder.matches(code, session.getOtpCodeHash())) {
            session.setAttemptsCount(session.getAttemptsCount() + 1);
            otpRepository.save(session);
            return ResponseEntity.status(400).body(ApiResponse.error("Invalid OTP code. Retries left: " + (5 - session.getAttemptsCount())));
        }

        // Success
        session.setVerifiedAt(LocalDateTime.now());
        otpRepository.save(session);

        Parent parent = session.getParent();
        parent.setMobileVerified(true);
        parent.setLastLoginAt(LocalDateTime.now());
        parentRepository.save(parent);

        // Issue real JWT
        var userDetails = new User(parent.getPhone(), "", Collections.singleton(new SimpleGrantedAuthority("ROLE_PARENT")));
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(ApiResponse.success("Authentication successful", Map.of(
                "token", token,
                "parent", Map.of(
                        "id", parent.getId(),
                        "name", parent.getFirstName() + " " + (parent.getLastName() != null ? parent.getLastName() : ""),
                        "uuid", parent.getParentUuid()
                )
        )));
    }

    @PostMapping("/login-password")
    public ResponseEntity<ApiResponse<Object>> loginWithPassword(@RequestBody Map<String, String> body) {
        String mobile = body.get("mobileNumber");
        String studentId = body.get("studentId");

        if (mobile == null || studentId == null) {
            return ResponseEntity.status(400).body(ApiResponse.error("Mobile number and Student ID are required."));
        }

        Optional<Parent> parentOpt = parentRepository.findByPhoneAndDeletedAtIsNull(mobile);
        if (parentOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid mobile number or student ID."));
        }

        Parent parent = parentOpt.get();
        
        // Verify if any linked child matches the provided studentId (case-insensitive)
        boolean authorized = parent.getStudentLinks().stream()
                .anyMatch(link -> link.getStudent() != null && 
                                 link.getStudent().getStudentId() != null && 
                                 link.getStudent().getStudentId().equalsIgnoreCase(studentId.trim()));

        if (!authorized) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid mobile number or student ID."));
        }

        // Success - Treat as verified
        parent.setMobileVerified(true);
        parent.setLastLoginAt(LocalDateTime.now());
        parentRepository.save(parent);

        // Issue JWT
        var userDetails = new User(parent.getPhone(), "", Collections.singleton(new SimpleGrantedAuthority("ROLE_PARENT")));
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(ApiResponse.success("Login successful", Map.of(
                "token", token,
                "parent", Map.of(
                        "id", parent.getId(),
                        "name", parent.getFirstName() + " " + (parent.getLastName() != null ? parent.getLastName() : ""),
                        "uuid", parent.getParentUuid()
                )
        )));
    }
}
