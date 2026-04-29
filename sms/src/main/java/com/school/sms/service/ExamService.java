// service/ExamService.java
package com.school.sms.service;

import com.school.sms.dto.request.BulkMarkRequest;
import com.school.sms.dto.request.ExamRequest;
import com.school.sms.dto.request.MarkRequest;
import com.school.sms.dto.response.ExamResponse;
import com.school.sms.dto.response.MarkResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository      examRepository;
    private final MarkRepository      markRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository   subjectRepository;
    private final StudentRepository   studentRepository;

    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        ClassRoom classRoom = classRoomRepository
                .findById(request.getClassRoomId())
                .orElseThrow(() -> 
                    new ResourceNotFoundException(
                        "ClassRoom", request.getClassRoomId()));

        Subject subject = subjectRepository
                .findById(request.getSubjectId())
                .orElseThrow(() -> 
                    new ResourceNotFoundException(
                        "Subject", request.getSubjectId()));

        Exam exam = Exam.builder()
                .name(request.getName())
                .examType(request.getExamType())
                .classRoom(classRoom)
                .subject(subject)
                .examDate(request.getExamDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalMarks(request.getTotalMarks() != null 
                            ? request.getTotalMarks() : 100)
                .passingMarks(request.getPassingMarks() != null 
                              ? request.getPassingMarks() : 33)
                .venue(request.getVenue())
                .academicYear(request.getAcademicYear())
                .status("SCHEDULED")
                .build();

        return mapToResponse(examRepository.save(exam));
    }

    public List<ExamResponse> getAllExams() {
        return examRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExamResponse> getExamsByClass(Long classId) {
        return examRepository.findByClassRoomId(classId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Enter marks for entire class at once
    @Transactional
    public Map<String, Object> enterBulkMarks(BulkMarkRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> 
                    new ResourceNotFoundException(
                        "Exam", request.getExamId()));

        int saved   = 0;
        int updated = 0;

        for (MarkRequest mr : request.getMarks()) {
            Student student = studentRepository
                    .findById(mr.getStudentId())
                    .orElse(null);
            if (student == null) continue;

            // Check if mark already exists
            var existing = markRepository
                    .findByStudentIdAndExamId(
                        mr.getStudentId(), exam.getId());

            String grade = null;
            if (!mr.isAbsent()
                    && mr.getMarksObtained() != null) {
                grade = calculateGrade(
                    mr.getMarksObtained(), exam.getTotalMarks());
            }

            if (existing.isPresent()) {
                // Update existing
                Mark mark = existing.get();
                mark.setMarksObtained(mr.getMarksObtained());
                mark.setAbsent(mr.isAbsent());
                mark.setGrade(grade);
                mark.setRemarks(mr.getRemarks());
                markRepository.save(mark);
                updated++;
            } else {
                // Create new
                Mark mark = Mark.builder()
                        .student(student)
                        .exam(exam)
                        .marksObtained(mr.getMarksObtained())
                        .totalMarks(exam.getTotalMarks() != null
                            ? exam.getTotalMarks().doubleValue() : null)
                        .grade(grade)
                        .absent(mr.isAbsent())
                        .remarks(mr.getRemarks())
                        .build();
                markRepository.save(mark);
                saved++;
            }
        }

        // Update exam status
        exam.setStatus("COMPLETED");
        examRepository.save(exam);

        return Map.of(
            "message", "Marks entered successfully",
            "saved",   saved,
            "updated", updated,
            "examId",  exam.getId()
        );
    }

    // Get all marks for an exam
    public List<MarkResponse> getExamMarks(Long examId) {
        return markRepository.findByExamId(examId)
                .stream()
                .map(this::mapMarkToResponse)
                .collect(Collectors.toList());
    }

    // Get student's report card (all marks)
    public List<MarkResponse> getStudentReportCard(
            Long studentId, String academicYear) {
        return markRepository
                .findStudentMarksByYear(studentId, academicYear)
                .stream()
                .map(this::mapMarkToResponse)
                .collect(Collectors.toList());
    }

    // Get class topper for an exam
    public MarkResponse getClassTopper(Long examId) {
        return markRepository.findByExamOrderByMarks(examId)
                .stream()
                .findFirst()
                .map(this::mapMarkToResponse)
                .orElseThrow(() -> 
                    new ResourceNotFoundException(
                        "No marks found for exam: " + examId));
    }

    // ── Helpers ──────────────────────────────────────
    private String calculateGrade(Double obtained, Integer total) {
        if (total == null || total == 0) return "N/A";
        double pct = (obtained / total) * 100;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B+";
        if (pct >= 60) return "B";
        if (pct >= 50) return "C";
        if (pct >= 33) return "D";
        return "F";
    }

    private ExamResponse mapToResponse(Exam e) {
        return ExamResponse.builder()
                .id(e.getId())
                .name(e.getName())
                .examType(e.getExamType())
                .className(e.getClassRoom() != null
                    ? e.getClassRoom().getName() 
                      + " - " + e.getClassRoom().getSection()
                    : null)
                .subjectName(e.getSubject() != null 
                    ? e.getSubject().getName() : null)
                .examDate(e.getExamDate())
                .startTime(e.getStartTime())
                .endTime(e.getEndTime())
                .totalMarks(e.getTotalMarks())
                .passingMarks(e.getPassingMarks())
                .venue(e.getVenue())
                .status(e.getStatus())
                .academicYear(e.getAcademicYear())
                .build();
    }

    private MarkResponse mapMarkToResponse(Mark m) {
        boolean passed = !m.isAbsent()
                && m.getMarksObtained() != null
                && m.getTotalMarks() != null
                && m.getMarksObtained() >= m.getExam().getPassingMarks();

        return MarkResponse.builder()
                .id(m.getId())
                .studentName(m.getStudent().getFirstName() 
                             + " " + m.getStudent().getLastName())
                .studentCode(m.getStudent().getStudentId())
                .examName(m.getExam().getName())
                .subjectName(m.getExam().getSubject() != null 
                             ? m.getExam().getSubject().getName() : null)
                .marksObtained(m.getMarksObtained())
                .totalMarks(m.getTotalMarks() != null
                    ? m.getTotalMarks().intValue() : null)
                .grade(m.getGrade())
                .absent(m.isAbsent())
                .passed(passed)
                .build();
    }
}