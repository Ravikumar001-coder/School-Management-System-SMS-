package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.MealAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealAttendanceRepository extends JpaRepository<MealAttendance, Long> {
    List<MealAttendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
}
