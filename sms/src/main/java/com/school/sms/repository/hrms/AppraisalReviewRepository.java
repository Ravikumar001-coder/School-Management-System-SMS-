package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.AppraisalReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppraisalReviewRepository extends JpaRepository<AppraisalReview, Long> {
    List<AppraisalReview> findByCycleId(Long cycleId);
    List<AppraisalReview> findByStaffId(Long staffId);
    List<AppraisalReview> findByReviewerId(Long reviewerId);
}
