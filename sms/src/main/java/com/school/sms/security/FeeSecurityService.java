package com.school.sms.security;

import com.school.sms.model.FeePayment;
import com.school.sms.repository.FeePaymentRepository;
import com.school.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("feeSecurityService")
@RequiredArgsConstructor
public class FeeSecurityService {

    private final FeePaymentRepository feePaymentRepository;
    private final StudentRepository studentRepository;

    public boolean isOwnPayment(Long paymentId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return studentRepository.findByUser_UsernameOrUser_Email(username, username)
                .map(student -> {
                    FeePayment payment = feePaymentRepository.findById(paymentId).orElse(null);
                    return payment != null && payment.getStudent().getId().equals(student.getId());
                })
                .orElse(false);
    }
}
