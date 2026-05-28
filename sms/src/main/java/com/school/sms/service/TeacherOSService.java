package com.school.sms.service;

import com.school.sms.dto.request.DiaryEntryRequest;
import com.school.sms.dto.response.TimetableResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherOSService {

    private final TimetableRepository timetableRepository;
    private final ClassDiaryRepository classDiaryRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AcademicYearRepository academicYearRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExamRepository examRepository;
    private final MarkRepository markRepository;
    private final StudentRepository studentRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final TeacherAnalyticsService teacherAnalyticsService;
    private final StudyMaterialRepository studyMaterialRepository;

    public List<TimetableResponse> getTeacherTimetableByUser(Long userId, String day) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        return getTeacherTimetable(teacher.getId(), day);
    }

    public List<TimetableResponse> getTeacherTimetable(Long teacherId, String day) {
        return timetableRepository.findByTeacherIdAndDayOfWeekOrderByPeriodNumber(teacherId, day)
                .stream()
                .map(t -> TimetableResponse.builder()
                        .id(t.getId())
                        .period(t.getPeriodNumber())
                        .startTime(t.getStartTime().toString())
                        .endTime(t.getEndTime().toString())
                        .subject(t.getSubject().getName())
                        .className(t.getClassRoom().getName())
                        .room(t.getRoomNumber())
                        .isBreak(false)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveDiaryEntry(Long userId, DiaryEntryRequest request) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found for user"));
        
        ClassRoom classRoom = classRoomRepository.findById(request.getClassRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("ClassRoom", request.getClassRoomId()));
        
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", request.getSubjectId()));
        
        AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        ClassDiary entry = ClassDiary.builder()
                .teacher(teacher)
                .classRoom(classRoom)
                .subject(subject)
                .entryDate(request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now())
                .periodNumber(request.getPeriodNumber())
                .topicsCovered(request.getTopicsCovered())
                .homeworkAssigned(request.getHomeworkAssigned())
                .behaviorNote(request.getBehaviorNote())
                .announcements(request.getAnnouncements())
                .resourcesUsed(request.getResourcesUsed())
                .academicYear(currentYear)
                .branch(teacher.getBranch())
                .build();

        classDiaryRepository.save(entry);
    }

    public Map<String, Object> getDashboardStatsByUser(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        return getDashboardStats(teacher.getId());
    }

    public Map<String, Object> getDashboardStats(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));
        Long userId = teacher.getUser().getId();

        // 1. Identify Classes Taught by this Teacher (Subjects OR Class Teacher)
        List<Subject> subjects = subjectRepository.findByAssignedTeacherId(teacherId);
        Set<Long> classIdsSet = subjects.stream()
                .filter(s -> s.getClassRoom() != null)
                .map(s -> s.getClassRoom().getId())
                .collect(Collectors.toSet());
        
        List<ClassRoom> classTeacherRooms = classRoomRepository.findByClassTeacherId(teacherId);
        classTeacherRooms.forEach(c -> classIdsSet.add(c.getId()));
        
        List<Long> classIds = new ArrayList<>(classIdsSet);

        // 2. Total Students in those classes
        long totalStudents = 0;
        if (!classIds.isEmpty()) {
            totalStudents = studentRepository.findAll().stream()
                    .filter(s -> s.getClassRoom() != null && classIds.contains(s.getClassRoom().getId()))
                    .count();
        }

        // 3. Attendance Rate (Today's average)
        LocalDate today = LocalDate.now();
        double attendanceRate = 0;
        if (!classIds.isEmpty()) {
            List<Attendance> todayAttendance = attendanceRepository.findByDate(today).stream()
                    .filter(a -> a.getStudent() != null && a.getStudent().getClassRoom() != null && classIds.contains(a.getStudent().getClassRoom().getId()))
                    .collect(Collectors.toList());
            
            long present = todayAttendance.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
            attendanceRate = todayAttendance.isEmpty() ? 0 : Math.round((present * 100.0 / todayAttendance.size()));
        }

        // 4. Pending Exams
        long pendingExams = 0;
        if (!classIds.isEmpty()) {
            pendingExams = examRepository.findByClassRoomIdIn(classIds).stream()
                    .filter(e -> e.getExamDate() != null && !e.getExamDate().isAfter(today))
                    .filter(e -> {
                        long marksCount = markRepository.countByExamId(e.getId());
                        long studentsInClass = studentRepository.countByClassRoomId(e.getClassRoom().getId());
                        return marksCount < studentsInClass;
                    })
                    .count();
        }

        // 5. Next Class Logic
        String currentDay = LocalDate.now().getDayOfWeek().name();
        LocalTime now = LocalTime.now();
        List<Timetable> todayTimetable = timetableRepository.findByTeacherIdAndDayOfWeekOrderByPeriodNumber(teacherId, currentDay);
        
        Optional<Timetable> nextClassOpt = todayTimetable.stream()
                .filter(t -> t.getStartTime().isAfter(now))
                .min(Comparator.comparing(Timetable::getStartTime));

        Map<String, Object> nextClassMap = new HashMap<>();
        if (nextClassOpt.isPresent()) {
            Timetable t = nextClassOpt.get();
            nextClassMap.put("subject", t.getSubject() != null ? t.getSubject().getName() : "N/A");
            nextClassMap.put("class", t.getClassRoom() != null ? t.getClassRoom().getName() : "N/A");
            nextClassMap.put("time", t.getStartTime().toString());
            nextClassMap.put("room", t.getRoomNumber() != null ? t.getRoomNumber() : "N/A");
            nextClassMap.put("timeLeft", java.time.Duration.between(now, t.getStartTime()).toMinutes() + " mins");
        } else {
            Optional<Timetable> currentClassOpt = todayTimetable.stream()
                    .filter(t -> !now.isBefore(t.getStartTime()) && now.isBefore(t.getEndTime()))
                    .findFirst();
            if (currentClassOpt.isPresent()) {
                Timetable t = currentClassOpt.get();
                nextClassMap.put("subject", t.getSubject() != null ? t.getSubject().getName() : "N/A");
                nextClassMap.put("class", t.getClassRoom() != null ? t.getClassRoom().getName() : "N/A");
                nextClassMap.put("time", t.getStartTime().toString());
                nextClassMap.put("room", t.getRoomNumber() != null ? t.getRoomNumber() : "N/A");
                nextClassMap.put("timeLeft", "ONGOING");
            } else {
                nextClassMap.put("subject", "No more classes");
                nextClassMap.put("class", "-");
                nextClassMap.put("time", "-");
                nextClassMap.put("room", "-");
                nextClassMap.put("timeLeft", "-");
            }
        }

        // 6. Real Attendance Trend
        List<Map<String, Object>> attendanceTrend = teacherAnalyticsService.getAttendanceTrend(classIds, 7);

        // 7. Top Performing Classes (Real Calculation)
        List<Map<String, Object>> topClasses = classIds.stream()
            .map(id -> {
                ClassRoom room = classRoomRepository.findById(id).orElse(null);
                if (room == null) return null;
                List<Exam> roomExams = examRepository.findByClassRoomId(id);
                double avgPct = roomExams.stream()
                    .mapToDouble(e -> {
                        List<Mark> marks = markRepository.findByExamId(e.getId());
                        if (marks.isEmpty()) return 0;
                        return marks.stream().mapToDouble(m -> (m.getMarksObtained() / m.getTotalMarks()) * 100).average().orElse(0);
                    }).average().orElse(0);
                
                Map<String, Object> m = new HashMap<>();
                m.put("name", room.getName() + " " + room.getSection());
                m.put("val", Math.round(avgPct));
                return m;
            })
            .filter(Objects::nonNull)
            .sorted((a, b) -> Long.compare((long)b.get("val"), (long)a.get("val")))
            .limit(3)
            .collect(Collectors.toList());

        // 8. Resource Count
        long resourceCount = studyMaterialRepository.findByTeacherIdAndDeletedAtIsNull(teacherId).size();

        // 9. Notifications
        User user = userRepository.findById(userId).orElse(null);
        List<Map<String, Object>> notifications = new ArrayList<>();
        if (user != null) {
            notifications = notificationRepository.findByRecipientAndDeletedAtIsNullOrderByCreatedAtDesc(user)
                    .stream().limit(5).map(n -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id", n.getId());
                        m.put("type", n.getType().toLowerCase());
                        m.put("title", n.getTitle());
                        m.put("desc", n.getMessage());
                        m.put("time", formatRelativeTime(n.getCreatedAt()));
                        m.put("isRead", n.isRead());
                        return m;
                    }).collect(Collectors.toList());
        }

        // 10. To Do List
        List<Map<String, Object>> todos = new ArrayList<>();
        if (user != null) {
            todos = todoRepository.findByUserAndDeletedAtIsNullOrderByCreatedAtDesc(user)
                    .stream().map(t -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id", t.getId());
                        m.put("title", t.getTitle());
                        m.put("priority", t.getPriority().toLowerCase());
                        m.put("completed", t.isCompleted());
                        return m;
                    }).collect(Collectors.toList());
        }

        // 11. Recent Activities
        List<AuditLog> activities = auditLogRepository.findTop10ByActorIdOrderByChangedAtDesc(userId);
        List<Map<String, Object>> recentActivities = activities.stream()
                .map(log -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("msg", formatLogMessage(log));
                    m.put("time", formatRelativeTime(log.getChangedAt()));
                    m.put("type", log.getEntityType());
                    m.put("action", log.getAction());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalStudents", totalStudents);
        result.put("attendanceRate", Math.round(attendanceRate));
        result.put("pendingExams", pendingExams);
        result.put("trend", "+5%");
        result.put("nextClass", nextClassMap);
        result.put("attendanceTrend", attendanceTrend);
        result.put("topClasses", topClasses);
        result.put("resourceCount", resourceCount);
        result.put("recentActivities", recentActivities);
        result.put("notifications", notifications);
        result.put("todos", todos);
        
        return result;
    }

    @Transactional
    public void toggleTodo(Long userId, Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo", todoId));
        if (!todo.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        todo.setCompleted(!todo.isCompleted());
    }

    @Transactional
    public void deleteTodo(Long userId, Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo", todoId));
        if (!todo.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        todo.setDeletedAt(java.time.LocalDateTime.now());
        todoRepository.save(todo);
    }

    @Transactional
    public void markNotificationRead(Long userId, Long notifId) {
        Notification notif = notificationRepository.findById(notifId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notifId));
        if (!notif.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        notif.setRead(true);
    }

    @Transactional
    public void addTodo(Long userId, String title, String priority) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Todo todo = Todo.builder()
                .title(title)
                .priority(priority != null ? priority.toUpperCase() : "MEDIUM")
                .user(user)
                .build();
        todoRepository.save(todo);
    }

    @Transactional
    public void updateTodo(Long userId, Long todoId, String title, String priority) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo", todoId));
        if (!todo.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (title != null) todo.setTitle(title);
        if (priority != null) todo.setPriority(priority.toUpperCase());
        todoRepository.save(todo);
    }

    public Map<String, Object> getTeacherScope(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        Long teacherId = teacher.getId();

        // 1. Assigned Subjects & Classes
        List<Subject> subjects = subjectRepository.findByAssignedTeacherId(teacherId);
        List<ClassRoom> subjectClasses = subjects.stream()
                .filter(s -> s.getClassRoom() != null)
                .map(Subject::getClassRoom)
                .distinct()
                .collect(Collectors.toList());
        
        // Add classes where teacher is Class Teacher
        List<ClassRoom> classTeacherRooms = classRoomRepository.findByClassTeacherId(teacherId);
        Set<ClassRoom> allAssignedRooms = new HashSet<>(subjectClasses);
        allAssignedRooms.addAll(classTeacherRooms);
        
        List<Long> classIds = allAssignedRooms.stream().map(ClassRoom::getId).collect(Collectors.toList());

        // 2. Students in those classes
        List<Student> students = new ArrayList<>();
        if (!classIds.isEmpty()) {
            students = studentRepository.findAll().stream()
                .filter(s -> s.getClassRoom() != null && classIds.contains(s.getClassRoom().getId()))
                .collect(Collectors.toList());
        }

        // 3. Exams for those classes
        List<Exam> exams = classIds.isEmpty() ? new ArrayList<>() : examRepository.findByClassRoomIdIn(classIds);

        Map<String, Object> scope = new HashMap<>();
        
        Map<String, Object> teacherMap = new HashMap<>();
        teacherMap.put("id", teacher.getId());
        teacherMap.put("firstName", teacher.getFirstName() != null ? teacher.getFirstName() : "");
        teacherMap.put("lastName", teacher.getLastName() != null ? teacher.getLastName() : "");
        teacherMap.put("employeeId", teacher.getEmployeeId() != null ? teacher.getEmployeeId() : "");
        scope.put("teacher", teacherMap);

        scope.put("assignedClasses", allAssignedRooms.stream().map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", c.getId());
            m.put("name", c.getName() != null ? c.getName() : "Unknown");
            m.put("section", c.getSection() != null ? c.getSection() : "");
            return m;
        }).collect(Collectors.toList()));
        
        scope.put("subjects", subjects.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName() != null ? s.getName() : "Unknown");
            m.put("classId", s.getClassRoom() != null ? s.getClassRoom().getId() : 0);
            return m;
        }).collect(Collectors.toList()));

        scope.put("students", students.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("studentId", s.getStudentId() != null ? s.getStudentId() : "");
            m.put("firstName", s.getFirstName() != null ? s.getFirstName() : "");
            m.put("lastName", s.getLastName() != null ? s.getLastName() : "");
            m.put("className", s.getClassRoom() != null ? s.getClassRoom().getName() + " - " + s.getClassRoom().getSection() : "N/A");
            m.put("classId", s.getClassRoom() != null ? s.getClassRoom().getId() : 0);
            m.put("parentEmail", s.getParentEmail() != null ? s.getParentEmail() : "");
            return m;
        }).collect(Collectors.toList()));

        scope.put("exams", exams.stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("name", e.getName() != null ? e.getName() : "Unnamed Exam");
            m.put("className", e.getClassRoom() != null ? e.getClassRoom().getName() + " - " + e.getClassRoom().getSection() : "N/A");
            m.put("subjectName", e.getSubject() != null ? e.getSubject().getName() : "N/A");
            return m;
        }).collect(Collectors.toList()));

        return scope;
    }

    @Transactional
    public void deleteStudyMaterial(Long userId, Long resourceId) {
        StudyMaterial material = studyMaterialRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("StudyMaterial", resourceId));
        if (!material.getTeacher().getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        material.setDeletedAt(java.time.LocalDateTime.now());
        studyMaterialRepository.save(material);
    }

    public List<Map<String, Object>> getStudyMaterials(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        return studyMaterialRepository.findByTeacherIdAndDeletedAtIsNull(teacher.getId())
                .stream().map(m -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", m.getId());
                    map.put("name", m.getTitle());
                    map.put("type", m.getFileType());
                    map.put("size", formatFileSize(m.getFileSize()));
                    map.put("url", m.getFileUrl());
                    map.put("subject", m.getSubject() != null ? m.getSubject().getName() : "General");
                    return map;
                }).collect(Collectors.toList());
    }

    @Transactional
    public void addStudyMaterial(Long userId, Map<String, Object> body) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        StudyMaterial material = StudyMaterial.builder()
                .title((String) body.get("title"))
                .fileUrl((String) body.get("fileUrl"))
                .fileType((String) body.get("fileType"))
                .fileSize(Long.valueOf(body.get("fileSize").toString()))
                .teacher(teacher)
                .branch(teacher.getBranch())
                .build();
        
        if (body.get("subjectId") != null) {
            subjectRepository.findById(Long.valueOf(body.get("subjectId").toString()))
                .ifPresent(material::setSubject);
        }
        
        studyMaterialRepository.save(material);
    }

    private String formatFileSize(Long bytes) {
        if (bytes == null || bytes <= 0) return "0 B";
        final String[] units = new String[] { "B", "KB", "MB", "GB", "TB" };
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        return new java.text.DecimalFormat("#,##0.#").format(bytes / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }

    private String formatLogMessage(AuditLog log) {
        String action = log.getAction().toLowerCase();
        String entity = log.getEntityType();
        if (entity.contains(".")) {
            entity = entity.substring(entity.lastIndexOf(".") + 1);
        }
        return (action.equals("create") ? "Added new " : "Updated ") + entity;
    }

    private String formatRelativeTime(java.time.LocalDateTime time) {
        java.time.Duration duration = java.time.Duration.between(time, java.time.LocalDateTime.now());
        long hours = duration.toHours();
        if (hours < 1) return duration.toMinutes() + "m ago";
        if (hours < 24) return hours + "h ago";
        return duration.toDays() + "d ago";
    }
}
