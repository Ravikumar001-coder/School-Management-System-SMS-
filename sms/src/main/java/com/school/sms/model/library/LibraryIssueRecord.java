package com.school.sms.model.library;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "library_issue_records", indexes = {
    @Index(name = "idx_issrec_member_id", columnList = "member_id"),
    @Index(name = "idx_issrec_status", columnList = "status")
})
public class LibraryIssueRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private LibraryMember member;

    // Simplified to string for now if Book entity doesn't exist
    @Column(name = "book_id", nullable = false)
    private String bookId;
    
    @Column(name = "book_title")
    private String bookTitle;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "fine_amount")
    @Builder.Default
    private Double fineAmount = 0.0;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ISSUED"; // ISSUED, RETURNED, OVERDUE, LOST

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
