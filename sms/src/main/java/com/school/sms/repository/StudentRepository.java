package com.school.sms.repository;

import com.school.sms.model.Student;
import com.school.sms.model.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByFirstNameContainingOrLastNameContainingOrEmailContaining(
            String firstName,
            String lastName,
            String email
    );

    List<Student> findByClassRoom_Id(Long classRoomId);

    default List<Student> findByClassRoomId(Long classRoomId) {
        return findByClassRoom_Id(classRoomId);
    }

    Long countByClassRoom_Id(Long classRoomId);

    default Long countByClassRoomId(Long classRoomId) {
        return countByClassRoom_Id(classRoomId);
    }

    Long countByStatus(StudentStatus status);

    Optional<Student> findByEmail(String email);

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByUser_Id(Long userId);

    Optional<Student> findByUser_UsernameOrUser_Email(String username, String email);
}