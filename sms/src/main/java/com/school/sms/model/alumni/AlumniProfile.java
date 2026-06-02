package com.school.sms.model.alumni;

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
@Table(name = "alumni_profiles", indexes = {
    @Index(name = "idx_alumni_student_id", columnList = "student_id", unique = true)
})
public class AlumniProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(name = "current_occupation")
    private String currentOccupation;

    @Column(name = "company_or_university")
    private String companyOrUniversity;

    @Column(name = "location")
    private String location;

    @Column(name = "linkedin_profile")
    private String linkedinProfile;

    @Column(name = "is_active_member")
    @Builder.Default
    private Boolean isActiveMember = true;
    
    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (registrationDate == null) registrationDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
