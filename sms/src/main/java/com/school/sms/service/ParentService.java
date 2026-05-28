package com.school.sms.service;

import com.school.sms.dto.request.ParentRequest;
import com.school.sms.dto.response.ParentResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParentService {

    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final ParentStudentLinkRepository linkRepository;
    private final AuditLogService auditLogService;
    private final AcademicYearRepository academicYearRepository;

    @Transactional
    public ParentResponse createParent(ParentRequest request) {
        // 1. Check if phone already exists
        if (parentRepository.existsByPhoneAndDeletedAtIsNull(request.getPhone())) {
            throw new RuntimeException("A parent with this phone number already exists.");
        }

        AcademicYear activeYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        // 2. Create Parent profile
        Parent parent = Parent.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .alternatePhone(request.getAlternatePhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .occupation(request.getOccupation())
                .isActive(true)
                .build();

        parent = parentRepository.save(parent);

        // 3. Link students
        if (request.getStudentLinks() != null) {
            for (var linkReq : request.getStudentLinks()) {
                linkStudent(parent, linkReq);
            }
        }

        auditLogService.logCreate("PARENT", parent.getId(), 
            String.format("{\"name\":\"%s\",\"phone\":\"%s\"}", parent.getFirstName() + " " + parent.getLastName(), parent.getPhone()), 
            activeYear != null ? activeYear.getLabel() : null);

        return mapToResponse(parent);
    }

    @Transactional
    public void linkStudent(Parent parent, ParentRequest.StudentLinkRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));

        // Prevent duplicate parent-student links
        boolean alreadyLinked = parent.getStudentLinks().stream()
                .anyMatch(l -> l.getStudent().getId().equals(student.getId()));
        if (alreadyLinked) {
            log.warn("Attempted duplicate link for student {} to parent {}", student.getId(), parent.getId());
            return; 
        }

        ParentStudentLink link = ParentStudentLink.builder()
                .parent(parent)
                .student(student)
                .relationship(req.getRelationshipType())
                .isPrimaryGuardian(req.isPrimaryContact())
                .createdBy("ADMIN")
                .build();

        linkRepository.save(link);
        parent.getStudentLinks().add(link); 
        
        log.info("Linked parent {} to student {}", parent.getId(), student.getId());
    }

    @Transactional(readOnly = true)
    public List<ParentResponse> getAllParents() {
        return parentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParentResponse getParentById(Long id) {
        return parentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", id));
    }

    @Transactional(readOnly = true)
    public List<ParentResponse.StudentLinkResponse> getChildrenByParentPhone(String phone) {
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(phone)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", 0L));
        
        return parent.getStudentLinks().stream().map(l -> {
            Student s = l.getStudent();
            return ParentResponse.StudentLinkResponse.builder()
                .studentId(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .studentCode(s.getStudentId())
                .className(s.getClassRoom() != null ? s.getClassRoom().getName() : "N/A")
                .photoUrl(s.getProfilePhoto())
                .relationshipType(l.getRelationshipType())
                .isPrimaryContact(l.isPrimaryContact())
                .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public ParentResponse updateParent(Long id, ParentRequest request) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", id));

        parent.setFirstName(request.getFirstName());
        parent.setLastName(request.getLastName());
        parent.setPhone(request.getPhone());
        parent.setAlternatePhone(request.getAlternatePhone());
        parent.setEmail(request.getEmail());
        parent.setAddress(request.getAddress());
        parent.setOccupation(request.getOccupation());

        // Sync student links
        if (request.getStudentLinks() != null) {
            linkRepository.deleteByParent(parent);
            parent.getStudentLinks().clear();

            for (var linkReq : request.getStudentLinks()) {
                linkStudent(parent, linkReq);
            }
        }

        parent = parentRepository.save(parent);
        
        auditLogService.logUpdate("PARENT", parent.getId(), "PROFILE", null, null, null);

        return mapToResponse(parent);
    }

    @Transactional
    public void deleteParent(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", id));
        
        parent.setActive(false);
        parent.softDelete("ADMIN"); 
        parentRepository.save(parent);

        auditLogService.logDelete("PARENT", id, 
            String.format("{\"phone\":\"%s\"}", parent.getPhone()), null);
    }

    public ParentResponse mapToResponse(Parent p) {
        List<ParentResponse.StudentLinkResponse> children = p.getStudentLinks().stream().map(l -> {
            Student s = l.getStudent();
            return ParentResponse.StudentLinkResponse.builder()
                .studentId(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .studentCode(s.getStudentId())
                .className(s.getClassRoom() != null ? s.getClassRoom().getName() : "N/A")
                .photoUrl(s.getProfilePhoto())
                .relationshipType(l.getRelationshipType())
                .isPrimaryContact(l.isPrimaryContact())
                .build();
        }).collect(Collectors.toList());

        return ParentResponse.builder()
                .id(p.getId())
                .parentUuid(p.getParentUuid())
                .fullName(p.getFirstName() + " " + (p.getLastName() != null ? p.getLastName() : ""))
                .mobileNumber(p.getPhone())
                .email(p.getEmail())
                .active(p.isActive())
                .children(children)
                .build();
    }
}
