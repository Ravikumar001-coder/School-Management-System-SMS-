package com.school.sms.model.hrms;

import com.school.sms.model.Branch;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pf_esi_reports")
public class PfEsiReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "report_month", nullable = false)
    private Integer reportMonth;

    @Column(name = "report_year", nullable = false)
    private Integer reportYear;

    @Column(name = "total_pf_employee", precision = 15, scale = 2)
    private BigDecimal totalPfEmployee;

    @Column(name = "total_pf_employer", precision = 15, scale = 2)
    private BigDecimal totalPfEmployer;

    @Column(name = "total_esi_employee", precision = 15, scale = 2)
    private BigDecimal totalEsiEmployee;

    @Column(name = "total_esi_employer", precision = 15, scale = 2)
    private BigDecimal totalEsiEmployer;

    @Column(name = "challan_url", columnDefinition = "TEXT")
    private String challanUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReportStatus status = ReportStatus.DRAFT;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReportStatus {
        DRAFT, SUBMITTED
    }
}
