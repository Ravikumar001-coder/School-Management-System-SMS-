// service/AttendanceService.java
package com.school.sms.service;

import com.school.sms.dto.request.BulkAttendanceRequest;
import com.school.sms.dto.response.AttendanceResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository    studentRepository;
    private final ClassRoomRepository  classRoomRepository;
    private final SubjectRepository    subjectRepository;
    private final AcademicYearRepository academicYearRepository;

    // Mark attendance for whole class at once
    @Transactional
    public Map<String, Object> markBulkAttendance(
            BulkAttendanceRequest request) {

        ClassRoom classRoom = classRoomRepository
                .findById(request.getClassRoomId())
                .orElseThrow(() -> 
                    new ResourceNotFoundException(
                        "ClassRoom", request.getClassRoomId()));

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository
                    .findById(request.getSubjectId())
                    .orElse(null);
        }

        int saved  = 0;
        int skipped = 0;

        for (var item : request.getAttendanceList()) {

            // Skip if already marked
            boolean alreadyMarked = (subject != null)
                ? attendanceRepository
                    .existsByStudentIdAndDateAndSubjectId(
                        item.getStudentId(),
                        request.getDate(),
                        subject.getId())
                : attendanceRepository
                    .existsByStudentIdAndDate(
                        item.getStudentId(), request.getDate());

            if (alreadyMarked) { skipped++; continue; }

            Student student = studentRepository
                    .findById(item.getStudentId())
                    .orElse(null);
            if (student == null) { skipped++; continue; }

            AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                    .orElseThrow(() -> new ResourceNotFoundException("Active Academic Year", "status", "active"));

            Attendance attendance = Attendance.builder()
                    .student(student)
                    .classRoom(classRoom)
                    .subject(subject)
                    .date(request.getDate())
                    .status(item.getStatus())
                    .remarks(item.getRemarks())
                    .academicYear(currentYear)
                    .build();

            attendanceRepository.save(attendance);
            saved++;
        }

        return Map.of(
            "message", "Attendance processed",
            "saved",   saved,
            "skipped", skipped,
            "date",    request.getDate()
        );
    }

    // Student's attendance report
    public Map<String, Object> getStudentReport(
            Long studentId, LocalDate from, LocalDate to) {

        studentRepository.findById(studentId)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Student", studentId));

        List<Attendance> records = attendanceRepository
                .findByStudentIdAndDateBetween(studentId, from, to);

        long total   = records.size();
        long present = records.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();
        long absent  = records.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .count();
        long late    = records.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.LATE)
                .count();

        double pct = total > 0 
                ? Math.round((present * 100.0 / total) * 100.0) / 100.0
                : 0.0;

        return Map.of(
            "studentId",  studentId,
            "fromDate",   from,
            "toDate",     to,
            "totalDays",  total,
            "present",    present,
            "absent",     absent,
            "late",       late,
            "percentage", pct,
            "records",    records.stream()
                                 .map(this::mapToResponse)
                                 .collect(Collectors.toList())
        );
    }

    // Class attendance for a specific date
    public Map<String, Object> getClassAttendance(
            Long classId, LocalDate date) {

        List<Attendance> records = attendanceRepository
                .findByClassRoomIdAndDate(classId, date);

        long present = records.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();
        long absent  = records.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .count();

        return Map.of(
            "classId",  classId,
            "date",     date,
            "total",    records.size(),
            "present",  present,
            "absent",   absent,
            "records",  records.stream()
                               .map(this::mapToResponse)
                               .collect(Collectors.toList())
        );
    }

    // ── Helpers ──────────────────────────────────────
    private AttendanceResponse mapToResponse(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .studentName(a.getStudent().getFirstName() 
                             + " " + a.getStudent().getLastName())
                .studentId(a.getStudent().getStudentId())
                .date(a.getDate())
                .status(a.getStatus().name())
                .subjectName(a.getSubject() != null 
                             ? a.getSubject().getName() : null)
                .remarks(a.getRemarks())
                .build();
    }
}