// repository/FeePaymentRepository.java
package com.school.sms.repository;

import com.school.sms.model.FeePayment;
import com.school.sms.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeePaymentRepository 
        extends JpaRepository<FeePayment, Long> {

    List<FeePayment> findByStudentId(Long studentId);

    List<FeePayment> findByStatus(PaymentStatus status);

    List<FeePayment> findByStudentIdAndStatus(
        Long studentId, PaymentStatus status);

    // Total paid by student
    @Query("SELECT SUM(f.amount) FROM FeePayment f " +
           "WHERE f.student.id = :studentId " +
           "AND f.status = 'PAID'")
    Double getTotalPaidByStudent(Long studentId);

    // Total pending fees
    @Query("SELECT SUM(f.amount) FROM FeePayment f " +
           "WHERE f.status = 'PENDING'")
    Double getTotalPendingFees();

    // Monthly collection
    @Query("SELECT SUM(f.amount) FROM FeePayment f " +
           "WHERE f.status = 'PAID' " +
           "AND MONTH(f.paymentDate) = :month " +
           "AND YEAR(f.paymentDate)  = :year")
    Double getMonthlyCollection(int month, int year);

    boolean existsByReceiptNumber(String receiptNumber);
}