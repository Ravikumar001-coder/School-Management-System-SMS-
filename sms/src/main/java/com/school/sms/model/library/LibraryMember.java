package com.school.sms.model.library;

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
@Table(name = "library_members", indexes = {
    @Index(name = "idx_libmem_student_id", columnList = "student_id", unique = true)
})
public class LibraryMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(name = "membership_id", unique = true, nullable = false)
    private String membershipId;

    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, SUSPENDED

    @Column(name = "max_books_allowed")
    @Builder.Default
    private Integer maxBooksAllowed = 3;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (joinDate == null) joinDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
