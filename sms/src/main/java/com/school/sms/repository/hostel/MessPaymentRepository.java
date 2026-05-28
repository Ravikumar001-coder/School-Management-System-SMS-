package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.MessPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessPaymentRepository extends JpaRepository<MessPayment, Long> {
    List<MessPayment> findByBillId(Long billId);
}
