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
 * Generates gap-free, duplicate-free structured identifiers (Receipts, Student IDs, Teacher IDs).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiptNumberService {

    private final ReceiptSequenceRepository receiptSequenceRepository;
    private final AcademicYearRepository academicYearRepository;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextReceiptNumber() {
        return nextReceiptNumber(getActiveYear());
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextReceiptNumber(AcademicYear academicYear) {
        long seq = getNextSequence(academicYear, ReceiptSequence.SequenceType.RECEIPT);
        return String.format("%s/%d/%06d", academicYear.getSchoolCode(), academicYear.getStartYear(), seq);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextStudentId() {
        return nextStudentId(getActiveYear());
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextStudentId(AcademicYear academicYear) {
        long seq = getNextSequence(academicYear, ReceiptSequence.SequenceType.STUDENT_ID);
        return String.format("STU-%d-%04d", academicYear.getStartYear(), seq);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String nextTeacherId() {
        AcademicYear academicYear = getActiveYear();
        long seq = getNextSequence(academicYear, ReceiptSequence.SequenceType.TEACHER_ID);
        return String.format("TCH-%d-%03d", academicYear.getStartYear(), seq);
    }

    private AcademicYear getActiveYear() {
        return academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new IllegalStateException("No active academic year found."));
    }

    private long getNextSequence(AcademicYear academicYear, ReceiptSequence.SequenceType type) {
        String schoolCode = academicYear.getSchoolCode();
        ReceiptSequence sequence = receiptSequenceRepository
                .findLocked(schoolCode, academicYear, type)
                .orElseGet(() -> receiptSequenceRepository.save(
                        ReceiptSequence.builder()
                                .schoolCode(schoolCode)
                                .academicYear(academicYear)
                                .sequenceType(type)
                                .lastSequence(0L)
                                .build()
                ));

        long nextSeq = sequence.getLastSequence() + 1;
        sequence.setLastSequence(nextSeq);
        receiptSequenceRepository.save(sequence);
        return nextSeq;
    }
}
