package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parent_student_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentStudentLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String relationshipType; // FATHER, MOTHER, GUARDIAN, EMERGENCY

    @Builder.Default
    private boolean isPrimaryContact = false;

    @Builder.Default
    private boolean pickupAuthorized = true;

    @Builder.Default
    private boolean feeResponsible = false;

    @Builder.Default
    private boolean livesWithStudent = true;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String createdBy;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
