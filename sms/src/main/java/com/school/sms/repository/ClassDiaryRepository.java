package com.school.sms.repository;

import com.school.sms.model.ClassDiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClassDiaryRepository extends JpaRepository<ClassDiary, Long> {
    List<ClassDiary> findByClassRoomIdAndEntryDate(Long classRoomId, LocalDate entryDate);
    List<ClassDiary> findByTeacherIdAndEntryDate(Long teacherId, LocalDate entryDate);
    List<ClassDiary> findByClassRoomIdAndEntryDateBetweenOrderByEntryDateDesc(
            Long classRoomId, LocalDate from, LocalDate to);
}
