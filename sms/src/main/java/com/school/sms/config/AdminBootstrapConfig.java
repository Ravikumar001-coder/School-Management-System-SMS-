package com.school.sms.config;

import com.school.sms.model.Role;
import com.school.sms.model.User;
import com.school.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Objects;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrapConfig {

    private static final String DEFAULT_ADMIN_USERNAME = "ADMIN-001";
    private static final String DEFAULT_ADMIN_PASSWORD = "ADMIN-001";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@school.com";

    @Bean
    public CommandLineRunner ensureDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername(DEFAULT_ADMIN_USERNAME)
                    .or(() -> userRepository.findByEmail(DEFAULT_ADMIN_EMAIL))
                    .orElse(null);

            if (admin == null) {
                userRepository.save(Objects.requireNonNull(User.builder()
                        .firstName("Super")
                        .lastName("Admin")
                        .email(DEFAULT_ADMIN_EMAIL)
                        .username(DEFAULT_ADMIN_USERNAME)
                        .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .firstLogin(false)
                    .build()));
                log.info("Default admin user created: {}", DEFAULT_ADMIN_USERNAME);
                return;
            }

            boolean changed = false;

            boolean passwordMatches;
            try {
                passwordMatches = passwordEncoder.matches(DEFAULT_ADMIN_PASSWORD, admin.getPassword());
            } catch (IllegalArgumentException ex) {
                // Existing value is not a valid encoded password format.
                passwordMatches = false;
            }

            if (!passwordMatches) {
                admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                changed = true;
            }
            if (admin.getRole() != Role.ADMIN) {
                admin.setRole(Role.ADMIN);
                changed = true;
            }
            if (!admin.isEnabled()) {
                admin.setEnabled(true);
                changed = true;
            }
            if (admin.isFirstLogin()) {
                admin.setFirstLogin(false);
                changed = true;
            }
            if (admin.getUsername() == null || admin.getUsername().isBlank()) {
                admin.setUsername(DEFAULT_ADMIN_USERNAME);
                changed = true;
            }
            if (admin.getEmail() == null || admin.getEmail().isBlank()) {
                admin.setEmail(DEFAULT_ADMIN_EMAIL);
                changed = true;
            }

            if (changed) {
                userRepository.save(Objects.requireNonNull(admin));
                log.info("Default admin user updated: {}", DEFAULT_ADMIN_USERNAME);
            } else {
                log.info("Default admin user already valid: {}", DEFAULT_ADMIN_USERNAME);
            }
        };
    }
}
