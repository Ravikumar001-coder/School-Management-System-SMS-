package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.PayrollRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRunRepository extends JpaRepository<PayrollRun, Long> {
    List<PayrollRun> findByPayrollMonthAndPayrollYear(Integer month, Integer year);
}
