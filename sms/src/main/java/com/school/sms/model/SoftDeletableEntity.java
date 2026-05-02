package com.school.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * MappedSuperclass providing soft-delete columns to all domain entities.
 *
 * Entities that extend this class are NEVER physically deleted.
 * A soft-delete sets deleted_at and deleted_by; all queries must
 * filter WHERE deleted_at IS NULL to exclude trashed records.
 *
 * Applies to: Student, Teacher, FeePayment, FeeStructure,
 *             Attendance, Mark, Exam, Subject, ClassRoom.
 *
 * Trash recovery: Admin can view and restore soft-deleted records
 * via /api/v1/admin/trash/** endpoints (Phase B of trash UI).
 */
@MappedSuperclass
@Getter
@Setter
public abstract class SoftDeletableEntity {

    /**
     * Timestamp of soft-delete. NULL means the record is active.
     * Records with a non-null deletedAt are excluded from all standard queries.
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Username of the actor who performed the soft-delete.
     * Preserved even if the actor's account is later removed.
     */
    @Column(name = "deleted_by")
    private String deletedBy;

    /** Convenience method used by service layer: softDelete(principal). */
    public void softDelete(String actorUsername) {
        this.deletedAt  = LocalDateTime.now();
        this.deletedBy  = actorUsername;
    }

    /** Restore a soft-deleted record (admin trash recovery). */
    public void restore() {
        this.deletedAt = null;
        this.deletedBy = null;
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }
}
