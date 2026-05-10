package com.school.sms.controller;

import com.school.sms.model.Permission;
import com.school.sms.model.PermissionAuditLog;
import com.school.sms.model.Role;
import com.school.sms.model.User;
import com.school.sms.model.UserRole;
import com.school.sms.repository.PermissionAuditLogRepository;
import com.school.sms.repository.PermissionRepository;
import com.school.sms.repository.RoleRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.UserRoleRepository;
import com.school.sms.security.PermissionCacheService;
import com.school.sms.security.RequirePermission;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Role & Permission Management Controller
 * Handles RBAC administration with auditing and cache invalidation.
 */
@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Transactional
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PermissionAuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final HttpServletRequest request;
    private final PermissionCacheService cacheService;

    @GetMapping
    @RequirePermission("ROLES_VIEW")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @GetMapping("/{id}")
    @RequirePermission("ROLES_VIEW")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        return roleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @RequirePermission("ROLES_CREATE")
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        role.setSystemRole(false);
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @PutMapping("/{id}")
    @RequirePermission("ROLES_EDIT")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role roleDetails) {
        return roleRepository.findById(id)
                .map(role -> {
                    role.setName(roleDetails.getName());
                    role.setDescription(roleDetails.getDescription());
                    return ResponseEntity.ok(roleRepository.save(role));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequirePermission("ROLES_DELETE")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        return roleRepository.findById(id)
                .map(role -> {
                    if (role.isSystemRole()) {
                        return ResponseEntity.badRequest().body("Cannot delete system roles");
                    }
                    roleRepository.delete(role);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/permissions")
    @RequirePermission("ROLES_VIEW")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    @PutMapping("/{id}/permissions")
    @RequirePermission("ROLES_EDIT")
    public ResponseEntity<?> updateRolePermissions(
            @PathVariable Long id, 
            @RequestBody List<String> permissionKeys) {
        
        User actor = getAuthenticatedUser();
        if (actor == null) return ResponseEntity.status(401).build();

        boolean isSuperAdmin = actor.getUserRoles().stream()
                .anyMatch(ur -> ur.getRole().getName().equals("SUPERADMIN"));

        // Privilege Escalation Check: Only SuperAdmin can grant ROLES permissions
        boolean grantingSensitive = permissionKeys.stream()
                .anyMatch(k -> k.startsWith("ROLES_") || k.equals("SUPERADMIN"));
        
        if (grantingSensitive && !isSuperAdmin) {
            return ResponseEntity.status(403).build();
        }

        return roleRepository.findById(id)
                .map(role -> {
                    String before = role.getPermissions().stream()
                            .map(Permission::getPermissionKey)
                            .sorted()
                            .collect(Collectors.joining(","));

                    Set<Permission> permissions = permissionKeys.stream()
                            .map(permissionRepository::findByPermissionKey)
                            .filter(java.util.Optional::isPresent)
                            .map(java.util.Optional::get)
                            .collect(Collectors.toSet());
                    
                    role.setPermissions(permissions);
                    Role saved;
                    try {
                        saved = roleRepository.save(role);
                        cacheService.evictAll(); // Invalidate cache on permission change
                    } catch (ObjectOptimisticLockingFailureException e) {
                        return ResponseEntity.status(409).build(); // Conflict
                    }

                    String after = saved.getPermissions().stream()
                            .map(Permission::getPermissionKey)
                            .sorted()
                            .collect(Collectors.joining(","));

                    // Audit Log
                    auditLogRepository.save(PermissionAuditLog.builder()
                            .actorId(actor.getId())
                            .parentRoleId(id)
                            .action("PERMISSION_CHANGED")
                            .beforeValue(before)
                            .afterValue(after)
                            .details(String.format("{\"message\": \"Updated permissions for role: %s\"}", role.getName()))
                            .ipAddress(request.getRemoteAddr())
                            .build());

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users/{userId}/roles/{roleId}")
    @RequirePermission("ROLES_EDIT")
    public ResponseEntity<?> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User actor = getAuthenticatedUser();
        if (actor == null) return ResponseEntity.status(401).build();
        
        return userRepository.findById(userId).flatMap(user -> 
            roleRepository.findById(roleId).map(role -> {
                if (userRoleRepository.existsByUserAndRole(user, role)) {
                    return ResponseEntity.badRequest().body("User already has this role");
                }
                
                userRoleRepository.save(UserRole.builder()
                        .user(user)
                        .role(role)
                        .assignedBy(actor.getUsername())
                        .build());
                
                cacheService.evictAll();
                
                auditLogRepository.save(PermissionAuditLog.builder()
                        .actorId(actor.getId())
                        .targetUserId(userId)
                        .action("ROLE_ASSIGNED")
                        .details(String.format("{\"message\": \"Role %s assigned to user %s\"}", role.getName(), user.getUsername()))
                        .ipAddress(request.getRemoteAddr())
                        .build());

                return ResponseEntity.ok().build();
            })
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{userId}/roles/{roleId}")
    @RequirePermission("ROLES_EDIT")
    public ResponseEntity<?> removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User actor = getAuthenticatedUser();
        if (actor == null) return ResponseEntity.status(401).build();

        return userRoleRepository.findByUserIdAndRoleId(userId, roleId)
                .map(userRole -> {
                    if (userRole.getRole().getName().equals("SUPERADMIN")) {
                        return ResponseEntity.badRequest().body("Cannot remove SUPERADMIN role via API");
                    }
                    userRoleRepository.delete(userRole);
                    cacheService.evictAll();

                    auditLogRepository.save(PermissionAuditLog.builder()
                            .actorId(actor.getId())
                            .targetUserId(userId)
                            .action("ROLE_REMOVED")
                            .details(String.format("{\"message\": \"Role %s removed from user ID %d\"}", userRole.getRole().getName(), userId))
                            .ipAddress(request.getRemoteAddr())
                            .build());

                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/audit-logs")
    @RequirePermission("ROLES_VIEW")
    public ResponseEntity<List<PermissionAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        return null;
    }
}
