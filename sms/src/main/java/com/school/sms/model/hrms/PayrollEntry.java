package com.school.sms.model.hrms;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payroll_entries")
public class PayrollEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_run_id", nullable = false)
    private PayrollRun payrollRun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(name = "gross_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "total_earnings", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalEarnings;

    @Column(name = "total_deductions", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "pf_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal pfAmount = BigDecimal.ZERO;

    @Column(name = "esi_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal esiAmount = BigDecimal.ZERO;

    @Column(name = "tds_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal tdsAmount = BigDecimal.ZERO;

    @Column(name = "leave_deduction", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal leaveDeduction = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EntryStatus status = EntryStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum EntryStatus {
        PENDING, PROCESSED, PAID
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
