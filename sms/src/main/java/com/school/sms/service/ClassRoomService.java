// service/ClassRoomService.java
package com.school.sms.service;

import com.school.sms.dto.request.ClassRoomRequest;
import com.school.sms.dto.response.ClassRoomResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.AcademicYear;
import com.school.sms.model.ClassRoom;
import com.school.sms.model.Subject;
import com.school.sms.model.Teacher;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.ClassRoomRepository;
import com.school.sms.repository.StudentRepository;
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
public class ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository   teacherRepository;
    private final StudentRepository   studentRepository;
    private final SubjectRepository   subjectRepository;
    private final AcademicYearRepository academicYearRepository;

    @Transactional
    @SuppressWarnings("null")
    public ClassRoomResponse createClassRoom(ClassRoomRequest request) {

        AcademicYear academicYear = academicYearRepository.findByLabel(request.getAcademicYear())
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "label", request.getAcademicYear()));

        if (classRoomRepository.existsByNameAndSectionAndAcademicYear(
                request.getName(),
                request.getSection(),
                academicYear)) {
            throw new RuntimeException(
                "Class already exists: " + request.getName() 
                + " - " + request.getSection());
        }

        Teacher teacher = null;
        if (request.getClassTeacherId() != null) {
            Long teacherId = Objects.requireNonNull(request.getClassTeacherId(), "Teacher id is required");
            teacher = teacherRepository
                    .findById(teacherId)
                    .orElseThrow(() -> 
                        new ResourceNotFoundException(
                            "Teacher", teacherId));
        }

        ClassRoom classRoom = ClassRoom.builder()
                .name(request.getName())
                .section(request.getSection())
                .academicYear(academicYear)
                .classTeacher(teacher)
                .subjects(resolveSubjects(request.getSubjectIds()))
                .maxCapacity(request.getMaxCapacity() != null 
                             ? request.getMaxCapacity() : 40)
                .classFee(request.getClassFee())
                .admissionFee(request.getAdmissionFee())
                .build();

        ClassRoom savedClassRoom = Objects.requireNonNull(
            classRoomRepository.save(classRoom),
            "Saved class room must not be null");
        return mapToResponse(savedClassRoom);
    }

    public List<ClassRoomResponse> getAllClassRooms() {
        return classRoomRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClassRoomResponse getClassRoomById(Long id) {
        Long classRoomId = Objects.requireNonNull(id, "ClassRoom id is required");
        ClassRoom c = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("ClassRoom", classRoomId));
        return mapToResponse(c);
    }

    @Transactional
    public ClassRoomResponse updateClassRoom(
            Long id, ClassRoomRequest request) {

        Long classRoomId = Objects.requireNonNull(id, "ClassRoom id is required");
        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> 
                new ResourceNotFoundException("ClassRoom", classRoomId));

        Teacher teacher = null;
        if (request.getClassTeacherId() != null) {
            Long teacherId = Objects.requireNonNull(request.getClassTeacherId(), "Teacher id is required");
            teacher = teacherRepository
                .findById(teacherId)
                    .orElseThrow(() -> 
                        new ResourceNotFoundException(
                    "Teacher", teacherId));
        }

        AcademicYear academicYear = academicYearRepository.findByLabel(request.getAcademicYear())
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "label", request.getAcademicYear()));

        classRoom.setName(request.getName());
        classRoom.setSection(request.getSection());
        classRoom.setAcademicYear(academicYear);
        classRoom.setClassTeacher(teacher);
        classRoom.setSubjects(resolveSubjects(request.getSubjectIds()));
        if (request.getMaxCapacity() != null) {
            classRoom.setMaxCapacity(request.getMaxCapacity());
        }
        classRoom.setClassFee(request.getClassFee());
        classRoom.setAdmissionFee(request.getAdmissionFee());

        return mapToResponse(classRoomRepository.save(classRoom));
    }

    @Transactional
    public void deleteClassRoom(Long id) {
        Long classRoomId = Objects.requireNonNull(id, "ClassRoom id is required");
        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassRoom", classRoomId));
        
        long studentCount = studentRepository.countByClassRoomId(classRoomId);
        if (studentCount > 0) {
            throw new RuntimeException(
                String.format("Cannot delete class '%s-%s' because it has %d active students assigned to it. Please reassign or deactivate students first.", 
                classRoom.getName(), classRoom.getSection(), studentCount));
        }
        
        classRoomRepository.delete(classRoom);
    }

    // ── Helpers ──────────────────────────────────────
    public ClassRoomResponse mapToResponse(ClassRoom c) {
        long studentCount = studentRepository
                .countByClassRoomId(c.getId());

        String teacherName = (c.getClassTeacher() != null)
                ? c.getClassTeacher().getFirstName() + " " 
                  + c.getClassTeacher().getLastName()
                : "Not Assigned";

        return ClassRoomResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .section(c.getSection())
                .academicYear(c.getAcademicYear() != null ? c.getAcademicYear().getLabel() : null)
                .classTeacherId(c.getClassTeacher() != null
                        ? c.getClassTeacher().getId() : null)
                .classTeacherName(teacherName)
                .subjectIds(c.getSubjects() == null ? List.of() : c.getSubjects().stream()
                        .filter(Objects::nonNull)
                        .map(Subject::getId)
                        .collect(Collectors.toList()))
                .subjectNames(c.getSubjects() == null ? List.of() : c.getSubjects().stream()
                        .filter(Objects::nonNull)
                        .map(Subject::getName)
                        .collect(Collectors.toList()))
                .maxCapacity(c.getMaxCapacity())
                .classFee(c.getClassFee())
                .admissionFee(c.getAdmissionFee())
                .studentCount((int) studentCount)
                .build();
    }

    private List<Subject> resolveSubjects(List<Long> subjectIds) {
        if (subjectIds == null || subjectIds.isEmpty()) {
            return List.of();
        }
        return subjectRepository.findAllById(subjectIds);
    }
}