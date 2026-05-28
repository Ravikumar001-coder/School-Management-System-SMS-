// src/main/java/com/school/sms/config/RolePermissionSeeder.java
package com.school.sms.config;

import com.school.sms.model.Permission;
import com.school.sms.model.Role;
import com.school.sms.repository.PermissionRepository;
import com.school.sms.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Enterprise Security Seeder
 * Ensures that the core RBAC (Role-Based Access Control) matrix 
 * is synchronized with the codebase on every startup.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class RolePermissionSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Synchronizing Security Permissions Matrix...");
        seedPermissions();
        seedRoles();
        log.info("Security synchronization complete.");
    }

    private void seedPermissions() {
        List<String> modules = Arrays.asList(
            "STUDENTS", "FEES", "ATTENDANCE", "MARKS", "EXAMS", 
            "USERS", "BACKUPS", "REPORTS", "ROLES", "TEACHERS", "CLASSES", "DASHBOARD"
        );
        List<String> actions = Arrays.asList("VIEW", "CREATE", "EDIT", "DELETE", "EXPORT");

        for (String module : modules) {
            for (String action : actions) {
                String key = (module + "_" + action).toUpperCase();
                if (permissionRepository.findByPermissionKey(key).isEmpty()) {
                    permissionRepository.save(Permission.builder()
                            .moduleName(module)
                            .actionName(action)
                            .permissionKey(key)
                            .build());
                }
            }
        }

        List<String> customKeys = Arrays.asList(
            "ATTENDANCE_MARK",
            "ATTENDANCE_TEMPLATE_MANAGE",
            "HOMEWORK_CREATE",
            "HOMEWORK_REVIEW",
            "CLASS_DIARY_CREATE",
            "LESSON_PLAN_MANAGE",
            "EXAM_DOCUMENT_UPLOAD",
            "SUBSTITUTE_ASSIGN",
            "TIMETABLE_VIEW"
        );
        for (String key : customKeys) {
            if (permissionRepository.findByPermissionKey(key).isEmpty()) {
                String[] parts = key.split("_");
                String module = parts[0];
                String action = parts[1];
                permissionRepository.save(Permission.builder()
                        .moduleName(module)
                        .actionName(action)
                        .permissionKey(key)
                        .build());
            }
        }
    }

    private void seedRoles() {
        // 1. Ensure SUPERADMIN has 100% permission coverage
        syncSuperAdmin();

        // 2. Initialize other system roles if missing
        ensureRole("ADMIN", "Administrative access", true);
        syncAdminPermissions("ADMIN");
        
        ensureRole("TEACHER", "Academic access", true);
        ensureRole("ACCOUNTANT", "Financial access", true);
        ensureRole("HR", "Human resources access", true);
        ensureRole("LIBRARIAN", "Library access", true);
        ensureRole("PARENT", "Parental access", true);
        ensureRole("STUDENT", "Student access", true);
        
        // 3. Sync exact functional permissions to system roles
        syncExactPermissionsToRole("TEACHER", Arrays.asList(
            "ATTENDANCE_VIEW", "ATTENDANCE_CREATE", "ATTENDANCE_EDIT",
            "MARKS_VIEW", "MARKS_CREATE", "MARKS_EDIT",
            "STUDENTS_VIEW", "EXAMS_VIEW", "DASHBOARD_VIEW",
            "CLASSES_VIEW", "TEACHERS_VIEW",
            "ATTENDANCE_MARK", "ATTENDANCE_TEMPLATE_MANAGE",
            "HOMEWORK_CREATE", "HOMEWORK_REVIEW",
            "CLASS_DIARY_CREATE", "LESSON_PLAN_MANAGE",
            "EXAM_DOCUMENT_UPLOAD", "SUBSTITUTE_ASSIGN",
            "TIMETABLE_VIEW"
        ));

        syncExactPermissionsToRole("ACCOUNTANT", Collections.emptyList());
        syncExactPermissionsToRole("HR", Arrays.asList(
            "DASHBOARD_VIEW", "TEACHERS_VIEW", "TEACHERS_CREATE", "TEACHERS_EDIT", "TEACHERS_DELETE",
            "USERS_VIEW", "REPORTS_VIEW"
        ));
        syncExactPermissionsToRole("LIBRARIAN", Collections.emptyList());
        syncExactPermissionsToRole("PARENT", Collections.emptyList());

        // 4. Sync basic permissions to Student
        syncExactPermissionsToRole("STUDENT", Arrays.asList(
            "DASHBOARD_VIEW", "MARKS_VIEW", "ATTENDANCE_VIEW", "EXAMS_VIEW",
            "CLASSES_VIEW", "STUDENTS_VIEW"
        ));
    }

    private void syncSuperAdmin() {
        syncAdminPermissions("SUPERADMIN");
    }

    private void syncAdminPermissions(String name) {
        Role role = roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(name)
                        .description(name + " access")
                        .isSystemRole(true)
                        .build()));

        // ALWAYS force-sync all permissions to Admin roles on every startup.
        // The previous conditional (size check) caused silent skips when the DB
        // had a stale/partial permission set, leading to STUDENTS_VIEW being
        // missing and PermissionAspect blocking all student requests with 403.
        Set<Permission> allPerms = new HashSet<>(permissionRepository.findAll());
        role.setPermissions(allPerms);
        roleRepository.save(role);
        log.info("[Security] Force-synced {} permissions to '{}' role.", allPerms.size(), name);
    }

    private void ensureRole(String name, String desc, boolean isSystem) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder()
                    .name(name)
                    .description(desc)
                    .isSystemRole(isSystem)
                    .build());
            log.info("Initialized system role: {}", name);
        }
    }

    private void syncExactPermissionsToRole(String roleName, List<String> permKeys) {
        roleRepository.findByName(roleName).ifPresent(role -> {
            Set<Permission> perms = new LinkedHashSet<>();
            for (String key : permKeys) {
                Permission p = permissionRepository.findByPermissionKey(key).orElse(null);
                if (p != null) {
                    perms.add(p);
                }
            }

            Set<String> currentKeys = role.getPermissions().stream()
                    .map(Permission::getPermissionKey)
                    .collect(java.util.stream.Collectors.toSet());
            Set<String> nextKeys = perms.stream()
                    .map(Permission::getPermissionKey)
                    .collect(java.util.stream.Collectors.toSet());

            if (!currentKeys.equals(nextKeys)) {
                role.setPermissions(perms);
                roleRepository.save(role);
                log.info("Updated permission set for role: {}", roleName);
            }
        });
    }
}
