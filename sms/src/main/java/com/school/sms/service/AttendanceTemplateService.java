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
public class AttendanceTemplateService {

    private final AttendanceTemplateRepository templateRepository;
    private final AttendanceDraftRepository draftRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AcademicYearRepository academicYearRepository;

    // ──────────────── TEMPLATES ────────────────

    public List<Map<String, Object>> listTemplates(Long userId, Long classRoomId) {
        Teacher teacher = getTeacher(userId);
        List<AttendanceTemplate> templates = templateRepository.findByTeacherIdAndClassRoomId(teacher.getId(), classRoomId);
        return templates.stream().map(this::toTemplateMap).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> saveTemplate(Long userId, Map<String, Object> body) {
        Teacher teacher = getTeacher(userId);
        Long classRoomId = toLong(body.get("classRoomId"));
        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new RuntimeException("ClassRoom not found"));

        AcademicYear year = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        AttendanceTemplate template = AttendanceTemplate.builder()
                .teacher(teacher)
                .classRoom(classRoom)
                .name((String) body.get("name"))
                .templateData((String) body.get("templateData"))
                .isSystemTemplate(false)
                .academicYear(year)
                .build();

        template = templateRepository.save(template);
        return toTemplateMap(template);
    }

    @Transactional
    public void deleteTemplate(Long userId, Long templateId) {
        Teacher teacher = getTeacher(userId);
        AttendanceTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        if (!template.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Access denied");
        }
        templateRepository.delete(template);
    }

    // ──────────────── DRAFTS ────────────────

    public Map<String, Object> getDraft(Long userId, Long classRoomId, LocalDate date,
                                         Integer periodNumber, Long subjectId) {
        Teacher teacher = getTeacher(userId);
        Optional<AttendanceDraft> draft = draftRepository
                .findByTeacherIdAndClassRoomIdAndDateAndPeriodNumberAndSubjectId(
                        teacher.getId(), classRoomId, date, periodNumber, subjectId);
        return draft.map(this::toDraftMap).orElse(null);
    }

    @Transactional
    public Map<String, Object> saveDraft(Long userId, Map<String, Object> body) {
        Teacher teacher = getTeacher(userId);
        Long classRoomId = toLong(body.get("classRoomId"));
        Long subjectId = body.get("subjectId") != null ? toLong(body.get("subjectId")) : null;
        Integer periodNumber = body.get("periodNumber") != null ? ((Number) body.get("periodNumber")).intValue() : null;
        LocalDate date = body.get("date") != null ? LocalDate.parse((String) body.get("date")) : LocalDate.now();

        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new RuntimeException("ClassRoom not found"));
        AcademicYear year = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        Optional<AttendanceDraft> existing = draftRepository
                .findByTeacherIdAndClassRoomIdAndDateAndPeriodNumberAndSubjectId(
                        teacher.getId(), classRoomId, date, periodNumber, subjectId);

        AttendanceDraft draft;
        if (existing.isPresent()) {
            draft = existing.get();
            if (Boolean.TRUE.equals(draft.getIsLocked())) {
                throw new RuntimeException("This attendance session is locked and cannot be edited.");
            }
            draft.setDraftData((String) body.get("draftData"));
        } else {
            draft = AttendanceDraft.builder()
                    .teacher(teacher)
                    .classRoom(classRoom)
                    .date(date)
                    .periodNumber(periodNumber)
                    .draftData((String) body.get("draftData"))
                    .isLocked(false)
                    .academicYear(year)
                    .build();
        }

        draft = draftRepository.save(draft);
        return toDraftMap(draft);
    }

    @Transactional
    public void lockDraft(Long userId, Long draftId) {
        Teacher teacher = getTeacher(userId);
        AttendanceDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        if (!draft.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Access denied");
        }
        draft.setIsLocked(true);
        draftRepository.save(draft);
    }

    // ──────────────── Helpers ────────────────

    private Teacher getTeacher(Long userId) {
        return teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
    }

    private Long toLong(Object val) {
        if (val instanceof Number) return ((Number) val).longValue();
        if (val instanceof String) return Long.parseLong((String) val);
        throw new RuntimeException("Invalid numeric value: " + val);
    }

    private Map<String, Object> toTemplateMap(AttendanceTemplate t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId());
        m.put("name", t.getName());
        m.put("templateData", t.getTemplateData());
        m.put("classRoomId", t.getClassRoom().getId());
        m.put("createdAt", t.getCreatedAt());
        return m;
    }

    private Map<String, Object> toDraftMap(AttendanceDraft d) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", d.getId());
        m.put("date", d.getDate());
        m.put("periodNumber", d.getPeriodNumber());
        m.put("draftData", d.getDraftData());
        m.put("isLocked", d.getIsLocked());
        m.put("classRoomId", d.getClassRoom().getId());
        m.put("updatedAt", d.getUpdatedAt());
        return m;
    }
}
