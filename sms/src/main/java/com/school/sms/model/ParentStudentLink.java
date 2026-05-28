package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parent_student_link", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"parent_id", "student_id"})
})
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
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Student student;

    @Column(nullable = false)
    private String relationship; // FATHER, MOTHER, GUARDIAN, etc.

    @Builder.Default
    private boolean isPrimaryGuardian = false;

    private String createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    // Legacy Bridge Getters for Response DTOs
    public String getRelationshipType() {
        return relationship;
    }
    
    public boolean isPrimaryContact() {
        return isPrimaryGuardian;
    }
}
