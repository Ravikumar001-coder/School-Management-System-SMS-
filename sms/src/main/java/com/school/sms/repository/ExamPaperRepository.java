package com.school.sms.repository;

import com.school.sms.model.ExamPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamPaperRepository extends JpaRepository<ExamPaper, Long> {
    List<ExamPaper> findByTeacherIdAndDeletedAtIsNull(Long teacherId);
    java.util.Optional<ExamPaper> findByFileUrlAndDeletedAtIsNull(String fileUrl);
}
