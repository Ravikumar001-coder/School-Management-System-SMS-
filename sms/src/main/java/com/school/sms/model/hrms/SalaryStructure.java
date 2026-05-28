package com.school.sms.model.hrms;

import com.school.sms.model.Branch;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "salary_structures")
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "structure_name", nullable = false, length = 100)
    private String structureName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "basic_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal basicPercentage = BigDecimal.ZERO;

    @Column(name = "hra_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal hraPercentage = BigDecimal.ZERO;

    @Column(name = "da_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal daPercentage = BigDecimal.ZERO;

    @Column(name = "ta_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taPercentage = BigDecimal.ZERO;

    @Column(name = "medical_allowance", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal medicalAllowance = BigDecimal.ZERO;

    @Column(name = "special_allowance", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal specialAllowance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_frequency", nullable = false)
    @Builder.Default
    private PayFrequency payFrequency = PayFrequency.MONTHLY;

    @Column(name = "pf_enabled")
    @Builder.Default
    private boolean pfEnabled = true;

    @Column(name = "esi_enabled")
    @Builder.Default
    private boolean esiEnabled = true;

    @Column(name = "pt_enabled")
    @Builder.Default
    private boolean ptEnabled = true;

    @Column(name = "tds_enabled")
    @Builder.Default
    private boolean tdsEnabled = true;

    @Column(name = "overtime_enabled")
    @Builder.Default
    private boolean overtimeEnabled = false;

    @Column(name = "status")
    @Builder.Default
    private Boolean status = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
