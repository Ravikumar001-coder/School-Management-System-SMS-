package com.school.sms.model.hostel;

import com.school.sms.model.Branch;
import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mess_plans")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MessPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "plan_name", nullable = false, length = 100)
    private String planName;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    @Builder.Default
    private PlanType planType = PlanType.VEG;

    @Column(name = "daily_rate", nullable = false)
    private Double dailyRate;

    @Column(name = "monthly_rate", nullable = false)
    private Double monthlyRate;

    @Column(name = "breakfast_cost")
    @Builder.Default
    private Double breakfastCost = 0.0;

    @Column(name = "lunch_cost")
    @Builder.Default
    private Double lunchCost = 0.0;

    @Column(name = "dinner_cost")
    @Builder.Default
    private Double dinnerCost = 0.0;

    @Column(name = "snacks_cost")
    @Builder.Default
    private Double snacksCost = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "holiday_deduction_rule", nullable = false)
    @Builder.Default
    private HolidayDeductionRule holidayDeductionRule = HolidayDeductionRule.NO_REFUND;

    @Column(name = "refund_rule", columnDefinition = "TEXT")
    private String refundRule;

    @Column(name = "late_joining_rule", columnDefinition = "TEXT")
    private String lateJoiningRule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PlanStatus status = PlanStatus.ACTIVE;

    public enum PlanType {
        VEG, NON_VEG, SPECIAL
    }

    public enum HolidayDeductionRule {
        FULL_REFUND, NO_REFUND, PERCENTAGE
    }

    public enum PlanStatus {
        ACTIVE, INACTIVE
    }
}
