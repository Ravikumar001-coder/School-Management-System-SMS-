// src/main/java/com/school/sms/model/Mark.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "marks",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "exam_id"})
    }
)
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    private Double marksObtained;
    private Double totalMarks;
    private String grade;         // A+, A, B, etc.
    @Builder.Default
    private boolean absent = false;
    private String remarks;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        // Auto calculate grade
        if (marksObtained != null && totalMarks != null) {
            double percentage = (marksObtained / totalMarks) * 100;
            this.grade = calculateGrade(percentage);
        }
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        else if (percentage >= 80) return "A";
        else if (percentage >= 70) return "B+";
        else if (percentage >= 60) return "B";
        else if (percentage >= 50) return "C";
        else if (percentage >= 33) return "D";
        else return "F";
    }
}