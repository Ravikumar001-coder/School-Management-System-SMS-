package com.school.sms.repository;

import com.school.sms.model.Student;
import com.school.sms.model.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE " +
           "s.deletedAt IS NULL AND " +
           "(LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.studentId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Student> searchByKeyword(String keyword);

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

    @Query("SELECT s.department.name, COUNT(s.id) FROM Student s WHERE s.department IS NOT NULL GROUP BY s.department.name")
    List<Object[]> countStudentsByDepartment();

    @Query("SELECT s FROM Student s LEFT JOIN s.classRoom c WHERE " +
           "s.deletedAt IS NULL AND " +
           "(:classId IS NULL OR c.id = :classId) AND " +
           "(:keyword IS NULL OR TRIM(:keyword) = '' OR " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.studentId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Student> findFiltered(String keyword, Long classId, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.deletedAt IS NULL")
    Page<Student> findAllActive(Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM students", nativeQuery = true)
    Long countNative();
}