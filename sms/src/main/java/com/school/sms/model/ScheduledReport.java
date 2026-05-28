package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "scheduled_reports")
public class ScheduledReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_name", nullable = false, length = 100)
    private String reportName;

    @Column(nullable = false, length = 20)
    private String frequency; // DAILY, WEEKLY, MONTHLY

    @Column(nullable = false, length = 255)
    private String recipients; // Comma-separated emails

    @Column(name = "export_format", nullable = false, length = 10)
    private String exportFormat; // CSV, EXCEL, PDF

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "next_run_at")
    private LocalDateTime nextRunAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (nextRunAt == null) {
            calculateNextRun();
        }
    }

    public void calculateNextRun() {
        LocalDateTime base = nextRunAt != null ? nextRunAt : LocalDateTime.now();
        switch (frequency.toUpperCase()) {
            case "DAILY":
                nextRunAt = base.plusDays(1);
                break;
            case "WEEKLY":
                nextRunAt = base.plusWeeks(1);
                break;
            case "MONTHLY":
                nextRunAt = base.plusMonths(1);
                break;
            default:
                nextRunAt = base.plusDays(1);
        }
    }
}
