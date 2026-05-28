package com.school.sms.controller.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.AppraisalCycle;
import com.school.sms.model.hrms.AppraisalReview;
import com.school.sms.service.hrms.PerformanceReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hrms/performance")
@RequiredArgsConstructor
public class HrmsPerformanceController {

    private final PerformanceReviewService performanceService;

    @GetMapping("/cycles/active")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<List<AppraisalCycle>>> getActiveCycles() {
        return ResponseEntity.ok(performanceService.getActiveCycles());
    }

    @GetMapping("/cycles/{cycleId}/reviews")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<List<AppraisalReview>>> getReviews(@PathVariable Long cycleId) {
        return ResponseEntity.ok(performanceService.getReviewsForCycle(cycleId));
    }

    @PostMapping("/reviews/initiate")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<AppraisalReview>> initiateReview(
            @RequestParam Long cycleId,
            @RequestParam Long staffId,
            @RequestParam Long reviewerId) {
        return ResponseEntity.ok(performanceService.initiateReview(cycleId, staffId, reviewerId));
    }

    @PutMapping("/reviews/{reviewId}/manager")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<AppraisalReview>> submitManagerReview(
            @PathVariable Long reviewId,
            @RequestParam String reviewText,
            @RequestParam BigDecimal score,
            @RequestParam BigDecimal increment,
            @RequestParam Boolean promote) {
        return ResponseEntity.ok(performanceService.submitManagerReview(reviewId, reviewText, score, increment, promote));
    }
}
