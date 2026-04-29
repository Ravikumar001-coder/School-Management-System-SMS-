package com.school.sms.repository;

import com.school.sms.model.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeRepository extends JpaRepository<FeePayment, Long> {
}
