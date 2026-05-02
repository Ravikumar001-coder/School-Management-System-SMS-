package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Immutable audit trail for all sensitive data changes.
 *
 * Records WHO changed WHAT, WHEN, and what the data looked like BEFORE and AFTER.
 * Applies to: fee payments, attendance records, exam marks.
 *
 * Immutability contract:
 * - No @PreUpdate lifecycle method (rows are never updated)
 * - No delete endpoint in any controller
 * - The ADMIN role cannot delete audit logs (enforced at service layer)
 * - DB-level: no DELETE permission should be granted to the app user in production
 *
 * Storage format:
 * oldValue / newValue are stored as JSON strings for flexibility.
 */
@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id"),
        @Index(name = "idx_audit_actor",  columnList = "actor_id"),
        @Index(name = "idx_audit_time",   columnList = "changed_at")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Domain entity type: "FeePayment", "Attendance", "Mark".
     */
    @Column(nullable = false)
    private String entityType;

    /**
     * Primary key of the affected record.
     */
    @Column(nullable = false)
    private Long entityId;

    /**
     * Action performed: CREATE, UPDATE, DELETE (soft).
     */
    @Column(nullable = false)
    private String action;

    /**
     * Field name that changed (null for CREATE/DELETE).
     */
    private String fieldName;

    /**
     * JSON-serialized value before the change.
     * Null for CREATE actions.
     */
    @Column(columnDefinition = "TEXT")
    private String oldValue;

    /**
     * JSON-serialized value after the change.
     * Null for soft-delete actions.
     */
    @Column(columnDefinition = "TEXT")
    private String newValue;

    /**
     * The user who performed the action (username / email).
     */
    @Column(nullable = false)
    private String actorUsername;

    /**
     * User ID of the actor at the time of the action.
     * Stored as a plain Long (not a FK) so logs survive user deletion.
     */
    @Column(nullable = false)
    private Long actorId;

    /**
     * IP address of the request origin.
     */
    private String ipAddress;

    /**
     * Academic year context (label, e.g. "2024-25").
     */
    private String academicYearLabel;

    /**
     * Exact timestamp of the change — set once at insert, never modified.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime changedAt;

    @PrePersist
    public void prePersist() {
        changedAt = LocalDateTime.now();
    }
}
