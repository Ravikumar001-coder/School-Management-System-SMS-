package com.school.sms.service.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.AppraisalCycle;
import com.school.sms.model.hrms.AppraisalReview;
import com.school.sms.model.hrms.Staff;
import com.school.sms.repository.hrms.AppraisalCycleRepository;
import com.school.sms.repository.hrms.AppraisalReviewRepository;
import com.school.sms.repository.hrms.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceReviewService {

    private final AppraisalCycleRepository cycleRepository;
    private final AppraisalReviewRepository reviewRepository;
    private final StaffRepository staffRepository;

    public ApiResponse<List<AppraisalCycle>> getActiveCycles() {
        return ApiResponse.success("Fetched active cycles", cycleRepository.findByStatus(AppraisalCycle.CycleStatus.ACTIVE));
    }

    public ApiResponse<List<AppraisalReview>> getReviewsForCycle(Long cycleId) {
        return ApiResponse.success("Fetched reviews", reviewRepository.findByCycleId(cycleId));
    }

    @Transactional
    public ApiResponse<AppraisalReview> initiateReview(Long cycleId, Long staffId, Long reviewerId) {
        AppraisalCycle cycle = cycleRepository.findById(cycleId).orElseThrow();
        Staff staff = staffRepository.findById(staffId).orElseThrow();
        Staff reviewer = staffRepository.findById(reviewerId).orElseThrow();

        AppraisalReview review = new AppraisalReview();
        review.setCycle(cycle);
        review.setStaff(staff);
        review.setReviewer(reviewer);
        review.setStatus(AppraisalReview.ReviewStatus.PENDING_SELF);

        return ApiResponse.success("Review initiated", reviewRepository.save(review));
    }

    @Transactional
    public ApiResponse<AppraisalReview> submitManagerReview(Long reviewId, String reviewText, BigDecimal score, BigDecimal increment, Boolean promote) {
        AppraisalReview review = reviewRepository.findById(reviewId).orElseThrow();
        review.setManagerReview(reviewText);
        review.setFinalScore(score);
        review.setIncrementPercentage(increment);
        review.setPromotionRecommendation(promote);
        review.setStatus(AppraisalReview.ReviewStatus.COMPLETED);
        
        return ApiResponse.success("Review completed", reviewRepository.save(review));
    }
}
