package com.school.sms.config;

import com.school.sms.model.ClassRoom;
import com.school.sms.model.Role;
import com.school.sms.model.Student;
import com.school.sms.model.StudentStatus;
import com.school.sms.model.Teacher;
import com.school.sms.model.TeacherStatus;
import com.school.sms.model.User;
import com.school.sms.model.AcademicYear;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.ClassRoomRepository;
import com.school.sms.repository.StudentRepository;
import com.school.sms.repository.TeacherRepository;
import com.school.sms.repository.UserRepository;
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
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!seedDemo) {
                log.info("Demo seed disabled");
                return;
            }

            if (teacherRepository.count() > 0 || studentRepository.count() > 0) {
                log.info("Demo seed skipped (existing teachers/students found)");
                return;
            }

            String academicYearLabel = buildAcademicYear(LocalDate.now());
            int startYear = LocalDate.now().getMonthValue() >= 4 ? LocalDate.now().getYear() : LocalDate.now().getYear() - 1;

            AcademicYear currentYearEntity = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                    .orElseGet(() -> {
                        AcademicYear year = AcademicYear.builder()
                                .label(academicYearLabel)
                                .startYear(startYear)
                                .endYear(startYear + 1)
                                .startDate(LocalDate.of(startYear, 4, 1))
                                .endDate(LocalDate.of(startYear + 1, 3, 31))
                                .active(true)
                                .schoolCode("SMS")
                                .build();
                        return academicYearRepository.save(year);
                    });

            ClassRoom classRoom = classRoomRepository
                    .findByNameAndSectionAndAcademicYear(
                            DEFAULT_CLASS_NAME,
                            DEFAULT_CLASS_SECTION,
                            academicYearLabel
                    )
                    .orElseGet(() -> classRoomRepository.save(Objects.requireNonNull(ClassRoom.builder()
                            .name(DEFAULT_CLASS_NAME)
                            .section(DEFAULT_CLASS_SECTION)
                            .academicYear(academicYearLabel)
                            .maxCapacity(40)
                            .classFee(25000.0)
                            .admissionFee(5000.0)
                            .build())));

            String year = String.valueOf(Year.now().getValue());
            String teacherEmployeeId = String.format("TCH-%s-001", year);
            User teacherUser = userRepository
                    .findByUsernameOrEmail(teacherEmployeeId, DEFAULT_TEACHER_EMAIL)
                    .orElseGet(() -> userRepository.save(Objects.requireNonNull(User.builder()
                            .firstName("Demo")
                            .lastName("Teacher")
                            .email(DEFAULT_TEACHER_EMAIL)
                            .username(teacherEmployeeId)
                            .password(passwordEncoder.encode(teacherEmployeeId))
                            .role(Role.TEACHER)
                            .firstLogin(true)
                            .enabled(true)
                            .build())));

            Teacher teacher = teacherRepository.findByEmail(DEFAULT_TEACHER_EMAIL)
                    .orElseGet(() -> teacherRepository.save(Objects.requireNonNull(Teacher.builder()
                            .user(teacherUser)
                            .employeeId(teacherEmployeeId)
                            .firstName("Demo")
                            .lastName("Teacher")
                            .email(DEFAULT_TEACHER_EMAIL)
                            .status(TeacherStatus.ACTIVE)
                            .build())));

            if (classRoom.getClassTeacher() == null) {
                classRoom.setClassTeacher(teacher);
                classRoomRepository.save(classRoom);
            }

            String studentId = String.format("STU-%s-0001", year);
            User studentUser = userRepository
                    .findByUsernameOrEmail(studentId, DEFAULT_STUDENT_EMAIL)
                    .orElseGet(() -> userRepository.save(Objects.requireNonNull(User.builder()
                            .firstName("Demo")
                            .lastName("Student")
                            .email(DEFAULT_STUDENT_EMAIL)
                            .username(studentId)
                            .password(passwordEncoder.encode(studentId))
                            .role(Role.STUDENT)
                            .firstLogin(true)
                            .enabled(true)
                            .build())));

            studentRepository.findByEmail(DEFAULT_STUDENT_EMAIL)
                    .orElseGet(() -> studentRepository.save(Objects.requireNonNull(Student.builder()
                            .user(studentUser)
                            .studentId(studentId)
                            .firstName("Demo")
                            .lastName("Student")
                            .email(DEFAULT_STUDENT_EMAIL)
                            .classRoom(classRoom)
                            .academicYear(currentYearEntity)
                            .status(StudentStatus.ACTIVE)
                            .build())));

            log.info("Demo seed created: teacher={} student={} class={} {}",
                    teacherEmployeeId,
                    studentId,
                    DEFAULT_CLASS_NAME,
                    DEFAULT_CLASS_SECTION);
        };
    }

    private String buildAcademicYear(LocalDate date) {
        int year = date.getYear();
        int month = date.getMonthValue();
        int startYear = month >= 4 ? year : year - 1;
        int endShort = (startYear + 1) % 100;
        return String.format("%d-%02d", startYear, endShort);
    }
}
