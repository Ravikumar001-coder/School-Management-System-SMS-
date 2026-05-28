// src/main/java/com/school/sms/service/AttendanceService.java

package com.school.sms.service;

import com.school.sms.dto.request.AttendanceRequest;
import com.school.sms.dto.request.BulkAttendanceRequest;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;
    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Map<String, Object> markBulkAttendance(BulkAttendanceRequest request) {
        ClassRoom classRoom = classRoomRepository.findById(request.getClassRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("ClassRoom", request.getClassRoomId()));

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", request.getSubjectId()));
        }

        AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new RuntimeException("No active academic year found"));

        // Get current user for audit
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).orElse(null);

        int updatedCount = 0;
        int createdCount = 0;

        for (AttendanceRequest attReq : request.getAttendanceList()) {
            Student student = studentRepository.findById(attReq.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", attReq.getStudentId()));

            Optional<Attendance> existingOpt = attendanceRepository
                    .findByStudentIdAndDateAndSubjectIdAndAcademicYearIdAndPeriodNumber(
                            student.getId(),
                            request.getDate(),
                            subject != null ? subject.getId() : null,
                            currentYear.getId(),
                            request.getPeriodNumber()
                    );

            if (existingOpt.isPresent()) {
                Attendance existing = existingOpt.get();
                AttendanceStatus oldStatus = existing.getStatus();
                existing.setStatus(attReq.getStatus());
                existing.setRemarks(attReq.getRemarks());
                attendanceRepository.save(existing);
                
                if (oldStatus != attReq.getStatus()) {
                    auditLogService.logUpdate("Attendance", existing.getId(), "status", 
                            oldStatus.name(), attReq.getStatus().name(), currentYear.getLabel());
                }
                updatedCount++;
            } else {
                Attendance attendance = Attendance.builder()
                        .student(student)
                        .classRoom(classRoom)
                        .subject(subject)
                        .periodNumber(request.getPeriodNumber())
                        .date(request.getDate())
                        .status(attReq.getStatus())
                        .remarks(attReq.getRemarks())
                        .academicYear(currentYear)
                        .branch(student.getBranch())
                        .markedBy(currentUser)
                        .build();

                Attendance saved = attendanceRepository.save(attendance);
                auditLogService.logCreate("Attendance", saved.getId(), 
                        "Marked " + attReq.getStatus() + " for student " + student.getFirstName(), 
                        currentYear.getLabel());
                createdCount++;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("created", createdCount);
        response.put("updated", updatedCount);
        response.put("total", request.getAttendanceList().size());
        return response;
    }

    public Map<String, Object> getStudentReport(Long studentId, LocalDate from, LocalDate to) {
        List<Attendance> records = attendanceRepository.findByStudentIdAndDateBetween(studentId, from, to);

        long present = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long absent = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
        long late = records.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
        long excused = records.stream().filter(a -> a.getStatus() == AttendanceStatus.EXCUSED).count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("present", present);
        summary.put("absent", absent);
        summary.put("late", late);
        summary.put("excused", excused);
        summary.put("totalDays", records.size());
        
        double percentage = records.isEmpty() ? 0 : (double) present / records.size() * 100;
        summary.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);

        Map<String, Object> result = new HashMap<>();
        result.put("records", records.stream().map(this::mapToResponse).collect(Collectors.toList()));
        result.put("summary", summary);
        return result;
    }

    public Map<String, Object> getClassAttendance(Long classId, LocalDate date, Long subjectId, Integer periodNumber) {
        List<Attendance> records = attendanceRepository.findByClassRoomIdAndDateAndSubjectIdAndPeriodNumber(
                classId, date, subjectId, periodNumber);
        
        Map<String, Object> result = new HashMap<>();
        result.put("date", date);
        result.put("classId", classId);
        result.put("subjectId", subjectId);
        result.put("periodNumber", periodNumber);
        result.put("records", records.stream().map(this::mapToResponse).collect(Collectors.toList()));
        return result;
    }

    private Map<String, Object> mapToResponse(Attendance a) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", a.getId());
        map.put("studentId", a.getStudent().getId());
        map.put("studentName", a.getStudent().getFirstName() + " " + a.getStudent().getLastName());
        map.put("date", a.getDate());
        map.put("status", a.getStatus());
        map.put("remarks", a.getRemarks());
        map.put("subject", a.getSubject() != null ? a.getSubject().getName() : null);
        map.put("periodNumber", a.getPeriodNumber());
        return map;
    }
}