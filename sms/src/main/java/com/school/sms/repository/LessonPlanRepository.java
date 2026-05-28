package com.school.sms.repository;

import com.school.sms.model.LessonPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonPlanRepository extends JpaRepository<LessonPlan, Long> {
    List<LessonPlan> findByTeacherIdAndDeletedAtIsNull(Long teacherId);
    List<LessonPlan> findByClassRoomIdAndDeletedAtIsNull(Long classRoomId);
}
