package com.school.sms.service.admin;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.ClassRoom;
import com.school.sms.model.Student;
import com.school.sms.model.User;
import com.school.sms.model.admin.PromotionLog;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.ClassRoomRepository;
import com.school.sms.repository.StudentRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.admin.PromotionLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentPromotionService {

    private final StudentRepository studentRepository;
    private final PromotionLogRepository promotionLogRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;

    /**
     * Execute a bulk promotion of students:
     * - promotedStudentIds → moved to targetClass in targetYear
     * - failedStudentIds   → kept in sourceClass but moved to targetYear (repeat)
     * - Logs the full operation in promotion_logs table.
     */
    @Transactional
    public PromotionLog executeBulkPromotion(
            Long sourceClassId,
            Long targetClassId,
            Long sourceYearId,
            Long targetYearId,
            List<Long> promotedStudentIds,
            List<Long> failedStudentIds,
            Long adminId) {

        log.info("Executing bulk promotion from class {} → {} (year {} → {})",
                sourceClassId, targetClassId, sourceYearId, targetYearId);

        ClassRoom sourceClass  = classRoomRepository.findById(sourceClassId)
                .orElseThrow(() -> new IllegalArgumentException("Source class not found: " + sourceClassId));
        ClassRoom targetClass  = classRoomRepository.findById(targetClassId)
                .orElseThrow(() -> new IllegalArgumentException("Target class not found: " + targetClassId));
        AcademicYear sourceYear = academicYearRepository.findById(sourceYearId)
                .orElseThrow(() -> new IllegalArgumentException("Source academic year not found: " + sourceYearId));
        AcademicYear targetYear = academicYearRepository.findById(targetYearId)
                .orElseThrow(() -> new IllegalArgumentException("Target academic year not found: " + targetYearId));

        int promotedCount = 0;
        int failedCount   = 0;

        // ── Promote selected students: change class + year ─────────────────
        for (Long sId : promotedStudentIds) {
            studentRepository.findById(sId).ifPresent(student -> {
                student.setPromotedFromClassroomId(student.getClassRoom() != null ? student.getClassRoom().getId() : null);
                student.setClassRoom(targetClass);
                student.setAcademicYear(targetYear);
                studentRepository.save(student);
            });
            promotedCount++;
        }

        // ── Detained students: stay in source class but advance year ───────
        for (Long sId : failedStudentIds) {
            studentRepository.findById(sId).ifPresent(student -> {
                student.setAcademicYear(targetYear);
                // classRoom stays the same (retained)
                studentRepository.save(student);
            });
            failedCount++;
        }

        // ── Build and persist the audit log ───────────────────────────────
        User admin = userRepository.findById(adminId).orElse(null);

        PromotionLog logEntry = PromotionLog.builder()
                .sourceClass(sourceClass)
                .targetClass(targetClass)
                .sourceAcademicYear(sourceYear)
                .targetAcademicYear(targetYear)
                .totalStudents(promotedCount + failedCount)
                .promotedCount(promotedCount)
                .failedCount(failedCount)
                .executedBy(admin)
                .build();

        return promotionLogRepository.save(logEntry);
    }

    /** Return the full promotion history in reverse chronological order */
    public List<PromotionLog> getPromotionHistory() {
        return promotionLogRepository.findAll();
    }
}
