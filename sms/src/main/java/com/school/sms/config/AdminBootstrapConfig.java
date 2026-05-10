package com.school.sms.config;

import com.school.sms.model.Role;
import com.school.sms.model.User;
import com.school.sms.model.UserRole;
import com.school.sms.repository.RoleRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.core.annotation.Order;

import java.util.Objects;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Order(10) // Run after RolePermissionSeeder
public class AdminBootstrapConfig {

    private static final String DEFAULT_ADMIN_USERNAME = "ADMIN-001";
    private static final String DEFAULT_ADMIN_PASSWORD = "ADMIN-001";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@school.com";

    @Bean
    public CommandLineRunner ensureDefaultAdmin(
            UserRepository userRepository, 
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername(DEFAULT_ADMIN_USERNAME)
                    .or(() -> userRepository.findByEmail(DEFAULT_ADMIN_EMAIL))
                    .orElse(null);

            if (admin == null) {
                User newAdmin = userRepository.save(Objects.requireNonNull(User.builder()
                        .firstName("Super")
                        .lastName("Admin")
                        .email(DEFAULT_ADMIN_EMAIL)
                        .username(DEFAULT_ADMIN_USERNAME)
                        .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                        .enabled(true)
                        .firstLogin(false)
                    .build()));
                
                assignRole(newAdmin, "ADMIN", roleRepository, userRoleRepository);
                assignRole(newAdmin, "SUPERADMIN", roleRepository, userRoleRepository);
                log.info("Default admin user created: {}", DEFAULT_ADMIN_USERNAME);
                return;
            }

            boolean changed = false;

            if (!passwordEncoder.matches(DEFAULT_ADMIN_PASSWORD, admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                changed = true;
            }

            if (!admin.hasRole("ADMIN")) {
                assignRole(admin, "ADMIN", roleRepository, userRoleRepository);
                changed = true;
            }

            if (!admin.hasRole("SUPERADMIN")) {
                assignRole(admin, "SUPERADMIN", roleRepository, userRoleRepository);
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

            if (changed) {
                userRepository.save(admin);
                log.info("Default admin user updated: {}", DEFAULT_ADMIN_USERNAME);
            }
        };
    }

    private void assignRole(User user, String roleName, RoleRepository roleRepo, UserRoleRepository userRoleRepo) {
        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException(roleName + " role not found"));
        
        if (!userRoleRepo.existsByUserAndRole(user, role)) {
            UserRole ur = UserRole.builder()
                    .user(user)
                    .role(role)
                    .assignedBy("SYSTEM")
                    .build();
            userRoleRepo.save(ur);
            user.getUserRoles().add(ur);
        }
    }
}
