package com.school.sms.controller.finance;

import com.school.sms.service.finance.RazorpayIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/finance/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayIntegrationService razorpayIntegrationService;

    @PostMapping("/webhook/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(@RequestBody Map<String, Object> payload, 
                                                        @RequestHeader("X-Razorpay-Signature") String signature) {
        // Parse payload, get event type, order_id, payment_id
        // For 'payment.captured' event:
        // razorpayIntegrationService.handleSuccessfulPayment(orderId, paymentId, signature);
        
        return ResponseEntity.ok("Webhook received");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        String orderId = request.get("razorpay_order_id");
        String paymentId = request.get("razorpay_payment_id");
        String signature = request.get("razorpay_signature");

        razorpayIntegrationService.handleSuccessfulPayment(orderId, paymentId, signature);
        return ResponseEntity.ok(Map.of("status", "SUCCESS"));
    }
}
