// repository/ExamRepository.java
package com.school.sms.repository;

import com.school.sms.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository 
        extends JpaRepository<Exam, Long> {

    List<Exam> findByClassRoomId(Long classRoomId);

    List<Exam> findByClassRoomIdAndAcademicYear(
        Long classRoomId, String academicYear);

    List<Exam> findByAcademicYear(String academicYear);

    List<Exam> findByStatus(String status);
}