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
@Table(name = "student_health_records", indexes = {
    @Index(name = "idx_health_student_id", columnList = "student_id")
})
public class StudentHealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "record_type", length = 50)
    private String recordType; // CHECKUP, INCIDENT, ALLERGY, MEDICATION

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;

    @Column(name = "recorded_by")
    private String recordedBy;
    
    @Column(name = "doctor_name")
    private String doctorName;

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
