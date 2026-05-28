package com.school.sms.service;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.ExamPaper;
import com.school.sms.model.LessonPlan;
import com.school.sms.model.Teacher;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class TeacherContentService {

    private final LessonPlanRepository lessonPlanRepository;
    private final ExamPaperRepository examPaperRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;

    public List<Map<String, Object>> getLessonPlans(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        return lessonPlanRepository.findByTeacherIdAndDeletedAtIsNull(teacher.getId())
                .stream().map(this::mapLessonPlan).collect(Collectors.toList());
    }

    @Transactional
    public void createLessonPlan(Long userId, Map<String, Object> data) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        LessonPlan plan = LessonPlan.builder()
                .title((String) data.get("title"))
                .description((String) data.get("description"))
                .teacher(teacher)
                .status(LessonPlan.PlanStatus.valueOf((String) data.get("status")))
                .startDate(LocalDate.parse((String) data.get("startDate")))
                .endDate(LocalDate.parse((String) data.get("endDate")))
                .build();

        if (data.get("classRoomId") != null) {
            plan.setClassRoom(classRoomRepository.findById(Long.valueOf(data.get("classRoomId").toString())).orElse(null));
        }
        if (data.get("subjectId") != null) {
            plan.setSubject(subjectRepository.findById(Long.valueOf(data.get("subjectId").toString())).orElse(null));
        }

        lessonPlanRepository.save(plan);
    }

    public List<Map<String, Object>> getExamPapers(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        return examPaperRepository.findByTeacherIdAndDeletedAtIsNull(teacher.getId())
                .stream().map(this::mapExamPaper).collect(Collectors.toList());
    }

    @Transactional
    public void createExamPaper(Long userId, Map<String, Object> data) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        ExamPaper paper = ExamPaper.builder()
                .title((String) data.get("title"))
                .fileUrl((String) data.get("fileUrl"))
                .teacher(teacher)
                .status(ExamPaper.PaperStatus.valueOf((String) data.get("status")))
                .examDate(LocalDate.parse((String) data.get("examDate")))
                .build();

        if (data.get("classRoomId") != null) {
            paper.setClassRoom(classRoomRepository.findById(Long.valueOf(data.get("classRoomId").toString())).orElse(null));
        }
        if (data.get("subjectId") != null) {
            paper.setSubject(subjectRepository.findById(Long.valueOf(data.get("subjectId").toString())).orElse(null));
        }

        examPaperRepository.save(paper);
    }

    private Map<String, Object> mapLessonPlan(LessonPlan p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("name", p.getTitle());
        map.put("class", p.getClassRoom() != null ? p.getClassRoom().getName() : "-");
        map.put("subject", p.getSubject() != null ? p.getSubject().getName() : "-");
        map.put("status", p.getStatus().name());
        map.put("date", p.getUpdatedAt().toLocalDate().toString());
        return map;
    }

    private Map<String, Object> mapExamPaper(ExamPaper p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("title", p.getTitle());
        map.put("subtitle", (p.getClassRoom() != null ? p.getClassRoom().getName() : "") + " - " + (p.getSubject() != null ? p.getSubject().getName() : ""));
        map.put("grade", p.getClassRoom() != null ? p.getClassRoom().getName() : "-");
        map.put("date", p.getExamDate().toString());
        map.put("status", p.getStatus().name());
        map.put("fileUrl", p.getFileUrl());
        return map;
    }
}
