// repository/SubjectRepository.java
package com.school.sms.repository;

import com.school.sms.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository 
        extends JpaRepository<Subject, Long> {

    Optional<Subject> findByCode(String code);

    boolean existsByCode(String code);

    List<Subject> findBySubjectType(String subjectType);

    List<Subject> findByNameContaining(String name);

    List<Subject> findByAssignedTeacherId(Long teacherId);
    long countByDepartmentId(Long departmentId);
}