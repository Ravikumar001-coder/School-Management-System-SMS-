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
import com.school.sms.model.AcademicYear;
import com.school.sms.model.ClassRoom;
import com.school.sms.model.Exam;
import com.school.sms.model.FeePayment;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final StudentRepository    studentRepository;
    private final TeacherRepository    teacherRepository;
    private final ClassRoomRepository  classRoomRepository;
    private final SubjectRepository    subjectRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final MarkRepository       markRepository;
    private final AcademicYearRepository academicYearRepository;
    
    private final DepartmentRepository departmentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final AcademicEventRepository academicEventRepository;
    private final ExamRepository examRepository;
    private final UserSessionRepository userSessionRepository;

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
        int    m = today.getMonthValue();
        int    y = today.getYear();
        LocalDate startDate = LocalDate.of(y, m, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        Double monthlyCollection = feePaymentRepository
                .getMonthlyCollection(startDate, endDate);

        AcademicYear activeYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElse(null);

        // Students per class (filtered by active year if exists)
        Map<String, Long> studentsByClass = classRoomRepository
                .findAll().stream()
                .filter(c -> activeYear == null || (c.getAcademicYear() != null && c.getAcademicYear().equals(activeYear)))
                .collect(Collectors.toMap(
                    c -> c.getName() + "-" + c.getSection(),
                    c -> studentRepository.countByClassRoomId(c.getId()),
                    (existing, replacement) -> existing // Merge function to handle rare duplicates
                ));

        // Attendance summary for today
        Map<String, Long> attendanceByStatus = Map.of(
            "PRESENT", presentToday,
            "ABSENT",  todayAttendance.size() - presentToday
        );

        // Real 6-month trends
        List<Map<String, Object>> trends = IntStream.range(0, 6)
                .mapToObj(i -> {
                    LocalDate d = today.minusMonths(5 - i);
                    LocalDate start = d.withDayOfMonth(1);
                    LocalDate end = d.withDayOfMonth(d.lengthOfMonth());
                    
                    Double revenue = feePaymentRepository.getMonthlyCollection(start, end);
                    long attCount = attendanceRepository.findByDateBetween(start, end).stream()
                            .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                            .count();
                            
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", d.getMonth().name().substring(0, 3));
                    map.put("revenue", revenue != null ? revenue : 0.0);
                    map.put("attendance", (double) attCount);
                    return map;
                }).collect(Collectors.toList());

        // Fetch Total Departments
        long totalDepartments = departmentRepository.count();

        // Fetch Enrollment By Department using optimized database grouping
        Map<String, Long> enrollmentByDepartment = studentRepository.countStudentsByDepartment()
                .stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1],
                        (v1, v2) -> v1
                ));

        // Fetch Recent Activity (Optimized: No more findAll().stream().limit())
        List<Map<String, Object>> recentActivity = activityLogRepository.findTop10ByOrderByTimestampDesc().stream()
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("user", log.getUser() != null ? log.getUser() : "System");
                    map.put("avatar", log.getAvatar() != null ? log.getAvatar() : "S");
                    map.put("message", log.getMessage() != null ? log.getMessage() : "");
                    map.put("timestamp", log.getTimestamp() != null ? formatRelativeTime(log.getTimestamp()) : "");
                    map.put("isSystem", "System".equals(log.getUser()));
                    return map;
                }).collect(Collectors.toList());

        // Fetch Upcoming Deadlines (Optimized: No more findAll().stream().limit())
        List<Map<String, Object>> upcomingDeadlines = academicEventRepository.findTop5ByOrderByLastDateAsc().stream()
                .map(event -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("title", event.getTitle() != null ? event.getTitle() : "");
                    map.put("lastDate", event.getLastDate() != null ? event.getLastDate().toString() : "");
                    map.put("deadlineText", event.getDeadlineText() != null ? event.getDeadlineText() : "");
                    return map;
                }).collect(Collectors.toList());

        // Fetch Active Sessions Count
        long activeSessionsCount = userSessionRepository.findByActiveTrue().size();

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
                .totalDepartments(totalDepartments)
                .trends(trends)
                .enrollmentByDepartment(enrollmentByDepartment)
                .recentActivity(recentActivity)
                .upcomingDeadlines(upcomingDeadlines)
                .activeSessionsCount(activeSessionsCount)
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

        List<FeePayment> payments = feePaymentRepository.findByStudentId(studentId);
        Double totalPaid = feePaymentRepository.getTotalPaidByStudent(studentId);
        long pendingFeesCount = feePaymentRepository
                .findByStudentIdAndStatus(studentId, PaymentStatus.PENDING)
                .size();

        List<Exam> upcomingExams = List.of();
        if (student.getClassRoom() != null) {
            upcomingExams = examRepository.findByClassRoomId(student.getClassRoom().getId()).stream()
                    .filter(e -> e.getExamDate() != null && e.getExamDate().isAfter(LocalDate.now().minusDays(1)))
                    .sorted((a, b) -> a.getExamDate().compareTo(b.getExamDate()))
                    .limit(5)
                    .collect(Collectors.toList());
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("studentName", student.getFirstName() + " " + student.getLastName());
        response.put("studentId", student.getStudentId());
        response.put("className", student.getClassRoom() != null
                ? student.getClassRoom().getName() + " - " + student.getClassRoom().getSection()
                : "N/A");
        response.put("attendancePercent", attendancePct);
        response.put("presentDays", presentDays);
        response.put("totalDays", totalDays);
        response.put("totalExams", recentMarks.size());
        response.put("totalPaidFees", totalPaid != null ? totalPaid : 0.0);
        response.put("pendingFeesCount", pendingFeesCount);
        response.put("recentMarks", recentMarks.stream()
                .limit(5)
                .map(this::mapMark)
                .collect(Collectors.toList()));
        response.put("upcomingExams", upcomingExams.stream().map(e -> Map.of(
                "name", e.getName(),
                "examDate", e.getExamDate().toString(),
                "subjectName", e.getSubject() != null ? e.getSubject().getName() : "General"
        )).collect(Collectors.toList()));
        response.put("payments", payments.stream().limit(5).map(p -> Map.of(
                "month", p.getMonth() != null ? p.getMonth() : "Fee Payment",
                "dueDate", p.getPaymentDate() != null ? p.getPaymentDate().toString() : "",
                "amount", p.getAmount(),
                "status", p.getStatus().toString()
        )).collect(Collectors.toList()));

        return response;
    }

    public Map<String, Object> getTeacherDashboard(Long teacherId) {
        List<ClassRoom> assignedClasses = classRoomRepository.findByClassTeacherId(teacherId);
        List<Long> classIds = assignedClasses.stream().map(ClassRoom::getId).collect(Collectors.toList());
        
        long totalStudents = studentRepository.findAll().stream()
                .filter(s -> s.getClassRoom() != null && classIds.contains(s.getClassRoom().getId()))
                .count();

        List<Exam> exams = examRepository.findByClassRoomIdIn(classIds);

        // Attendance rate for their classes (Today)
        LocalDate today = LocalDate.now();
        List<Attendance> todayAttendance = attendanceRepository.findByDate(today).stream()
                .filter(a -> a.getStudent() != null && a.getStudent().getClassRoom() != null && classIds.contains(a.getStudent().getClassRoom().getId()))
                .collect(Collectors.toList());
        
        long present = todayAttendance.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        double attendanceRate = todayAttendance.isEmpty() ? 0 : Math.round((present * 100.0 / todayAttendance.size()));

        return Map.of(
            "totalStudents", totalStudents,
            "assignedClassesCount", assignedClasses.size(),
            "attendanceRate", attendanceRate,
            "upcomingExamsCount", exams.stream().filter(e -> e.getExamDate() != null && e.getExamDate().isAfter(today.minusDays(1))).count(),
            "assignedClasses", assignedClasses.stream().map(c -> Map.of("id", c.getId(), "name", c.getName(), "section", c.getSection())).collect(Collectors.toList()),
            "exams", exams.stream()
                    .filter(e -> e.getExamDate() != null && e.getExamDate().isAfter(today.minusDays(1)))
                    .limit(5)
                    .map(e -> Map.of(
                        "id", e.getId(),
                        "name", e.getName(),
                        "examDate", e.getExamDate().toString(),
                        "subjectName", e.getSubject() != null ? e.getSubject().getName() : "N/A",
                        "className", e.getClassRoom() != null ? e.getClassRoom().getName() + " " + e.getClassRoom().getSection() : "N/A"
                    )).collect(Collectors.toList())
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

    private String formatRelativeTime(LocalDateTime time) {
        java.time.Duration duration = java.time.Duration.between(time, LocalDateTime.now());
        long hours = duration.toHours();
        if (hours < 1) return duration.toMinutes() + "m ago";
        if (hours < 24) return hours + "h ago";
        return duration.toDays() + "d ago";
    }
}