package com.school.sms.model.hrms;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "salary_advances")
public class SalaryAdvance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;

    @Column(name = "recovery_start_month", nullable = false)
    private Integer recoveryStartMonth;

    @Column(name = "installment_count")
    @Builder.Default
    private Integer installmentCount = 1;

    @Column(name = "monthly_recovery_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRecoveryAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private AdvanceStatus status = AdvanceStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum AdvanceStatus {
        ACTIVE, RECOVERED, CANCELLED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
