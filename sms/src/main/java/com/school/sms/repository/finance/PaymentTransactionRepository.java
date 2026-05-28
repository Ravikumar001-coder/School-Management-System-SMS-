package com.school.sms.repository.finance;

import com.school.sms.model.finance.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTransactionNo(String transactionNo);
    Optional<PaymentTransaction> findByRazorpayOrderId(String razorpayOrderId);
}
