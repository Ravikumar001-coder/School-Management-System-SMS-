package com.school.sms.repository;

import com.school.sms.model.Timetable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    @EntityGraph(attributePaths = {"subject", "teacher", "classRoom"})
    List<Timetable> findByClassRoomIdOrderByPeriodNumber(Long classRoomId);

    @EntityGraph(attributePaths = {"subject", "teacher", "classRoom"})
    List<Timetable> findByTeacherIdOrderByDayOfWeekAscPeriodNumberAsc(Long teacherId);

    @EntityGraph(attributePaths = {"subject", "teacher", "classRoom"})
    List<Timetable> findByTeacherIdAndDayOfWeekOrderByPeriodNumber(Long teacherId, String dayOfWeek);

    @EntityGraph(attributePaths = {"subject", "teacher", "classRoom"})
    List<Timetable> findByTeacherId(Long teacherId);
}
