// src/main/java/com/school/sms/model/Attendance.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendance",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "attendance_date", "subject_id", "academic_year_id"})
    },
    indexes = {
        @Index(name = "idx_attendance_student_id", columnList = "student_id"),
        @Index(name = "idx_attendance_class_date", columnList = "class_id, attendance_date"),
        @Index(name = "idx_attendance_created_at", columnList = "created_at")
    }
)
public class Attendance extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "marked_by")
    private Teacher markedBy;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status; // PRESENT, ABSENT, LATE, EXCUSED

    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}