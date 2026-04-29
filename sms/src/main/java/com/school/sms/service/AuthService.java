// src/main/java/com/school/sms/service/AuthService.java

package com.school.sms.service;

import com.school.sms.dto.request.ChangePasswordRequest;
import com.school.sms.dto.request.LoginRequest;
import com.school.sms.dto.response.AuthResponse;
import com.school.sms.model.Role;
import com.school.sms.model.Student;
import com.school.sms.model.Teacher;
import com.school.sms.model.User;
import com.school.sms.repository.StudentRepository;
import com.school.sms.repository.TeacherRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.security.JwtService;
import com.school.sms.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
        private final StudentRepository studentRepository;
        private final TeacherRepository teacherRepository;

    // ========================
    // LOGIN USER
    // ========================
    public AuthResponse login(LoginRequest request) {
        String identifier = normalizeIdentifier(request.getIdentifier());
        String rawPassword = request.getPassword();

                User user = resolveOrProvisionUserForLogin(identifier)
                                .orElseThrow(() -> new RuntimeException("User not found!"));

        boolean authenticated = isPasswordMatch(user, rawPassword)
                || tryLegacyPlainTextPasswordMigration(user, rawPassword)
                || tryDefaultCredentialRepair(user, rawPassword, identifier);

        if (!authenticated) {
            throw new BadCredentialsException("Invalid email or password!");
        }

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Invalid email or password!");
        }

        // Generate token
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                                .studentId(resolveStudentId(user))
                                .firstLogin(user.isFirstLogin())
                .message("Login successful!")
                .build();
    }

        private Optional<User> resolveOrProvisionUserForLogin(String identifier) {
                Optional<User> existingUser = userRepository.findByUsernameOrEmail(identifier, identifier);
                if (existingUser.isPresent()) {
                        return existingUser;
                }

                Optional<Student> student = studentRepository.findByStudentId(identifier)
                                .or(() -> studentRepository.findByEmail(identifier));
                if (student.isPresent()) {
                        return Optional.of(provisionStudentLoginUser(student.get()));
                }

                Optional<Teacher> teacher = teacherRepository.findByEmployeeId(identifier)
                                .or(() -> teacherRepository.findByEmail(identifier));
                if (teacher.isPresent()) {
                        return Optional.of(provisionTeacherLoginUser(teacher.get()));
                }

                return Optional.empty();
        }

        private User provisionStudentLoginUser(Student student) {
                if (student.getUser() != null) {
                        return Objects.requireNonNull(student.getUser());
                }

                String username = nonBlankOrElse(student.getStudentId(), student.getEmail());
                Optional<User> existing = userRepository.findByUsernameOrEmail(username, student.getEmail());
                User user;
                if (existing.isPresent()) {
                        user = Objects.requireNonNull(existing.get());
                } else {
                        user = Objects.requireNonNull(userRepository.save(User.builder()
                                                .firstName(nonBlankOrElse(student.getFirstName(), "Student"))
                                                .lastName(nonBlankOrElse(student.getLastName(), "User"))
                                                .email(student.getEmail())
                                                .username(username)
                                                .password(passwordEncoder.encode(username))
                                                .role(Role.STUDENT)
                                                .firstLogin(true)
                                                .enabled(true)
                                                .build()));
                }

                student.setUser(user);
                studentRepository.save(student);
                return user;
        }

        private User provisionTeacherLoginUser(Teacher teacher) {
                if (teacher.getUser() != null) {
                        return Objects.requireNonNull(teacher.getUser());
                }

                String username = nonBlankOrElse(teacher.getEmployeeId(), teacher.getEmail());
                Optional<User> existing = userRepository.findByUsernameOrEmail(username, teacher.getEmail());
                User user;
                if (existing.isPresent()) {
                        user = Objects.requireNonNull(existing.get());
                } else {
                        user = Objects.requireNonNull(userRepository.save(User.builder()
                                                .firstName(nonBlankOrElse(teacher.getFirstName(), "Teacher"))
                                                .lastName(nonBlankOrElse(teacher.getLastName(), "User"))
                                                .email(teacher.getEmail())
                                                .username(username)
                                                .password(passwordEncoder.encode(username))
                                                .role(Role.TEACHER)
                                                .firstLogin(true)
                                                .enabled(true)
                                                .build()));
                }

                teacher.setUser(user);
                teacherRepository.save(teacher);
                return user;
        }

        private boolean isPasswordMatch(User user, String rawPassword) {
                String storedPassword = user.getPassword();
                if (storedPassword == null || rawPassword == null) {
                        return false;
                }

                try {
                        return passwordEncoder.matches(rawPassword, storedPassword);
                } catch (IllegalArgumentException ex) {
                        return false;
                }
        }

        private boolean tryLegacyPlainTextPasswordMigration(User user, String rawPassword) {
                String storedPassword = user.getPassword();
                if (storedPassword == null || rawPassword == null) {
                        return false;
                }

                if (looksLikeEncodedPassword(storedPassword)) {
                        return false;
                }

                if (!storedPassword.equals(rawPassword)) {
                        return false;
                }

                user.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(user);
                return true;
        }

        private boolean tryDefaultCredentialRepair(User user, String rawPassword, String loginIdentifier) {
                String expectedDefault = resolveExpectedDefaultCredential(user, loginIdentifier);
                if (expectedDefault == null || rawPassword == null || !expectedDefault.equals(rawPassword)) {
                        return false;
                }

                boolean schoolIdCredentialAttempt = looksLikeSchoolId(expectedDefault)
                                && loginIdentifier != null
                                && expectedDefault.equalsIgnoreCase(loginIdentifier.trim());

                String storedPassword = user.getPassword();
                boolean canRepair = user.isFirstLogin()
                                || storedPassword == null
                                || storedPassword.isBlank()
                                || !looksLikeEncodedPassword(storedPassword)
                                || schoolIdCredentialAttempt;

                if (!canRepair) {
                        return false;
                }

                user.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(user);
                return true;
        }

        private String resolveExpectedDefaultCredential(User user, String loginIdentifier) {
                String roleBasedDefault = switch (user.getRole()) {
                        case STUDENT -> studentRepository.findByUser_Id(user.getId())
                                        .map(Student::getStudentId)
                                        .filter(value -> value != null && !value.isBlank())
                                        .or(() -> studentRepository.findByEmail(user.getEmail())
                                                        .map(Student::getStudentId)
                                                        .filter(value -> value != null && !value.isBlank()))
                                        .orElse(null);
                        case TEACHER -> teacherRepository.findByUserId(user.getId())
                                        .map(Teacher::getEmployeeId)
                                        .filter(value -> value != null && !value.isBlank())
                                        .or(() -> teacherRepository.findByEmail(user.getEmail())
                                                        .map(Teacher::getEmployeeId)
                                                        .filter(value -> value != null && !value.isBlank()))
                                        .orElse(null);
                        default -> null;
                };

                if (roleBasedDefault != null && !roleBasedDefault.isBlank()) {
                        return roleBasedDefault;
                }

                if (looksLikeSchoolId(loginIdentifier)) {
                        return loginIdentifier;
                }

                String expectedDefault = user.getUsername();
                if (expectedDefault == null || expectedDefault.isBlank()) {
                        expectedDefault = user.getEmail();
                }
                return expectedDefault;
        }

        private boolean looksLikeEncodedPassword(String value) {
                return value.startsWith("$2a$")
                                || value.startsWith("$2b$")
                                || value.startsWith("$2y$")
                                || value.startsWith("{");
        }

        private String normalizeIdentifier(String identifier) {
                String normalized = identifier == null ? "" : identifier.trim();
                if (normalized.contains("@")) {
                        normalized = normalized.toLowerCase();
                } else if (looksLikeSchoolId(normalized)) {
                        normalized = normalized.toUpperCase(Locale.ROOT);
                }
                return normalized;
        }

        private boolean looksLikeSchoolId(String identifier) {
                if (identifier == null || identifier.isBlank()) {
                        return false;
                }

                String normalized = identifier.trim();
                return normalized.matches("(?i)^(STU|STD|TCH|ADM|ADMIN)-[A-Z0-9-]+$");
        }

        public AuthResponse getCurrentUserProfile(String identifier) {
                User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return AuthResponse.builder()
                .token(null)
                                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .studentId(resolveStudentId(user))
                                .firstLogin(user.isFirstLogin())
                .message("User profile loaded")
                .build();
    }

        public void changePassword(String identifier, ChangePasswordRequest request) {
                User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                                .orElseThrow(() -> new RuntimeException("User not found!"));

                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                        throw new UnauthorizedException("Current password is incorrect");
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                user.setFirstLogin(false);
                userRepository.save(user);
        }

        @Transactional
        public String resetPasswordToDefault(Long userId) {
                Long requestedId = Objects.requireNonNull(userId, "User id is required");
                User user = resolveUserForReset(requestedId)
                                .or(() -> provisionUserForProfileId(requestedId))
                                .orElseThrow(() -> new RuntimeException("User not found!"));

                String username = resolveDefaultPasswordValue(requestedId, user);

                user.setPassword(passwordEncoder.encode(username));
                user.setFirstLogin(true);
                userRepository.save(user);
                return username;
        }

        @Transactional
        public String resetStudentPasswordToDefault(String studentId) {
                String requestedStudentId = Objects.requireNonNull(studentId, "Student id is required").trim();
                if (requestedStudentId.isEmpty()) {
                        throw new RuntimeException("Student id is required");
                }

                Student student = studentRepository.findByStudentId(requestedStudentId)
                                .orElseThrow(() -> new RuntimeException("Student not found!"));

                return resetPasswordToDefault(student.getId());
        }

        public boolean isAdmin(String identifier) {
                if (identifier == null || identifier.isBlank()) {
                        return false;
                }

                return userRepository.findByUsernameOrEmail(identifier, identifier)
                                .map(User::getRole)
                                .map(role -> role == Role.ADMIN)
                                .orElse(false);
        }

        private Optional<User> resolveUserForReset(Long id) {
                Long lookupId = Objects.requireNonNull(id, "User id is required");

                Optional<Student> student = studentRepository.findById(lookupId);
                if (student.isPresent()) {
                        Student s = student.get();
                        if (s.getUser() != null) {
                                return Optional.of(s.getUser());
                        }

                        Optional<User> matchedStudentUser = userRepository.findByUsernameOrEmail(
                                        s.getStudentId(),
                                        s.getEmail()
                        );
                        if (matchedStudentUser.isPresent()) {
                                return matchedStudentUser;
                        }
                }

                Optional<Teacher> teacher = teacherRepository.findById(lookupId);
                if (teacher.isPresent()) {
                        Teacher t = teacher.get();
                        if (t.getUser() != null) {
                                return Optional.of(t.getUser());
                        }

                        Optional<User> matchedTeacherUser = userRepository.findByUsernameOrEmail(
                                        t.getEmployeeId(),
                                        t.getEmail()
                        );
                        if (matchedTeacherUser.isPresent()) {
                                return matchedTeacherUser;
                        }
                }

                Optional<User> user = userRepository.findById(lookupId);
                if (user.isPresent()) {
                        return user;
                }

                return Optional.empty();
        }

        private Optional<User> provisionUserForProfileId(Long id) {
                Long lookupId = Objects.requireNonNull(id, "User id is required");

                Optional<Student> student = studentRepository.findById(lookupId);
                if (student.isPresent()) {
                        Student s = student.get();
                        String username = nonBlankOrElse(s.getStudentId(), s.getEmail());
                        if (username == null || username.isBlank()) {
                                return Optional.empty();
                        }

                        Optional<User> existing = userRepository.findByUsernameOrEmail(username, s.getEmail());
                        if (existing.isPresent()) {
                                if (s.getUser() == null) {
                                        s.setUser(existing.get());
                                        studentRepository.save(s);
                                }
                                return existing;
                        }

                        User created = User.builder()
                                        .firstName(nonBlankOrElse(s.getFirstName(), "Student"))
                                        .lastName(nonBlankOrElse(s.getLastName(), "User"))
                                        .email(s.getEmail())
                                        .username(username)
                                        .password(passwordEncoder.encode(username))
                                        .role(Role.STUDENT)
                                        .firstLogin(true)
                                        .enabled(true)
                                        .build();

                        created = userRepository.save(Objects.requireNonNull(created));
                        s.setUser(created);
                        studentRepository.save(s);
                        return Optional.of(created);
                }

                Optional<Teacher> teacher = teacherRepository.findById(lookupId);
                if (teacher.isPresent()) {
                        Teacher t = teacher.get();
                        String username = nonBlankOrElse(t.getEmployeeId(), t.getEmail());
                        if (username == null || username.isBlank()) {
                                return Optional.empty();
                        }

                        Optional<User> existing = userRepository.findByUsernameOrEmail(username, t.getEmail());
                        if (existing.isPresent()) {
                                if (t.getUser() == null) {
                                        t.setUser(existing.get());
                                        teacherRepository.save(t);
                                }
                                return existing;
                        }

                        User created = User.builder()
                                        .firstName(nonBlankOrElse(t.getFirstName(), "Teacher"))
                                        .lastName(nonBlankOrElse(t.getLastName(), "User"))
                                        .email(t.getEmail())
                                        .username(username)
                                        .password(passwordEncoder.encode(username))
                                        .role(Role.TEACHER)
                                        .firstLogin(true)
                                        .enabled(true)
                                        .build();

                        created = userRepository.save(Objects.requireNonNull(created));
                        t.setUser(created);
                        teacherRepository.save(t);
                        return Optional.of(created);
                }

                return Optional.empty();
        }

        private String resolveDefaultPasswordValue(Long requestedId, User user) {
                Long lookupId = Objects.requireNonNull(requestedId, "User id is required");

                return studentRepository.findById(lookupId)
                                .map(Student::getStudentId)
                                .filter(value -> value != null && !value.isBlank())
                        .or(() -> teacherRepository.findById(lookupId)
                                                .map(Teacher::getEmployeeId)
                                                .filter(value -> value != null && !value.isBlank()))
                                .orElseGet(() -> {
                                        String username = user.getUsername();
                                        if (username == null || username.isBlank()) {
                                                return user.getEmail();
                                        }
                                        return username;
                                });
        }

        private String nonBlankOrElse(String primary, String fallback) {
                if (primary != null && !primary.isBlank()) {
                        return primary;
                }
                return fallback;
        }

        private Long resolveStudentId(User user) {
                if (user.getRole() != Role.STUDENT) {
                        return null;
                }

                return studentRepository.findByUser_Id(user.getId())
                                .or(() -> studentRepository.findByEmail(user.getEmail()))
                                .map(student -> student.getId())
                                .orElse(null);
        }
}