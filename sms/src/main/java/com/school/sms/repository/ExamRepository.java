// repository/ExamRepository.java
package com.school.sms.repository;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository 
        extends JpaRepository<Exam, Long> {

    List<Exam> findByClassRoomId(Long classRoomId);

    @Query("SELECT e FROM Exam e WHERE e.classRoom.id = :classRoomId AND e.academicYear = :academicYear")
    List<Exam> findByClassRoomIdAndAcademicYear(
        Long classRoomId, AcademicYear academicYear);

    @Query("SELECT e FROM Exam e WHERE e.academicYear = :academicYear")
    List<Exam> findByAcademicYear(AcademicYear academicYear);

    List<Exam> findByStatus(String status);
}