package com.school.sms.model.academics;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_gradebooks", indexes = {
    @Index(name = "idx_gb_student_id", columnList = "student_id"),
    @Index(name = "idx_gb_academic_year", columnList = "academic_year_id")
})
public class StudentGradebook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(name = "term", length = 50)
    private String term; // e.g., Term 1, Semester 1, Final

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(name = "percentage")
    private Double percentage;

    @Column(name = "final_grade", length = 5)
    private String finalGrade;
    
    @Column(name = "rank_in_class")
    private Integer rankInClass;

    @Column(name = "attendance_percentage")
    private Double attendancePercentage;

    @Column(columnDefinition = "TEXT")
    private String teacherRemarks;

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
