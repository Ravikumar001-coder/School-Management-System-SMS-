package com.school.sms.repository;

import com.school.sms.model.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    Optional<AttendanceSession> findByTeacherIdAndClassRoomIdAndSessionDateAndPeriodNumberAndSubjectId(
            Long teacherId, Long classRoomId, LocalDate sessionDate, Integer periodNumber, Long subjectId);
}
