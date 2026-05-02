// src/main/java/com/school/sms/model/Exam.java

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
@Table(name = "exams", indexes = {
    @Index(name = "idx_exams_classroom_id", columnList = "class_id"),
    @Index(name = "idx_exams_subject_id", columnList = "subject_id"),
    @Index(name = "idx_exams_academic_year", columnList = "academic_year_id")
})
public class Exam extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // "Mid-Term Exam 2024"
    private String examType;      // "MIDTERM", "FINAL", "UNIT_TEST"

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private LocalDate examDate;
    private String startTime;
    private String endTime;
    private Integer totalMarks;
    private Integer passingMarks;
    private String venue;
    private String status;        // SCHEDULED, ONGOING, COMPLETED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
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