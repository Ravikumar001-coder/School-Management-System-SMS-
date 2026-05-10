package com.school.sms.service;

import com.school.sms.model.Role;
import com.school.sms.model.User;
import com.school.sms.model.UserRole;
import com.school.sms.repository.RoleRepository;
import com.school.sms.repository.StudentRepository;
import com.school.sms.repository.TeacherRepository;
import com.school.sms.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserRoleSyncService {

    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Set<String> syncRolesForUser(User user) {
        if (user == null) {
            return Set.of();
        }

        Set<String> expectedRoles = inferRoles(user);
        if (expectedRoles.isEmpty()) {
            return expectedRoles;
        }

        for (String roleName : expectedRoles) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new IllegalStateException(roleName + " role not found"));

            if (!userRoleRepository.existsByUserAndRole(user, role)) {
                UserRole userRole = UserRole.builder()
                        .user(user)
                        .role(role)
                        .assignedBy("SYSTEM")
                        .build();
                userRoleRepository.save(userRole);
                user.getUserRoles().add(userRole);
            }
        }

        return expectedRoles;
    }

    public Set<String> inferRoles(User user) {
        Set<String> roles = new LinkedHashSet<>();
        String username = user.getUsername() == null ? "" : user.getUsername().trim().toUpperCase(Locale.ROOT);
        String email = user.getEmail() == null ? "" : user.getEmail().trim().toLowerCase(Locale.ROOT);
        String legacyRole = user.getRole();

        if ("ADMIN-001".equals(username)) {
            roles.add("ADMIN");
            roles.add("SUPERADMIN");
            return roles;
        }

        if (legacyRole != null && !legacyRole.isBlank()) {
            for (String rawRole : legacyRole.split(",")) {
                String normalized = rawRole == null ? "" : rawRole.trim().toUpperCase(Locale.ROOT);
                if (normalized.startsWith("ROLE_")) {
                    normalized = normalized.substring("ROLE_".length());
                }
                if (!normalized.isBlank()) {
                    roles.add(normalized);
                }
            }
        }

        if (username.startsWith("ADM-")) {
            roles.add("ADMIN");
        }

        if (username.startsWith("TCH-") || teacherRepository.findByEmail(email).isPresent()) {
            roles.add("TEACHER");
        }

        if (username.startsWith("STU-")
                || studentRepository.findByEmail(email).isPresent()
                || studentRepository.findByUser_Id(user.getId()).isPresent()) {
            roles.add("STUDENT");
        }

        return roles;
    }
}
