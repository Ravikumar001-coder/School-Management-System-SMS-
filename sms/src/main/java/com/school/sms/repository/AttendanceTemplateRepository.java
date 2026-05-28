package com.school.sms.repository;

import com.school.sms.model.AttendanceTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttendanceTemplateRepository extends JpaRepository<AttendanceTemplate, Long> {
    List<AttendanceTemplate> findByTeacherIdAndClassRoomId(Long teacherId, Long classRoomId);
}
