package com.school.sms.service.finance;

import com.school.sms.model.finance.PaymentTransaction;
import com.school.sms.repository.finance.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayIntegrationService {

    private final PaymentTransactionRepository transactionRepository;

    @Value("${razorpay.key.id:mock_key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:mock_key_secret}")
    private String razorpayKeySecret;

    /**
     * Creates an order in Razorpay and returns the order ID.
     */
    public String createOrder(BigDecimal amount, String currency, String receiptNo) {
        log.info("Creating Razorpay order for receipt: {}, amount: {}", receiptNo, amount);
        // MOCK IMPLEMENTATION: In production, use razorpayClient.orders.create(options)
        return "order_" + UUID.randomUUID().toString().substring(0, 10);
    }

    /**
     * Verifies the signature from Razorpay webhook/frontend callback.
     */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        log.info("Verifying Razorpay signature for order: {}", orderId);
        // MOCK IMPLEMENTATION: In production, use Utils.verifyPaymentSignature()
        return true; 
    }

    @Transactional
    public void handleSuccessfulPayment(String orderId, String paymentId, String signature) {
        PaymentTransaction tx = transactionRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found for order: " + orderId));
        
        if (verifySignature(orderId, paymentId, signature)) {
            tx.setInternalStatus(PaymentTransaction.InternalStatus.SUCCESS);
            tx.setRazorpayPaymentId(paymentId);
            tx.setRazorpaySignature(signature);
            tx.setPaidAt(java.time.LocalDateTime.now());
            transactionRepository.save(tx);
            log.info("Payment SUCCESS for order: {}", orderId);
            
            // Here we would call studentLedgerService.postCredit(...)
        } else {
            tx.setInternalStatus(PaymentTransaction.InternalStatus.FAILED);
            transactionRepository.save(tx);
            log.warn("Payment signature verification FAILED for order: {}", orderId);
        }
    }
}
