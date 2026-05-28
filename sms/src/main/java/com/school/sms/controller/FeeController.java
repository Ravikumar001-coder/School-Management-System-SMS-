// controller/FeeController.java
package com.school.sms.controller;

import com.school.sms.dto.request.FeePaymentRequest;
import com.school.sms.dto.response.*;
import com.school.sms.model.FeePayment;
import com.school.sms.repository.FeePaymentRepository;
import com.school.sms.service.FeeService;
import com.school.sms.service.DocumentGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;
    private final DocumentGenerationService documentGenerationService;
    private final FeePaymentRepository feePaymentRepository;

    // Collect payment
    @PostMapping("/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<FeePaymentResponse>> pay(
            @Valid @RequestBody FeePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                    "Payment recorded",
                    feeService.collectPayment(request)));
    }

    // Student payment history
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN') or " +
                  "(hasRole('STUDENT') and @studentSecurityService.isOwnId(#studentId))")
    public ResponseEntity<ApiResponse<List<FeePaymentResponse>>> studentFees(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Student payments",
            feeService.getStudentPayments(studentId)));
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<FeePaymentResponse>> byId(
            @PathVariable Long paymentId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Fee payment",
            feeService.getPaymentById(paymentId)));
    }

    // PDF Download
    @GetMapping("/{paymentId}/receipt")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN') or " +
                  "(hasRole('STUDENT') and @feeSecurityService.isOwnPayment(#paymentId))")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long paymentId) {
        try {
            FeePayment payment = feePaymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            byte[] pdfBytes = documentGenerationService.generateFeeReceiptPdf(payment);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename("receipt_" + payment.getReceiptNumber() + ".pdf").build());
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Student fee summary
    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN') or " +
                  "(hasRole('STUDENT') and @studentSecurityService.isOwnId(#studentId))")
    public ResponseEntity<ApiResponse<Map<String, Object>>> summary(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Fee summary",
            feeService.getStudentFeeSummary(studentId)));
    }

    // Pending fees list
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<FeePaymentResponse>>> pending() {
        return ResponseEntity.ok(ApiResponse.success(
            "Pending fees",
            feeService.getPendingFees()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<FeePaymentResponse>>> all() {
        return ResponseEntity.ok(ApiResponse.success(
            "All fee payments",
            feeService.getAllPayments()));
    }

    // Monthly report
    @GetMapping("/report/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> monthly(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(
            "Monthly report",
            feeService.getMonthlyReport(month, year)));
    }
}