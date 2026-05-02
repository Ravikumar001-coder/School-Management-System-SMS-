package com.school.sms.service;

import com.school.sms.model.AuditLog;
import com.school.sms.model.User;
import com.school.sms.repository.AuditLogRepository;
import com.school.sms.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Append-only audit logging service.
 *
 * Rules:
 * - NEVER exposes delete methods.
 * - All log() calls use REQUIRES_NEW propagation so that audit records are
 *   committed even if the outer transaction rolls back (e.g. a fee edit fails
 *   validation — we still want a log of the ATTEMPTED change).
 * - The IP address is extracted from the current request if available.
 *
 * Call sites:
 * - FeeService: log fee payment creation and updates
 * - AttendanceService: log attendance marks and corrections
 * - ExamService/MarkService: log mark entry and edits
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    // =============================================
    // Logging API
    // =============================================

    /**
     * Log a CREATE action.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logCreate(String entityType, Long entityId, String newValueJson,
                          String academicYearLabel) {
        persist(entityType, entityId, "CREATE", null, null, newValueJson, academicYearLabel);
    }

    /**
     * Log an UPDATE to a specific field.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUpdate(String entityType, Long entityId, String fieldName,
                          String oldValueJson, String newValueJson, String academicYearLabel) {
        persist(entityType, entityId, "UPDATE", fieldName, oldValueJson, newValueJson, academicYearLabel);
    }

    /**
     * Log a soft-delete action.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logDelete(String entityType, Long entityId, String oldValueJson,
                          String academicYearLabel) {
        persist(entityType, entityId, "DELETE", null, oldValueJson, null, academicYearLabel);
    }

    /**
     * Log a restore (un-delete) action.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logRestore(String entityType, Long entityId, String academicYearLabel) {
        persist(entityType, entityId, "RESTORE", null, null, null, academicYearLabel);
    }

    // =============================================
    // Read API (Admin only — enforced at controller)
    // =============================================

    public Page<AuditLog> getLogsForEntity(String entityType, Long entityId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByChangedAtDesc(
                entityType, entityId, pageable);
    }

    public Page<AuditLog> getLogsByActor(String actorUsername, Pageable pageable) {
        return auditLogRepository.findByActorUsernameOrderByChangedAtDesc(actorUsername, pageable);
    }

    public Page<AuditLog> getLogsByEntityType(String entityType, Pageable pageable) {
        return auditLogRepository.findByEntityTypeOrderByChangedAtDesc(entityType, pageable);
    }

    public Page<AuditLog> getLogsByDateRange(LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return auditLogRepository.findByDateRange(from, to, pageable);
    }

    // =============================================
    // Internal helpers
    // =============================================

    private void persist(String entityType, Long entityId, String action,
                         String fieldName, String oldValue, String newValue,
                         String academicYearLabel) {
        try {
            ActorContext actor = resolveActor();

            AuditLog entry = AuditLog.builder()
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .fieldName(fieldName)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .actorUsername(actor.username())
                    .actorId(actor.id())
                    .ipAddress(resolveIp())
                    .academicYearLabel(academicYearLabel)
                    .build();

            auditLogRepository.save(entry);

        } catch (Exception e) {
            // Audit failure must NOT crash the main operation.
            // Log the failure and continue — a missing audit entry is better than
            // a failed fee payment or a stuck teacher dashboard.
            log.error("AUDIT_FAILURE: Could not write audit log for entity={} id={} action={}. Error: {}",
                    entityType, entityId, action, e.getMessage());
        }
    }

    private ActorContext resolveActor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return new ActorContext("SYSTEM", -1L);
        }
        String username = auth.getName();
        Long userId = userRepository.findByUsernameOrEmail(username, username)
                .map(User::getId)
                .orElse(-1L);
        return new ActorContext(username, userId);
    }

    private String resolveIp() {
        try {
            // HttpServletRequest is request-scoped — safe to access here
            HttpServletRequest request = ((jakarta.servlet.http.HttpServletRequest)
                    org.springframework.web.context.request.RequestContextHolder
                            .currentRequestAttributes()
                            .resolveReference(org.springframework.web.context.request.RequestAttributes.REFERENCE_REQUEST));
            if (request == null) return null;
            String forwarded = request.getHeader("X-Forwarded-For");
            return (forwarded != null && !forwarded.isBlank())
                    ? forwarded.split(",")[0].trim()
                    : request.getRemoteAddr();
        } catch (Exception e) {
            return null; // Non-HTTP context (batch jobs, tests) — IP is not available
        }
    }

    private record ActorContext(String username, Long id) {}
}
