package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consent_responses")
public class ConsentResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consent_form_id", nullable = false)
    private ConsentForm consentForm;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String status; // APPROVED, REJECTED

    private String signatureText;
    private String ipAddress;
    
    @Column(columnDefinition = "TEXT")
    private String deviceInfo;

    @Column(updatable = false)
    private LocalDateTime respondedAt;

    @PrePersist
    public void prePersist() {
        respondedAt = LocalDateTime.now();
    }
}
