package com.school.sms.model.health;

import com.school.sms.model.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_disciplinary_incidents", indexes = {
    @Index(name = "idx_disc_student_id", columnList = "student_id"),
    @Index(name = "idx_disc_date", columnList = "incident_date")
})
public class StudentDisciplinaryIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(nullable = false, length = 100)
    private String severity; // MINOR, MODERATE, SEVERE

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;

    @Column(name = "reported_by")
    private String reportedBy;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "OPEN"; // OPEN, RESOLVED, UNDER_REVIEW

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
