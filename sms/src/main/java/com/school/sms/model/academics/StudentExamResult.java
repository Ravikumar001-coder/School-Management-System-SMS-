package com.school.sms.model.academics;

import com.school.sms.model.Exam;
import com.school.sms.model.Student;
import com.school.sms.model.Subject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_exam_results", indexes = {
    @Index(name = "idx_res_student_id", columnList = "student_id"),
    @Index(name = "idx_res_exam_id", columnList = "exam_id")
})
public class StudentExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "marks_obtained")
    private Double marksObtained;

    @Column(name = "max_marks")
    private Double maxMarks;

    @Column(length = 5)
    private String grade;

    @Column(length = 20)
    private String status; // PASS, FAIL, ABSENT, WITHHELD

    @Column(columnDefinition = "TEXT")
    private String remarks;

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
