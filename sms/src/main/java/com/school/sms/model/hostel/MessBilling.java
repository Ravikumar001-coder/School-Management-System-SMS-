package com.school.sms.model.hostel;

import com.school.sms.model.User;
import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mess_billing")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MessBilling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocation_id", nullable = false)
    private HostelAllocation allocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private MessPlan plan;

    @Column(name = "billing_month", nullable = false)
    private Integer billingMonth;

    @Column(name = "billing_year", nullable = false)
    private Integer billingYear;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays;

    @Column(name = "absent_days", nullable = false)
    @Builder.Default
    private Integer absentDays = 0;

    @Column(name = "extra_charges")
    @Builder.Default
    private Double extraCharges = 0.0;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "holiday_deductions")
    @Builder.Default
    private Double holidayDeductions = 0.0;

    @Column(name = "fines")
    @Builder.Default
    private Double fines = 0.0;

    @Column(name = "amount_paid")
    @Builder.Default
    private Double amountPaid = 0.0;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by_id")
    private User generatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BillingStatus status = BillingStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum BillingStatus {
        PENDING, PARTIAL, PAID, OVERDUE, CANCELLED
    }
}
