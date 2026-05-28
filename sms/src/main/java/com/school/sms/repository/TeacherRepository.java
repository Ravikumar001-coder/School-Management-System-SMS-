// repository/TeacherRepository.java
package com.school.sms.repository;

import com.school.sms.model.Teacher;
import com.school.sms.model.TeacherStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository 
        extends JpaRepository<Teacher, Long> {

    Page<Teacher> findByDeletedAtIsNull(Pageable pageable);

    Optional<Teacher> findByIdAndDeletedAtIsNull(Long id);

    Optional<Teacher> findByEmail(String email);

    Optional<Teacher> findByEmployeeId(String employeeId);

    Optional<Teacher> findByUserId(Long userId);
    
    Optional<Teacher> findByUser_UsernameOrUser_Email(String username, String email);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    List<Teacher> findByStatus(TeacherStatus status);

    @Query("SELECT t FROM Teacher t WHERE t.deletedAt IS NULL AND (" +
           "LOWER(t.firstName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
           "LOWER(t.lastName)  LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
           "LOWER(t.email)     LIKE LOWER(CONCAT('%',:keyword,'%')))")
    List<Teacher> searchTeachers(String keyword);

    @Query("SELECT DISTINCT t FROM Teacher t " +
           "LEFT JOIN t.department d " +
           "LEFT JOIN t.subjects s " +
           "LEFT JOIN s.classRoom c " +
           "WHERE t.deletedAt IS NULL " +
           "AND (:deptId IS NULL OR d.id = :deptId) " +
           "AND (:subjectId IS NULL OR s.id = :subjectId) " +
           "AND (:classId IS NULL OR c.id = :classId) " +
           "AND (:keyword IS NULL OR LOWER(t.firstName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(t.lastName) LIKE LOWER(CONCAT('%',:keyword,'%')))")
    Page<Teacher> findFiltered(Long deptId, Long subjectId, Long classId, String keyword, Pageable pageable);

    boolean existsByEmailAndDeletedAtIsNull(String email);
    
    boolean existsByEmployeeIdAndDeletedAtIsNull(String employeeId);

    boolean existsByPanCardAndDeletedAtIsNull(String panCard);

    boolean existsByAadharCardAndDeletedAtIsNull(String aadharCard);

    long countByDeletedAtIsNull();
    long countByDepartmentId(Long departmentId);
}