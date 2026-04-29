// dto/request/FeePaymentRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FeePaymentRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private Long feeStructureId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    private LocalDate paymentDate;

    private String paymentMethod;

    private String transactionId;

    private String month;

    private String remarks;
}