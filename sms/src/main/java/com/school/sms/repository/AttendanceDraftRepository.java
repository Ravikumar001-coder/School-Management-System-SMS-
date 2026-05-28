package com.school.sms.repository;

import com.school.sms.model.AttendanceDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AttendanceDraftRepository extends JpaRepository<AttendanceDraft, Long> {
    Optional<AttendanceDraft> findByTeacherIdAndClassRoomIdAndDateAndPeriodNumberAndSubjectId(
            Long teacherId, Long classRoomId, LocalDate date, Integer periodNumber, Long subjectId);
}
