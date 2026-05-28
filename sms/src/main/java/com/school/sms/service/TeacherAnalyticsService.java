package com.school.sms.service;

import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherAnalyticsService {

    private final AttendanceRepository attendanceRepository;
    private final MarkRepository markRepository;
    private final StudentRepository studentRepository;

    /**
     * Calculates attendance trend for the last 30 days for a set of classes.
     */
    public List<Map<String, Object>> getAttendanceTrend(List<Long> classIds, int days) {
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days);

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            List<Attendance> dayAttendance = attendanceRepository.findByDate(date);
            
            long present = dayAttendance.stream()
                .filter(a -> a.getStudent() != null && a.getStudent().getClassRoom() != null)
                .filter(a -> classIds.contains(a.getStudent().getClassRoom().getId()))
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();

            long total = dayAttendance.stream()
                .filter(a -> a.getStudent() != null && a.getStudent().getClassRoom() != null)
                .filter(a -> classIds.contains(a.getStudent().getClassRoom().getId()))
                .count();

            Map<String, Object> point = new HashMap<>();
            point.put("day", date.getDayOfWeek().name().substring(0, 3));
            point.put("val", total == 0 ? 0 : Math.round(present * 100.0 / total));
            trend.add(point);
        }
        return trend;
    }

    /**
     * Calculates grade distribution across all exams in assigned classes.
     */
    public Map<String, Long> getGradeDistribution(List<Long> classIds) {
        List<Mark> allMarks = markRepository.findAll().stream()
            .filter(m -> m.getExam() != null && m.getExam().getClassRoom() != null)
            .filter(m -> classIds.contains(m.getExam().getClassRoom().getId()))
            .collect(Collectors.toList());

        Map<String, Long> distribution = new HashMap<>();
        for (Mark m : allMarks) {
            String grade = calculateGrade(m.getMarksObtained(), m.getTotalMarks());
            distribution.put(grade, distribution.getOrDefault(grade, 0L) + 1);
        }
        return distribution;
    }

    private String calculateGrade(Double marks, Double total) {
        if (total == null || total == 0) return "F";
        double pct = (marks / total) * 100;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B";
        if (pct >= 60) return "C";
        if (pct >= 50) return "D";
        return "F";
    }
}
