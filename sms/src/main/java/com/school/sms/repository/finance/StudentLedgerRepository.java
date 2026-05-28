package com.school.sms.repository.finance;

import com.school.sms.model.finance.StudentLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentLedgerRepository extends JpaRepository<StudentLedger, Long> {
    Optional<StudentLedger> findByStudentIdAndAcademicYearId(Long studentId, Long academicYearId);
}
