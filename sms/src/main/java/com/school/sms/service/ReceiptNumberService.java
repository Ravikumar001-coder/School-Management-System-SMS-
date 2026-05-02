package com.school.sms.service;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.ReceiptSequence;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.ReceiptSequenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Generates gap-free, duplicate-free structured receipt numbers.
 *
 * Format:  SCHOOL_CODE/YEAR/000001
 * Example: SMS/2024/000001
 *          SMS/2024/000002
 *          SMS/2025/000001  (new year = new counter)
 *
 * Concurrency guarantee:
 * The PESSIMISTIC_WRITE lock on ReceiptSequence ensures that under concurrent
 * payment submissions, each transaction gets a unique, strictly monotonic number.
 * No two threads can increment the same counter simultaneously.
 *
 * Usage (in FeeService):
 *   String receipt = receiptNumberService.nextReceiptNumber(academicYear);
 *   feePayment.setReceiptNumber(receipt);
 *   feePaymentRepository.save(feePayment);
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiptNumberService {

    private final ReceiptSequenceRepository receiptSequenceRepository;
    private final AcademicYearRepository academicYearRepository;

    /**
     * Generates the next receipt number for the active academic year.
     * Uses the active year automatically — call this overload in most cases.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextReceiptNumber() {
        AcademicYear activeYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new IllegalStateException(
                        "No active academic year found. Create and activate an academic year first."));
        return nextReceiptNumber(activeYear);
    }

    /**
     * Generates the next receipt number for a specific academic year.
     * Use this overload when the caller already has the AcademicYear entity.
     *
     * @param academicYear the year to generate the receipt number for
     * @return formatted string: SCHOOL_CODE/YEAR/XXXXXX
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextReceiptNumber(AcademicYear academicYear) {
        String schoolCode = academicYear.getSchoolCode();

        // Acquire PESSIMISTIC_WRITE lock — blocks concurrent transactions until this one commits
        ReceiptSequence sequence = receiptSequenceRepository
                .findLockedBySchoolCodeAndAcademicYear(schoolCode, academicYear)
                .orElseGet(() -> {
                    // First payment of this school+year combination — create the sequence row
                    log.info("Creating new receipt sequence for school={} year={}",
                            schoolCode, academicYear.getLabel());
                    return receiptSequenceRepository.save(
                            ReceiptSequence.builder()
                                    .schoolCode(schoolCode)
                                    .academicYear(academicYear)
                                    .lastSequence(0L)
                                    .build()
                    );
                });

        // Increment — this write is protected by the lock
        long nextSeq = sequence.getLastSequence() + 1;
        sequence.setLastSequence(nextSeq);
        receiptSequenceRepository.save(sequence);

        // Format: SMS/2024/000001 (6-digit zero-padded counter)
        String formatted = String.format("%s/%d/%06d",
                schoolCode,
                academicYear.getStartYear(),
                nextSeq);

        log.debug("Generated receipt number: {}", formatted);
        return formatted;
    }
}
