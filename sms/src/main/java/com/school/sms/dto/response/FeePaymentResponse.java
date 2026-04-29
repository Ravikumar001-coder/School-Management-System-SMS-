// dto/response/FeePaymentResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class FeePaymentResponse {
    private Long id;
    private String receiptNumber;
    private String studentName;
    private String studentCode;
    private String className;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String transactionId;
    private String month;
    private String remarks;
    private String status;
}