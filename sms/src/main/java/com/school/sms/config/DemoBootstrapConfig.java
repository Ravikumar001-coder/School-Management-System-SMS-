package com.school.sms.config;

import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.Year;
import java.util.Objects;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DemoBootstrapConfig {

    private static final String DEFAULT_CLASS_NAME = "Grade 10";
    private static final String DEFAULT_CLASS_SECTION = "A";
    private static final String DEFAULT_TEACHER_EMAIL = "teacher@school.com";
    private static final String DEFAULT_STUDENT_EMAIL = "student@school.com";

    @Value("${app.demo.seed:true}")
    private boolean seedDemo;

    @Bean
    public CommandLineRunner seedDemoData(
            UserRepository userRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ClassRoomRepository classRoomRepository,
            AcademicYearRepository academicYearRepository,
            NotificationRepository notificationRepository,
            TodoRepository todoRepository,
            SubjectRepository subjectRepository,
            TimetableRepository timetableRepository,
            BranchRepository branchRepository,
            com.school.sms.service.ReceiptNumberService receiptNumberService,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!seedDemo) {
                log.info("Demo seed disabled");
                return;
            }

            if (teacherRepository.count() > 0 && timetableRepository.count() > 0) {
                log.info("Demo seed skipped (existing teachers/timetable found)");
                return;
            }

            String yearLabel = buildAcademicYearLabel(LocalDate.now());
            AcademicYear academicYear = academicYearRepository.findByLabel(yearLabel)
                    .orElseGet(() -> academicYearRepository.save(AcademicYear.builder()
                            .label(yearLabel)
                            .startYear(LocalDate.now().getYear())
                            .endYear(LocalDate.now().getYear() + 1)
                            .active(true)
                            .isCurrent(true)
                            .build()));

            Branch mainBranch = branchRepository.findByCode("MAIN").orElse(null);

            ClassRoom classRoom = classRoomRepository
                    .findByNameAndSectionAndAcademicYear(
                            DEFAULT_CLASS_NAME,
                            DEFAULT_CLASS_SECTION,
                            academicYear
                    )
                    .orElseGet(() -> classRoomRepository.save(Objects.requireNonNull(ClassRoom.builder()
                            .name(DEFAULT_CLASS_NAME)
                            .section(DEFAULT_CLASS_SECTION)
                            .academicYear(academicYear)
                            .branch(mainBranch)
                            .maxCapacity(40)
                            .classFee(25000.0)
                            .admissionFee(5000.0)
                            .build())));

            Teacher teacher = teacherRepository.findByEmail(DEFAULT_TEACHER_EMAIL).orElse(null);
            String teacherEmployeeId;
            User teacherUser;

            if (teacher == null) {
                teacherEmployeeId = receiptNumberService.nextTeacherId();
                teacherUser = userRepository.save(Objects.requireNonNull(User.builder()
                        .firstName("Demo")
                        .lastName("Teacher")
                        .email(DEFAULT_TEACHER_EMAIL)
                        .username(teacherEmployeeId)
                        .password(passwordEncoder.encode(teacherEmployeeId))
                        .role("TEACHER")
                        .firstLogin(true)
                        .enabled(true)
                        .build()));

                teacher = teacherRepository.save(Objects.requireNonNull(Teacher.builder()
                        .user(teacherUser)
                        .employeeId(teacherEmployeeId)
                        .firstName("Demo")
                        .lastName("Teacher")
                        .email(DEFAULT_TEACHER_EMAIL)
                        .status(TeacherStatus.ACTIVE)
                        .branch(mainBranch)
                        .build()));
            } else {
                teacherUser = teacher.getUser();
                teacherEmployeeId = teacher.getEmployeeId();
            }

            final Teacher finalTeacher = teacher;

            // Seed Subjects (check if exist to avoid duplicates)
            Subject math = subjectRepository.findByCode("MATH10")
                    .orElseGet(() -> subjectRepository.save(Subject.builder()
                        .name("Mathematics").code("MATH10").subjectType("THEORY").branch(mainBranch)
                        .assignedTeacher(finalTeacher).classRoom(classRoom).build()));
            
            Subject science = subjectRepository.findByCode("PHY10")
                    .orElseGet(() -> subjectRepository.save(Subject.builder()
                        .name("Physics").code("PHY10").subjectType("THEORY").branch(mainBranch)
                        .assignedTeacher(finalTeacher).classRoom(classRoom).build()));
            
            // Ensure existing subjects are linked to teacher if they were already seeded
            if (math.getAssignedTeacher() == null || !math.getAssignedTeacher().getId().equals(teacher.getId())) {
                math.setAssignedTeacher(teacher);
                math.setClassRoom(classRoom);
                subjectRepository.save(math);
            }
            if (science.getAssignedTeacher() == null || !science.getAssignedTeacher().getId().equals(teacher.getId())) {
                science.setAssignedTeacher(teacher);
                science.setClassRoom(classRoom);
                subjectRepository.save(science);
            }

            // Seed Timetable if empty
            if (timetableRepository.count() == 0) {
                log.info("Seeding demo timetable entries...");
                try {
                    timetableRepository.save(Timetable.builder()
                            .teacher(teacher)
                            .subject(math)
                            .classRoom(classRoom)
                            .dayOfWeek("MONDAY")
                            .periodNumber(1)
                            .startTime(java.time.LocalTime.of(8, 0))
                            .endTime(java.time.LocalTime.of(9, 0))
                            .roomNumber("101")
                            .branch(mainBranch)
                            .academicYear(academicYear)
                            .build());
                    
                    timetableRepository.save(Timetable.builder()
                            .teacher(teacher)
                            .subject(science)
                            .classRoom(classRoom)
                            .dayOfWeek("TUESDAY")
                            .periodNumber(2)
                            .startTime(java.time.LocalTime.of(9, 0))
                            .endTime(java.time.LocalTime.of(10, 0))
                            .roomNumber("102")
                            .branch(mainBranch)
                            .academicYear(academicYear)
                            .build());

                    log.info("Demo Timetable seeded successfully for teacher: {}", teacherEmployeeId);
                } catch (Exception e) {
                    log.error("FAILED to seed timetable: {}", e.getMessage(), e);
                }
            }

            if (classRoom.getClassTeacher() == null) {
                classRoom.setClassTeacher(teacher);
                classRoomRepository.save(classRoom);
            }

            Student student = studentRepository.findByEmail(DEFAULT_STUDENT_EMAIL).orElse(null);
            String studentId;
            User studentUser;

            if (student == null) {
                studentId = receiptNumberService.nextStudentId(academicYear);
                studentUser = userRepository.save(Objects.requireNonNull(User.builder()
                        .firstName("Demo")
                        .lastName("Student")
                        .email(DEFAULT_STUDENT_EMAIL)
                        .username(studentId)
                        .password(passwordEncoder.encode(studentId))
                        .role("STUDENT")
                        .firstLogin(true)
                        .enabled(true)
                        .build()));

                studentRepository.save(Objects.requireNonNull(Student.builder()
                        .user(studentUser)
                        .studentId(studentId)
                        .firstName("Demo")
                        .lastName("Student")
                        .email(DEFAULT_STUDENT_EMAIL)
                        .classRoom(classRoom)
                        .academicYear(academicYear)
                        .status(StudentStatus.ACTIVE)
                        .build()));
            } else {
                studentId = student.getStudentId();
                studentUser = student.getUser();
            }

            log.info("Demo seed created: teacher={} student={} class={} {}",
                    teacherEmployeeId,
                    studentId,
                    DEFAULT_CLASS_NAME,
                    DEFAULT_CLASS_SECTION);

            // Seed Notifications & Todos for the Demo Teacher
            if (notificationRepository.count() == 0) {
                notificationRepository.save(Notification.builder()
                        .title("Exam schedule published")
                        .message("Unit Test 1 - Grade 10")
                        .type("EXAM")
                        .recipient(teacherUser)
                        .build());
                notificationRepository.save(Notification.builder()
                        .title("Homework pending review")
                        .message("10-A • Algebra")
                        .type("HOMEWORK")
                        .recipient(teacherUser)
                        .build());
            }

            if (todoRepository.count() == 0) {
                todoRepository.save(Todo.builder()
                        .title("Enter marks for Unit Test 1")
                        .priority("HIGH")
                        .user(teacherUser)
                        .build());
                todoRepository.save(Todo.builder()
                        .title("Review 5 leave applications")
                        .priority("MEDIUM")
                        .user(teacherUser)
                        .build());
            }
        };
    }

    private String buildAcademicYearLabel(LocalDate date) {
        int year = date.getYear();
        int month = date.getMonthValue();
        int startYear = month >= 4 ? year : year - 1;
        int endShort = (startYear + 1) % 100;
        return String.format("%d-%02d", startYear, endShort);
    }
}
