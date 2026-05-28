package com.school.sms.service.hostel;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.Branch;
import com.school.sms.model.Student;
import com.school.sms.model.User;
import com.school.sms.model.hostel.*;
import com.school.sms.repository.BranchRepository;
import com.school.sms.repository.StudentRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.hostel.*;
import com.school.sms.service.hostel.event.NightAbsenceEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HostelAttendanceService {

    private final HostelAttendanceRepository attendanceRepository;
    private final HostelAttendanceLogRepository logRepository;
    private final BranchRepository branchRepository;
    private final HostelBlockRepository blockRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public HostelAttendance createAttendanceSession(Long branchId, Long blockId, LocalDate date, HostelAttendance.AttendanceType type, Long markedById) {
        // Check if already exists
        attendanceRepository.findByBlockIdAndDateAndAttendanceType(blockId, date, type)
                .ifPresent(a -> {
                    throw new IllegalStateException("Attendance session already exists for this block on this date and type");
                });

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        HostelBlock block = blockRepository.findById(blockId)
                .orElseThrow(() -> new ResourceNotFoundException("Block not found"));
        User markedBy = userRepository.findById(markedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        HostelAttendance attendance = HostelAttendance.builder()
                .branch(branch)
                .block(block)
                .date(date)
                .attendanceType(type)
                .markedBy(markedBy)
                .build();

        return attendanceRepository.save(attendance);
    }

    public HostelAttendanceLog markStudentAttendance(Long attendanceId, Long studentId, Long bedId, HostelAttendanceLog.AttendanceStatus status, String remarks) {
        HostelAttendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance session not found"));
        
        HostelAttendanceLog logEntry = HostelAttendanceLog.builder()
                .attendance(attendance)
                .student(Student.builder().id(studentId).build())
                .bed(bedId != null ? HostelBed.builder().id(bedId).build() : null)
                .status(status)
                .remarks(remarks)
                .checkInTime(status == HostelAttendanceLog.AttendanceStatus.PRESENT ? LocalDateTime.now() : null)
                .build();

        HostelAttendanceLog savedLog = logRepository.save(logEntry);

        // Night Absence Notification Trigger (Async Event)
        if (attendance.getAttendanceType() == HostelAttendance.AttendanceType.NIGHT && status == HostelAttendanceLog.AttendanceStatus.ABSENT) {
            eventPublisher.publishEvent(new NightAbsenceEvent(studentId, attendance.getDate()));
        }

        return savedLog;
    }
}
