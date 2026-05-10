package com.school.sms.repository;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.ReceiptSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReceiptSequenceRepository extends JpaRepository<ReceiptSequence, Long> {

    /**
     * Acquires a PESSIMISTIC_WRITE lock on the sequence row.
     *
     * This ensures only one transaction can increment the counter at a time,
     * preventing duplicate or out-of-order receipt numbers under concurrent load.
     * The lock is released when the enclosing @Transactional method completes.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rs FROM ReceiptSequence rs WHERE rs.schoolCode = :schoolCode AND rs.academicYear = :academicYear AND rs.sequenceType = :type")
    Optional<ReceiptSequence> findLocked(String schoolCode, AcademicYear academicYear, ReceiptSequence.SequenceType type);
}
