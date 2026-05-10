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
        // 1. Check if mobile already exists
        if (parentRepository.existsByMobileNumberAndDeletedAtIsNull(request.getMobileNumber())) {
            throw new RuntimeException("A parent with this mobile number already exists.");
        }

        AcademicYear activeYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);

        // 2. Create Parent profile
        Parent parent = Parent.builder()
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .alternateMobile(request.getAlternateMobile())
                .email(request.getEmail())
                .gender(request.getGender())
                .relationshipDefault(request.getRelationshipDefault())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .occupation(request.getOccupation())
                .photoUrl(request.getPhotoUrl())
                .academicYear(activeYear)
                .build();

        parent = parentRepository.save(parent);

        // 3. Link students
        if (request.getStudentLinks() != null) {
            for (var linkReq : request.getStudentLinks()) {
                linkStudent(parent, linkReq);
            }
        }

        auditLogService.logCreate("PARENT", parent.getId(), 
            String.format("{\"name\":\"%s\",\"mobile\":\"%s\"}", parent.getFullName(), parent.getMobileNumber()), 
            activeYear != null ? activeYear.getLabel() : null);

        return mapToResponse(parent);
    }

    @Transactional
    public void linkStudent(Parent parent, ParentRequest.StudentLinkRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.getStudentId()));

        // Forensic Fix: Prevent duplicate parent-student links in same session
        boolean alreadyLinked = parent.getStudentLinks().stream()
                .anyMatch(l -> l.getStudent().getId().equals(student.getId()));
        if (alreadyLinked) {
            log.warn("Attempted duplicate link for student {} to parent {}", student.getId(), parent.getId());
            return; 
        }

        ParentStudentLink link = ParentStudentLink.builder()
                .parent(parent)
                .student(student)
                .relationshipType(req.getRelationshipType())
                .isPrimaryContact(req.isPrimaryContact())
                .pickupAuthorized(req.isPickupAuthorized())
                .feeResponsible(req.isFeeResponsible())
                .createdBy("ADMIN")
                .build();

        linkRepository.save(link);
        parent.getStudentLinks().add(link); // Keep local state in sync for multi-link sessions
        
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
    public List<ParentResponse.StudentLinkResponse> getChildrenByParentMobile(String mobile) {
        Parent parent = parentRepository.findByMobileNumberAndDeletedAtIsNull(mobile)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", 0L));
        
        return parent.getStudentLinks().stream().map(l -> 
            ParentResponse.StudentLinkResponse.builder()
                .studentId(l.getStudent().getId())
                .firstName(l.getStudent().getFirstName())
                .lastName(l.getStudent().getLastName())
                .studentCode(l.getStudent().getStudentId())
                .className(l.getStudent().getClassRoom() != null ? l.getStudent().getClassRoom().getName() : "N/A")
                .photoUrl(l.getStudent().getProfilePhoto())
                .relationshipType(l.getRelationshipType())
                .isPrimaryContact(l.isPrimaryContact())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public ParentResponse updateParent(Long id, ParentRequest request) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", id));

        parent.setFullName(request.getFullName());
        parent.setMobileNumber(request.getMobileNumber());
        parent.setAlternateMobile(request.getAlternateMobile());
        parent.setEmail(request.getEmail());
        parent.setGender(request.getGender());
        parent.setRelationshipDefault(request.getRelationshipDefault());
        parent.setAddress(request.getAddress());
        parent.setCity(request.getCity());
        parent.setState(request.getState());
        parent.setPincode(request.getPincode());
        parent.setOccupation(request.getOccupation());
        parent.setPhotoUrl(request.getPhotoUrl());

        // Sync student links
        if (request.getStudentLinks() != null) {
            // Remove existing links not in the request (simple approach: clear and re-add or match)
            // For stability, we'll clear and re-link
            linkRepository.deleteByParent(parent);
            parent.getStudentLinks().clear();

            for (var linkReq : request.getStudentLinks()) {
                linkStudent(parent, linkReq);
            }
        }

        parent = parentRepository.save(parent);
        
        auditLogService.logUpdate("PARENT", parent.getId(), "PROFILE", null, null, 
            parent.getAcademicYear() != null ? parent.getAcademicYear().getLabel() : null);

        return mapToResponse(parent);
    }

    @Transactional
    public void deleteParent(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", id));
        
        parent.setActive(false);
        parent.softDelete("ADMIN"); // SoftDeletableEntity method
        parentRepository.save(parent);

        auditLogService.logDelete("PARENT", id, 
            String.format("{\"mobile\":\"%s\"}", parent.getMobileNumber()), 
            parent.getAcademicYear() != null ? parent.getAcademicYear().getLabel() : null);
    }

    public ParentResponse mapToResponse(Parent p) {
        return ParentResponse.builder()
                .id(p.getId())
                .parentUuid(p.getParentUuid())
                .fullName(p.getFullName())
                .mobileNumber(p.getMobileNumber())
                .email(p.getEmail())
                .relationshipDefault(p.getRelationshipDefault())
                .active(p.isActive())
                .children(p.getStudentLinks().stream().map(l -> 
                    ParentResponse.StudentLinkResponse.builder()
                        .studentId(l.getStudent().getId())
                        .firstName(l.getStudent().getFirstName())
                        .lastName(l.getStudent().getLastName())
                        .studentCode(l.getStudent().getStudentId())
                        .className(l.getStudent().getClassRoom() != null ? l.getStudent().getClassRoom().getName() : "N/A")
                        .photoUrl(l.getStudent().getProfilePhoto())
                        .relationshipType(l.getRelationshipType())
                        .isPrimaryContact(l.isPrimaryContact())
                        .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
