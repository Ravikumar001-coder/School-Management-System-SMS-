package com.school.sms.model.academics;

import com.school.sms.model.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_assignment_submissions", indexes = {
    @Index(name = "idx_sub_student_id", columnList = "student_id"),
    @Index(name = "idx_sub_status", columnList = "status")
})
public class StudentAssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    // Using a Long ID for assignment instead of full relation if Assignment model doesn't exist yet
    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SubmissionStatus status;

    @Column(name = "marks_obtained")
    private Double marksObtained;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "file_url")
    private String fileUrl;

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

    public enum SubmissionStatus {
        PENDING, SUBMITTED, LATE_SUBMISSION, GRADED, REJECTED
    }
}
