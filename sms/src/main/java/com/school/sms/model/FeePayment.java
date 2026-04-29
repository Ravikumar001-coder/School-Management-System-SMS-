// src/main/java/com/school/sms/model/FeePayment.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fee_payments")
public class FeePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "fee_structure_id")
    private FeeStructure feeStructure;

    private String receiptNumber;  // Auto-generated
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;  // CASH, ONLINE, CHEQUE
    private String transactionId;  // For online payments
    private String month;          // "January 2024"
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;  // PAID, PENDING, OVERDUE

    private String remarks;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (receiptNumber == null) {
            receiptNumber = "REC-" + System.currentTimeMillis();
        }
    }
}