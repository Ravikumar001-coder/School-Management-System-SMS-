package com.school.sms.service;

import com.school.sms.dto.response.StudentRankResponse;
import com.school.sms.model.Mark;
import com.school.sms.repository.MarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarkCalculationService {

    private final MarkRepository markRepository;

    @Transactional(readOnly = true)
    public List<StudentRankResponse> calculateClassRankings(Long classRoomId, Long examId) {
        List<Mark> marks = markRepository.findByExam_Id(examId);
        
        // Group marks by student
        Map<Long, List<Mark>> studentMarksMap = marks.stream()
                .filter(m -> m.getStudent().getClassRoom() != null && m.getStudent().getClassRoom().getId().equals(classRoomId))
                .collect(Collectors.groupingBy(m -> m.getStudent().getId()));

        List<StudentRankResponse> rankings = studentMarksMap.entrySet().stream()
                .map(entry -> {
                    Long studentId = entry.getKey();
                    List<Mark> studentMarks = entry.getValue();
                    
                    double totalObtained = studentMarks.stream().mapToDouble(m -> m.getMarksObtained() != null ? m.getMarksObtained() : 0.0).sum();
                    double totalMax = studentMarks.stream().mapToDouble(m -> m.getTotalMarks() != null ? m.getTotalMarks() : 100.0).sum();
                    double percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0.0;
                    
                    var firstMark = studentMarks.get(0);
                    return StudentRankResponse.builder()
                            .studentId(studentId)
                            .studentName(firstMark.getStudent().getFirstName() + " " + firstMark.getStudent().getLastName())
                            .rollNumber(firstMark.getStudent().getStudentId())
                            .totalMarksObtained(totalObtained)
                            .totalMaxMarks(totalMax)
                            .percentage(Math.round(percentage * 100.0) / 100.0)
                            .grade(calculateGrade(percentage))
                            .build();
                })
                .sorted(Comparator.comparing(StudentRankResponse::getPercentage).reversed())
                .collect(Collectors.toList());

        // Assign ranks
        for (int i = 0; i < rankings.size(); i++) {
            rankings.get(i).setRank(i + 1);
        }

        return rankings;
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 33) return "D";
        return "F";
    }
}
