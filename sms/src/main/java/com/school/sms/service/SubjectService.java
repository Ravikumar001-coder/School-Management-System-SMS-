// service/SubjectService.java
package com.school.sms.service;

import com.school.sms.dto.request.SubjectRequest;
import com.school.sms.dto.response.SubjectResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.ClassRoom;
import com.school.sms.model.Subject;
import com.school.sms.model.Teacher;
import com.school.sms.repository.ClassRoomRepository;
import com.school.sms.repository.DepartmentRepository;
import com.school.sms.repository.SubjectRepository;
import com.school.sms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        if (request.getCode() != null 
                && subjectRepository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                "Subject code already exists: " + request.getCode());
        }

        ClassRoom classRoom = resolveClassRoom(request.getClassRoomId());
        Teacher assignedTeacher = resolveTeacher(request.getAssignedTeacherId());

        Subject subject = Subject.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .department(resolveDepartment(request.getDepartment()))
                .classRoom(classRoom)
                .assignedTeacher(assignedTeacher)
                .totalMarks(request.getTotalMarks() != null 
                            ? request.getTotalMarks() : 100)
                .passingMarks(request.getPassingMarks() != null 
                              ? request.getPassingMarks() : 33)
                .subjectType(request.getSubjectType() != null 
                             ? request.getSubjectType() : "THEORY")
                .build();

        Subject saved = subjectRepository.save(subject);
        syncTeacherAndClassBindings(saved, assignedTeacher, classRoom);
        return mapToResponse(saved);
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SubjectResponse getSubjectById(Long id) {
        return mapToResponse(subjectRepository.findById(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Subject", id)));
    }

    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest req) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Subject", id));

        Teacher previousTeacher = subject.getAssignedTeacher();
        ClassRoom previousClassRoom = subject.getClassRoom();

        Teacher assignedTeacher = resolveTeacher(req.getAssignedTeacherId());
        ClassRoom classRoom = resolveClassRoom(req.getClassRoomId());

        subject.setName(req.getName());
        subject.setCode(req.getCode());
        subject.setDescription(req.getDescription());
        subject.setDepartment(resolveDepartment(req.getDepartment()));
        subject.setAssignedTeacher(assignedTeacher);
        subject.setClassRoom(classRoom);
        if (req.getTotalMarks()  != null) 
            subject.setTotalMarks(req.getTotalMarks());
        if (req.getPassingMarks() != null) 
            subject.setPassingMarks(req.getPassingMarks());
        if (req.getSubjectType() != null) 
            subject.setSubjectType(req.getSubjectType());

        Subject updated = subjectRepository.save(subject);
        unbindTeacherAndClass(previousTeacher, previousClassRoom, updated);
        syncTeacherAndClassBindings(updated, assignedTeacher, classRoom);
        return mapToResponse(updated);
    }

    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject", id);
        }
        subjectRepository.deleteById(id);
    }

    // ── Helpers ──────────────────────────────────────
    public SubjectResponse mapToResponse(Subject s) {
        String className = (s.getClassRoom() != null)
                ? s.getClassRoom().getName() : null;
        String classSection = (s.getClassRoom() != null)
                ? s.getClassRoom().getSection() : null;
        String classLabel = (className != null && classSection != null)
                ? className + "-" + classSection
                : "Not Assigned";

        String teacherName = (s.getAssignedTeacher() != null)
                ? ((s.getAssignedTeacher().getFirstName() == null ? "" : s.getAssignedTeacher().getFirstName())
                   + " "
                   + (s.getAssignedTeacher().getLastName() == null ? "" : s.getAssignedTeacher().getLastName())).trim()
                : "Not Assigned";

        return SubjectResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .code(s.getCode())
                .description(s.getDescription())
                .department(s.getDepartment() != null ? s.getDepartment().getName() : "General")
                .classRoomId(s.getClassRoom() != null ? s.getClassRoom().getId() : null)
                .className(className)
                .classSection(classSection)
                .classLabel(classLabel)
                .assignedTeacherId(s.getAssignedTeacher() != null ? s.getAssignedTeacher().getId() : null)
                .assignedTeacherName(teacherName)
                .totalMarks(s.getTotalMarks())
                .passingMarks(s.getPassingMarks())
                .subjectType(s.getSubjectType())
                .build();
    }

    private Teacher resolveTeacher(Long teacherId) {
        if (teacherId == null) {
            return null;
        }
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));
    }

    private ClassRoom resolveClassRoom(Long classRoomId) {
        if (classRoomId == null) {
            return null;
        }
        return classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassRoom", classRoomId));
    }

    private com.school.sms.model.Department resolveDepartment(String name) {
        if (name == null || name.isEmpty()) {
            return null;
        }
        return departmentRepository.findByName(name).orElseGet(() -> {
            com.school.sms.model.Department dept = com.school.sms.model.Department.builder().name(name).build();
            return departmentRepository.save(dept);
        });
    }

    private void syncTeacherAndClassBindings(Subject subject, Teacher teacher, ClassRoom classRoom) {
        if (teacher != null) {
            List<Subject> teacherSubjects = teacher.getSubjects() == null
                    ? new java.util.ArrayList<>()
                    : new java.util.ArrayList<>(teacher.getSubjects());

            boolean exists = teacherSubjects.stream()
                    .filter(Objects::nonNull)
                    .anyMatch(s -> Objects.equals(s.getId(), subject.getId()));
            if (!exists) {
                teacherSubjects.add(subject);
                teacher.setSubjects(teacherSubjects);
                teacherRepository.save(teacher);
            }
        }

        if (classRoom != null) {
            List<Subject> classSubjects = classRoom.getSubjects() == null
                    ? new java.util.ArrayList<>()
                    : new java.util.ArrayList<>(classRoom.getSubjects());

            boolean exists = classSubjects.stream()
                    .filter(Objects::nonNull)
                    .anyMatch(s -> Objects.equals(s.getId(), subject.getId()));
            if (!exists) {
                classSubjects.add(subject);
                classRoom.setSubjects(classSubjects);
                classRoomRepository.save(classRoom);
            }
        }
    }

    private void unbindTeacherAndClass(Teacher previousTeacher, ClassRoom previousClassRoom, Subject subject) {
        if (previousTeacher != null && previousTeacher.getSubjects() != null) {
            List<Subject> next = previousTeacher.getSubjects().stream()
                    .filter(Objects::nonNull)
                    .filter(s -> !Objects.equals(s.getId(), subject.getId()))
                    .collect(Collectors.toList());
            previousTeacher.setSubjects(next);
            teacherRepository.save(previousTeacher);
        }

        if (previousClassRoom != null && previousClassRoom.getSubjects() != null) {
            List<Subject> next = previousClassRoom.getSubjects().stream()
                    .filter(Objects::nonNull)
                    .filter(s -> !Objects.equals(s.getId(), subject.getId()))
                    .collect(Collectors.toList());
            previousClassRoom.setSubjects(next);
            classRoomRepository.save(previousClassRoom);
        }
    }
}