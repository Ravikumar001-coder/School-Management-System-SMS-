package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.MessBilling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessBillingRepository extends JpaRepository<MessBilling, Long> {
    List<MessBilling> findByAllocationId(Long allocationId);
    List<MessBilling> findByAllocationIdAndBillingMonthAndBillingYear(Long allocationId, Integer month, Integer year);
}
