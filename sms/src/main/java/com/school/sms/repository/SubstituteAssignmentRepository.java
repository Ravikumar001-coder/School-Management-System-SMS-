package com.school.sms.repository;

import com.school.sms.model.SubstituteAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubstituteAssignmentRepository extends JpaRepository<SubstituteAssignment, Long> {
    List<SubstituteAssignment> findBySubstituteTeacherIdAndAssignmentDate(Long substituteTeacherId, LocalDate assignmentDate);
    List<SubstituteAssignment> findByOriginalTeacherIdAndAssignmentDate(Long originalTeacherId, LocalDate assignmentDate);
}
