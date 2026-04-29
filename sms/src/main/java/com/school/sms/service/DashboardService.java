// service/DashboardService.java
package com.school.sms.service;

import com.school.sms.dto.response.DashboardResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.Attendance;
import com.school.sms.model.AttendanceStatus;
import com.school.sms.model.Mark;
import com.school.sms.model.PaymentStatus;
import com.school.sms.model.Student;
import com.school.sms.model.StudentStatus;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository    studentRepository;
    private final TeacherRepository    teacherRepository;
    private final ClassRoomRepository  classRoomRepository;
    private final SubjectRepository    subjectRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeePaymentRepository feePaymentRepository;
        private final MarkRepository       markRepository;

    public DashboardResponse getAdminDashboard() {

        // Basic counts
        long totalStudents  = studentRepository.count();
        long totalTeachers  = teacherRepository.count();
        long totalClasses   = classRoomRepository.count();
        long totalSubjects  = subjectRepository.count();
        long activeStudents = studentRepository
                .countByStatus(StudentStatus.ACTIVE);

        // Today's attendance percentage
        LocalDate today = LocalDate.now();
        var todayAttendance = attendanceRepository.findByDate(today);
        long presentToday = todayAttendance.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();
        double attendancePct = todayAttendance.isEmpty() ? 0
                : Math.round((presentToday * 100.0 
                              / todayAttendance.size()) * 10.0) / 10.0;

        // Fee info
        Double pendingFees = feePaymentRepository.getTotalPendingFees();
        int    m = LocalDateTime.now().getMonthValue();
        int    y = LocalDateTime.now().getYear();
        Double monthlyCollection = feePaymentRepository
                .getMonthlyCollection(m, y);

        // Students per class
        Map<String, Long> studentsByClass = classRoomRepository
                .findAll().stream()
                .collect(Collectors.toMap(
                    c -> c.getName() + "-" + c.getSection(),
                    c -> studentRepository.countByClassRoomId(c.getId())
                ));

        // Attendance summary for today
        Map<String, Long> attendanceByStatus = Map.of(
            "PRESENT", presentToday,
            "ABSENT",  todayAttendance.size() - presentToday
        );

        return DashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalClasses(totalClasses)
                .totalSubjects(totalSubjects)
                .activeStudents(activeStudents)
                .todayAttendancePercentage(attendancePct)
                .totalPendingFees(pendingFees != null ? pendingFees : 0)
                .thisMonthCollection(
                    monthlyCollection != null ? monthlyCollection : 0)
                .studentsByClass(studentsByClass)
                .attendanceByStatus(attendanceByStatus)
                .build();
    }

    public Map<String, Object> getStudentDashboard(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Student", studentId));

        LocalDate startOfYear = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        LocalDate today = LocalDate.now();

        List<Attendance> attendance = attendanceRepository
                .findByStudentIdAndDateBetween(studentId, startOfYear, today);

        long totalDays = attendance.size();
        long presentDays = attendance.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();
        double attendancePct = totalDays > 0
                ? Math.round((presentDays * 100.0 / totalDays) * 10.0) / 10.0
                : 0.0;

        List<Mark> recentMarks = markRepository
                .findStudentMarksByYear(studentId, student.getAcademicYear());

        Double totalPaid = feePaymentRepository.getTotalPaidByStudent(studentId);
        long pendingFeesCount = feePaymentRepository
                .findByStudentIdAndStatus(studentId, PaymentStatus.PENDING)
                .size();

        return Map.of(
            "studentName", student.getFirstName() + " " + student.getLastName(),
            "studentId", student.getStudentId(),
            "className", student.getClassRoom() != null
                    ? student.getClassRoom().getName() + " - " + student.getClassRoom().getSection()
                    : "N/A",
            "attendancePercent", attendancePct,
            "presentDays", presentDays,
            "totalDays", totalDays,
            "totalExams", recentMarks.size(),
            "totalPaidFees", totalPaid != null ? totalPaid : 0.0,
            "pendingFeesCount", pendingFeesCount,
            "recentMarks", recentMarks.stream()
                    .limit(5)
                    .map(this::mapMark)
                    .collect(Collectors.toList())
        );
    }

    private Map<String, Object> mapMark(Mark mark) {
        return Map.of(
            "examName", mark.getExam().getName(),
            "subjectName", mark.getExam().getSubject() != null
                    ? mark.getExam().getSubject().getName()
                    : "N/A",
            "marksObtained", mark.getMarksObtained() != null ? mark.getMarksObtained() : 0,
            "totalMarks", mark.getTotalMarks() != null ? mark.getTotalMarks() : 0,
            "grade", mark.getGrade() != null ? mark.getGrade() : "N/A"
        );
    }
}