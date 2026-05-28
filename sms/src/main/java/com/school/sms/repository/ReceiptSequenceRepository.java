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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rs FROM ReceiptSequence rs WHERE rs.schoolCode = :schoolCode AND rs.academicYear = :academicYear AND rs.sequenceType = :type")
    Optional<ReceiptSequence> findBySchoolCodeAndAcademicYearAndSequenceTypeForUpdate(
        String schoolCode, 
        AcademicYear academicYear, 
        ReceiptSequence.SequenceType type
    );

    Optional<ReceiptSequence> findBySchoolCodeAndAcademicYearAndSequenceType(String schoolCode, AcademicYear academicYear, ReceiptSequence.SequenceType type);
}
