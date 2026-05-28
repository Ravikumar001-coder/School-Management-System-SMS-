package com.school.sms.service;

import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;
    private final AcademicYearRepository academicYearRepository;

    public List<Map<String, Object>> listByTeacher(Long userId) {
        Teacher teacher = getTeacher(userId);
        return homeworkRepository.findAll().stream()
                .filter(h -> h.getTeacher().getId().equals(teacher.getId()))
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> listByClassRoom(Long classRoomId) {
        return homeworkRepository.findByClassRoomIdOrderByDueDateAsc(classRoomId)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> create(Long userId, Map<String, Object> body) {
        Teacher teacher = getTeacher(userId);

        Long classRoomId = toLong(body.get("classRoomId"));
        Long subjectId = toLong(body.get("subjectId"));

        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new RuntimeException("ClassRoom not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        AcademicYear year = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        String status = body.containsKey("status") ? (String) body.get("status") : "PUBLISHED";
        LocalDate assignedDate = body.containsKey("assignedDate")
                ? LocalDate.parse((String) body.get("assignedDate")) : LocalDate.now();
        LocalDate dueDate = LocalDate.parse((String) body.get("dueDate"));

        Homework hw = Homework.builder()
                .teacher(teacher)
                .classRoom(classRoom)
                .subject(subject)
                .title((String) body.get("title"))
                .description((String) body.get("description"))
                .attachmentUrl((String) body.get("attachmentUrl"))
                .assignedDate(assignedDate)
                .dueDate(dueDate)
                .status(status)
                .resourceLinks(body.containsKey("resourceLinks") ? (String) body.get("resourceLinks") : null)
                .academicYear(year)
                .build();

        hw = homeworkRepository.save(hw);
        return toMap(hw);
    }

    @Transactional
    public Map<String, Object> update(Long userId, Long id, Map<String, Object> body) {
        Teacher teacher = getTeacher(userId);
        Homework hw = homeworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Homework not found"));
        if (!hw.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Access denied: you don't own this homework");
        }

        if (body.containsKey("title")) hw.setTitle((String) body.get("title"));
        if (body.containsKey("description")) hw.setDescription((String) body.get("description"));
        if (body.containsKey("dueDate")) hw.setDueDate(LocalDate.parse((String) body.get("dueDate")));
        if (body.containsKey("status")) hw.setStatus((String) body.get("status"));
        if (body.containsKey("attachmentUrl")) hw.setAttachmentUrl((String) body.get("attachmentUrl"));
        if (body.containsKey("resourceLinks")) hw.setResourceLinks((String) body.get("resourceLinks"));

        return toMap(homeworkRepository.save(hw));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        Teacher teacher = getTeacher(userId);
        Homework hw = homeworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Homework not found"));
        if (!hw.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Access denied");
        }
        homeworkRepository.delete(hw);
    }

    // ─── Helpers ───

    private Teacher getTeacher(Long userId) {
        return teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
    }

    private Long toLong(Object val) {
        if (val instanceof Number) return ((Number) val).longValue();
        if (val instanceof String) return Long.parseLong((String) val);
        throw new RuntimeException("Invalid numeric value: " + val);
    }

    private Map<String, Object> toMap(Homework h) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", h.getId());
        m.put("title", h.getTitle());
        m.put("description", h.getDescription());
        m.put("attachmentUrl", h.getAttachmentUrl());
        m.put("assignedDate", h.getAssignedDate());
        m.put("dueDate", h.getDueDate());
        m.put("status", h.getStatus());
        m.put("resourceLinks", h.getResourceLinks());
        m.put("classRoomId", h.getClassRoom().getId());
        m.put("className", h.getClassRoom().getName());
        m.put("subjectId", h.getSubject().getId());
        m.put("subjectName", h.getSubject().getName());
        m.put("teacherId", h.getTeacher().getId());
        m.put("createdAt", h.getCreatedAt());
        return m;
    }
}
