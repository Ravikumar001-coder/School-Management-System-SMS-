package com.school.sms.service;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.ReceiptSequence;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.ReceiptSequenceRepository;
import com.school.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Generates gap-free, duplicate-free structured identifiers (Receipts, Student IDs, Teacher IDs).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiptNumberService {

    private final ReceiptSequenceRepository receiptSequenceRepository;
    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;
    private ReceiptNumberService self;

    @org.springframework.beans.factory.annotation.Autowired
    public void setSelf(@org.springframework.context.annotation.Lazy ReceiptNumberService self) {
        this.self = self;
    }

    @Transactional
    public String nextReceiptNumber() {
        return nextReceiptNumber(getActiveYear());
    }

    @Transactional
    public String nextReceiptNumber(AcademicYear academicYear) {
        long seq = getNextSequence(academicYear, ReceiptSequence.SequenceType.RECEIPT);
        return String.format("%s/%d/%06d", academicYear.getSchoolCode(), academicYear.getStartYear(), seq);
    }

    @Transactional
    public String nextStudentId() {
        return nextStudentId(getActiveYear());
    }

    @Transactional
    public String nextStudentId(AcademicYear academicYear) {
        String studentId;
        int attempts = 0;
        do {
            long seq = getNextSequence(academicYear, ReceiptSequence.SequenceType.STUDENT_ID);
            studentId = String.format("STU-%d-%04d", academicYear.getStartYear(), seq);
            attempts++;
            if (attempts > 1) {
                log.warn("Collision detected for ID {}. Incrementing sequence (Attempt {})", studentId, attempts);
            }
        } while (userRepository.existsByUsername(studentId));
        return studentId;
    }

    @Transactional
    public String nextTeacherId() {
        AcademicYear academicYear = getActiveYear();
        String teacherId;
        int attempts = 0;
        do {
            long seq = getNextSequence(academicYear, ReceiptSequence.SequenceType.TEACHER_ID);
            teacherId = String.format("TCH-%d-%03d", academicYear.getStartYear(), seq);
            attempts++;
            if (attempts > 1) {
                log.warn("Collision detected for Teacher ID {}. Incrementing sequence (Attempt {})", teacherId, attempts);
            }
        } while (userRepository.existsByUsername(teacherId));
        return teacherId;
    }

    private AcademicYear getActiveYear() {
        return academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new IllegalStateException("No active academic year found."));
    }

    private long getNextSequence(AcademicYear academicYear, ReceiptSequence.SequenceType type) {
        String schoolCode = academicYear.getSchoolCode();
        
        // 1. Get or create the sequence record safely
        ReceiptSequence sequence = self.getOrCreateSequence(schoolCode, academicYear, type);
        
        // 2. Increment the sequence (this happens in the main transaction with a pessimistic lock)
        long nextSeq = sequence.getLastSequence() + 1;
        sequence.setLastSequence(nextSeq);
        receiptSequenceRepository.save(sequence);
        
        log.info("Generated sequence {} for type {} in school {}", nextSeq, type, schoolCode);
        return nextSeq;
    }

    /**
     * Safely retrieves an existing sequence or creates a new one.
     * Uses pessimistic locking for retrieval and handles concurrent insertion races.
     */
    @Transactional
    public ReceiptSequence getOrCreateSequence(String schoolCode, AcademicYear academicYear, ReceiptSequence.SequenceType type) {
        // 1. Try to find existing record WITHOUT a lock first
        // This avoids creating a gap lock if the record doesn't exist,
        // which would deadlock with the REQUIRES_NEW transaction below.
        Optional<ReceiptSequence> existing = receiptSequenceRepository
                .findBySchoolCodeAndAcademicYearAndSequenceType(schoolCode, academicYear, type);
        
        if (existing.isEmpty()) {
            // 2. Not found, try to initialize it in a separate transaction
            try {
                self.initializeSequence(schoolCode, academicYear, type);
                log.info("New sequence created for type {} in school {}", type, schoolCode);
            } catch (Exception e) {
                log.warn("Duplicate sequence initialization race handled safely for type {} in school {}", type, schoolCode);
            }
        }
        
        // 3. Now we are sure it exists (or will be found), get it with a lock
        return receiptSequenceRepository
                .findBySchoolCodeAndAcademicYearAndSequenceTypeForUpdate(schoolCode, academicYear, type)
                .orElseThrow(() -> new RuntimeException("Fatal: Sequence record unavailable after initialization attempt for " + type));
    }

    /**
     * Initializes a sequence record in a separate transaction.
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void initializeSequence(String schoolCode, AcademicYear academicYear, ReceiptSequence.SequenceType type) {
        long lastSeq = 0L;
        
        // Forensic scan for legacy records to prevent duplicate IDs
        if (type == ReceiptSequence.SequenceType.STUDENT_ID || type == ReceiptSequence.SequenceType.TEACHER_ID) {
            String prefix = (type == ReceiptSequence.SequenceType.STUDENT_ID) 
                    ? String.format("STU-%d-", academicYear.getStartYear())
                    : String.format("TCH-%d-", academicYear.getStartYear());
            
            Long maxExisting = userRepository.findMaxSequenceByPrefix(prefix, prefix.length());
            if (maxExisting != null) {
                lastSeq = maxExisting;
                log.info("Forensic repair: Found existing max {} for prefix {}. Initializing sequence to {}", 
                        maxExisting, prefix, lastSeq);
            }
        }

        receiptSequenceRepository.saveAndFlush(
                ReceiptSequence.builder()
                        .schoolCode(schoolCode)
                        .academicYear(academicYear)
                        .sequenceType(type)
                        .lastSequence(lastSeq)
                        .build()
        );
    }
}
