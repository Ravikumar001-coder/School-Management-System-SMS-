// repository/MarkRepository.java
package com.school.sms.repository;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarkRepository 
        extends JpaRepository<Mark, Long> {

    Optional<Mark> findByStudentIdAndExamId(
        Long studentId, Long examId);

    boolean existsByStudentIdAndExamId(
        Long studentId, Long examId);

    List<Mark> findByStudentId(Long studentId);

    List<Mark> findByExamId(Long examId);

    default List<Mark> findByExam_Id(Long examId) {
        return findByExamId(examId);
    }

    long countByExamId(Long examId);

    // Report card - all marks for a student in a year
    @Query("SELECT m FROM Mark m " +
           "WHERE m.student.id = :studentId " +
           "AND m.academicYear = :academicYear")
    List<Mark> findStudentMarksByYear(
        Long studentId, AcademicYear academicYear);

    // Class topper
    @Query("SELECT m FROM Mark m " +
           "WHERE m.exam.id = :examId " +
           "ORDER BY m.marksObtained DESC")
    List<Mark> findByExamOrderByMarks(Long examId);
}