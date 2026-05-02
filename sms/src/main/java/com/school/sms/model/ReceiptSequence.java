package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Receipt sequence counter — one row per (school_code, academic_year).
 *
 * This table implements gap-free, duplicate-free sequential receipt numbering
 * using a SELECT ... FOR UPDATE (pessimistic lock) strategy.
 *
 * Format: SCHOOL_CODE/YEAR/000001
 * Example: SMS/2024/000001, SMS/2024/000002 ...
 *
 * Why not DB sequences?
 * MySQL does not support named sequences per arbitrary keys. This table gives
 * the same guarantee (monotonic, no gaps within a session) with full control
 * over the format and multi-year isolation.
 *
 * Concurrency: ReceiptNumberService.nextReceiptNumber() acquires a pessimistic
 * write lock (LockModeType.PESSIMISTIC_WRITE) on this row before incrementing.
 */
@Entity
@Table(name = "receipt_sequences", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"school_code", "academic_year_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String schoolCode;        // "SMS", "DPS"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    /**
     * Monotonically increasing counter. Never decremented, never reset mid-year.
     */
    @Column(nullable = false)
    @Builder.Default
    private Long lastSequence = 0L;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void touch() {
        updatedAt = LocalDateTime.now();
    }
}
