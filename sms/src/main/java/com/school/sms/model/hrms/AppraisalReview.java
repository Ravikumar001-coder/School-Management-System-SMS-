package com.school.sms.model.hrms;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "appraisal_reviews")
public class AppraisalReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private AppraisalCycle cycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private Staff reviewer;

    @Column(name = "self_review", columnDefinition = "TEXT")
    private String selfReview;

    @Column(name = "manager_review", columnDefinition = "TEXT")
    private String managerReview;

    @Column(name = "final_score", precision = 5, scale = 2)
    private BigDecimal finalScore;

    @Column(name = "increment_percentage", precision = 5, scale = 2)
    private BigDecimal incrementPercentage;

    @Column(name = "promotion_recommendation")
    private Boolean promotionRecommendation = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReviewStatus status = ReviewStatus.PENDING_SELF;

    public enum ReviewStatus {
        PENDING_SELF, PENDING_MANAGER, COMPLETED
    }
}
