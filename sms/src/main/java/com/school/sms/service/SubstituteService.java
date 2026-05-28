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
public class SubstituteService {

    private final SubstituteAssignmentRepository substituteRepo;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;
    private final AcademicYearRepository academicYearRepository;

    /** List substitutes assigned TO a teacher on a given date */
    public List<Map<String, Object>> listForSubstitute(Long userId, LocalDate date) {
        Teacher teacher = getTeacher(userId);
        return substituteRepo.findBySubstituteTeacherIdAndAssignmentDate(teacher.getId(), date)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    /** List substitutes raised BY a teacher (original absent teacher) on a given date */
    public List<Map<String, Object>> listForOriginalTeacher(Long userId, LocalDate date) {
        Teacher teacher = getTeacher(userId);
        return substituteRepo.findByOriginalTeacherIdAndAssignmentDate(teacher.getId(), date)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    /** Admin: list all substitutes on a given date */
    public List<Map<String, Object>> listAll(LocalDate date) {
        return substituteRepo.findAll().stream()
                .filter(s -> s.getAssignmentDate().equals(date))
                .map(this::toMap).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> assign(Long userId, Map<String, Object> body) {
        Teacher originalTeacher = getTeacher(userId);

        Long substituteTeacherId = toLong(body.get("substituteTeacherId"));
        Long classRoomId = toLong(body.get("classRoomId"));
        Long subjectId = toLong(body.get("subjectId"));
        Integer periodNumber = ((Number) body.get("periodNumber")).intValue();
        LocalDate date = LocalDate.parse((String) body.get("assignmentDate"));

        Teacher substitute = teacherRepository.findById(substituteTeacherId)
                .orElseThrow(() -> new RuntimeException("Substitute teacher not found"));
        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new RuntimeException("ClassRoom not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        AcademicYear year = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        SubstituteAssignment sa = SubstituteAssignment.builder()
                .originalTeacher(originalTeacher)
                .substituteTeacher(substitute)
                .classRoom(classRoom)
                .subject(subject)
                .assignmentDate(date)
                .periodNumber(periodNumber)
                .notes(body.containsKey("notes") ? (String) body.get("notes") : null)
                .status("ASSIGNED")
                .academicYear(year)
                .build();

        return toMap(substituteRepo.save(sa));
    }

    @Transactional
    public void updateStatus(Long id, String status) {
        SubstituteAssignment sa = substituteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Substitute assignment not found"));
        sa.setStatus(status);
        substituteRepo.save(sa);
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

    private Map<String, Object> toMap(SubstituteAssignment s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", s.getId());
        m.put("assignmentDate", s.getAssignmentDate());
        m.put("periodNumber", s.getPeriodNumber());
        m.put("status", s.getStatus());
        m.put("notes", s.getNotes());
        m.put("originalTeacherId", s.getOriginalTeacher().getId());
        m.put("originalTeacherName", s.getOriginalTeacher().getFirstName() + " " + s.getOriginalTeacher().getLastName());
        m.put("substituteTeacherId", s.getSubstituteTeacher().getId());
        m.put("substituteTeacherName", s.getSubstituteTeacher().getFirstName() + " " + s.getSubstituteTeacher().getLastName());
        m.put("classRoomId", s.getClassRoom().getId());
        m.put("className", s.getClassRoom().getName());
        m.put("subjectId", s.getSubject().getId());
        m.put("subjectName", s.getSubject().getName());
        m.put("createdAt", s.getCreatedAt());
        return m;
    }
}
