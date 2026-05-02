package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a single academic year, e.g. "2024-25".
 *
 * All transactional data (fees, attendance, marks, exams) references
 * an AcademicYear. This is the cornerstone for year-end transitions,
 * report isolation, and preventing cross-year data corruption.
 *
 * Relationship: ClassRoom, FeeStructure, FeePayment, Attendance, Mark,
 *               Exam, Subject all carry a @ManyToOne to AcademicYear.
 */
@Entity
@Table(name = "academic_years", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"school_code", "label"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Human-readable label shown in UI dropdowns: "2024-25".
     */
    @Column(nullable = false)
    private String label;  // e.g. "2024-25"

    /**
     * Numeric start year — used in receipt number generation: SCHOOL/2024/000001.
     */
    @Column(nullable = false)
    private Integer startYear;

    @Column(nullable = false)
    private Integer endYear;

    /**
     * School code prefix embedded in receipt numbers: "SMS", "DPS", etc.
     * Defaults to "SMS" until multi-school support is activated.
     */
    @Column(nullable = false)
    @Builder.Default
    private String schoolCode = "SMS";

    private LocalDate startDate;
    private LocalDate endDate;

    /**
     * Exactly one active year at a time.
     * All new records default to the active year.
     */
    @Builder.Default
    private boolean active = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
