package com.school.sms.service.hostel;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.AcademicYear;
import com.school.sms.model.Student;
import com.school.sms.model.User;
import com.school.sms.model.hostel.*;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.StudentRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.hostel.*;
import com.school.sms.service.AuditLogService;
import com.school.sms.dto.hostel.HostelDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HostelAllocationService {

    private final HostelAllocationRepository allocationRepository;
    private final HostelBedRepository bedRepository;
    private final HostelRoomRepository roomRepository;
    private final StudentRepository studentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<HostelAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public HostelDto.EligibilityResponse checkEligibility(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        HostelDto.EligibilityResponse response = new HostelDto.EligibilityResponse();
        response.setStudentId(studentId);
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setGender(student.getGender());
        response.setMedicalConditions(student.getMedicalConditions());
        
        java.util.List<String> warnings = new java.util.ArrayList<>();

        // Check active allocation
        allocationRepository.findByStudentIdAndStatus(studentId, HostelAllocation.AllocationStatus.ACTIVE)
                .ifPresentOrElse(alloc -> {
                    response.setHasActiveAllocation(true);
                    response.setCurrentRoom(alloc.getBed().getRoom().getRoomNumber());
                    warnings.add("Student already has an active allocation.");
                }, () -> {
                    response.setHasActiveAllocation(false);
                });

        // Mock outstanding dues (since full ledger doesn't exist yet)
        response.setOutstandingDues(0.0);

        if (student.getGender() == null || student.getGender().isEmpty()) {
            warnings.add("Student gender is not specified.");
        }

        response.setEligible(!response.getHasActiveAllocation() && response.getOutstandingDues() <= 0.0);
        response.setWarnings(warnings);

        return response;
    }

    public HostelAllocation allocateRoom(HostelDto.EnhancedAllocationRequest req, Long allocatedById) {
        allocationRepository.findByStudentIdAndStatus(req.getStudentId(), HostelAllocation.AllocationStatus.ACTIVE)
                .ifPresent(alloc -> {
                    throw new IllegalStateException("Student already has an active hostel allocation");
                });

        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        HostelBed bed = bedRepository.findById(req.getBedId())
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found"));

        if (bed.getIsOccupied()) {
            throw new IllegalStateException("Bed is already occupied");
        }

        AcademicYear academicYear = academicYearRepository.findById(req.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Year not found"));

        User allocatedBy = userRepository.findById(allocatedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        HostelRoom room = bed.getRoom();
        HostelBlock.GenderType blockGender = room.getFloor().getBlock().getGenderType();
        String studentGender = student.getGender();
        
        if (blockGender == HostelBlock.GenderType.BOYS && !"Male".equalsIgnoreCase(studentGender)) {
            throw new IllegalArgumentException("Cannot allocate a female student to a boys block");
        }
        if (blockGender == HostelBlock.GenderType.GIRLS && !"Female".equalsIgnoreCase(studentGender)) {
            throw new IllegalArgumentException("Cannot allocate a male student to a girls block");
        }

        HostelAllocation allocation = HostelAllocation.builder()
                .student(student)
                .bed(bed)
                .academicYear(academicYear)
                .allocationDate(LocalDate.now())
                .allocatedBy(allocatedBy)
                .notes(req.getNotes())
                .status(HostelAllocation.AllocationStatus.ACTIVE)
                .expectedCheckoutDate(req.getExpectedCheckoutDate())
                .allocationType(req.getAllocationType() != null ? req.getAllocationType() : "REGULAR")
                .lockerAssigned(req.getLockerAssigned() != null ? req.getLockerAssigned() : false)
                .rfidCardAssigned(req.getRfidCardAssigned() != null ? req.getRfidCardAssigned() : false)
                .transportLinked(req.getTransportLinked() != null ? req.getTransportLinked() : false)
                .messPlanId(req.getMessPlanId())
                .adminApproval(req.getAdminApproval() != null ? req.getAdminApproval() : false)
                .parentConsent(req.getParentConsent() != null ? req.getParentConsent() : false)
                .guardianApproval(req.getGuardianApproval() != null ? req.getGuardianApproval() : false)
                .medicalNotes(req.getMedicalNotes())
                .specialNeeds(req.getSpecialNeeds())
                .emergencyContact(req.getEmergencyContact())
                .build();

        bed.setIsOccupied(true);
        bedRepository.save(bed);

        room.setAvailableBeds(room.getAvailableBeds() - 1);
        if (room.getAvailableBeds() == 0) {
            room.setStatus(HostelRoom.RoomStatus.FULL);
        }
        roomRepository.save(room);

        HostelAllocation savedAlloc = allocationRepository.save(allocation);

        String auditDetails = String.format("Allocated bed %s in room %s to student %s", bed.getBedNumber(), room.getRoomNumber(), student.getStudentId());
        auditLogService.logCreate("HostelAllocation", savedAlloc.getId(), auditDetails, academicYear.getLabel());

        return savedAlloc;
    }

    public HostelAllocation vacateRoom(Long allocationId, HostelDto.VacateRequest req, Long userId) {
        HostelAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found"));

        if (allocation.getStatus() != HostelAllocation.AllocationStatus.ACTIVE) {
            throw new IllegalStateException("Allocation is not active");
        }

        allocation.setStatus(HostelAllocation.AllocationStatus.VACATED);
        allocation.setVacatedDate(req.getVacateDate() != null ? req.getVacateDate() : LocalDate.now());
        allocation.setNotes((allocation.getNotes() != null ? allocation.getNotes() + "\n" : "") + "Vacated: " + req.getRemarks());

        HostelBed bed = allocation.getBed();
        bed.setIsOccupied(false);
        bedRepository.save(bed);

        HostelRoom room = bed.getRoom();
        room.setAvailableBeds(room.getAvailableBeds() + 1);
        if (room.getStatus() == HostelRoom.RoomStatus.FULL) {
            room.setStatus(HostelRoom.RoomStatus.AVAILABLE);
        }
        roomRepository.save(room);

        HostelAllocation savedAlloc = allocationRepository.save(allocation);

        String auditDetails = String.format("Vacated. Damage: %s, Refund: %s", req.getDamageCharges(), req.getRefundAmount());
        auditLogService.logUpdate("HostelAllocation", savedAlloc.getId(), "status", "ACTIVE", "VACATED", auditDetails);

        return savedAlloc;
    }

    public HostelAllocation transferRoom(Long allocationId, HostelDto.TransferRequest req, Long userId) {
        HostelAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found"));

        if (allocation.getStatus() != HostelAllocation.AllocationStatus.ACTIVE) {
            throw new IllegalStateException("Allocation is not active");
        }

        HostelBed oldBed = allocation.getBed();
        HostelBed newBed = bedRepository.findById(req.getNewBedId())
                .orElseThrow(() -> new ResourceNotFoundException("New Bed not found"));

        if (newBed.getIsOccupied()) {
            throw new IllegalStateException("New Bed is already occupied");
        }

        // Free old bed
        oldBed.setIsOccupied(false);
        bedRepository.save(oldBed);
        HostelRoom oldRoom = oldBed.getRoom();
        oldRoom.setAvailableBeds(oldRoom.getAvailableBeds() + 1);
        if (oldRoom.getStatus() == HostelRoom.RoomStatus.FULL) oldRoom.setStatus(HostelRoom.RoomStatus.AVAILABLE);
        roomRepository.save(oldRoom);

        // Occupy new bed
        newBed.setIsOccupied(true);
        bedRepository.save(newBed);
        HostelRoom newRoom = newBed.getRoom();
        newRoom.setAvailableBeds(newRoom.getAvailableBeds() - 1);
        if (newRoom.getAvailableBeds() == 0) newRoom.setStatus(HostelRoom.RoomStatus.FULL);
        roomRepository.save(newRoom);

        // Update allocation
        allocation.setPreviousRoom(oldRoom.getRoomNumber());
        allocation.setTransferReason(req.getReason());
        allocation.setBed(newBed);

        HostelAllocation savedAlloc = allocationRepository.save(allocation);
        auditLogService.logUpdate("HostelAllocation", savedAlloc.getId(), "bed", oldBed.getBedNumber(), newBed.getBedNumber(), "Transferred");

        return savedAlloc;
    }

    public java.util.List<HostelAllocation> bulkAllocate(HostelDto.BulkAllocationRequest req, Long userId) {
        // Find available beds in block/floor
        List<HostelBed> availableBeds = bedRepository.findAll().stream()
            .filter(b -> {
                boolean match = !b.getIsOccupied();
                if (req.getFloorId() != null) {
                    match = match && b.getRoom().getFloor().getId().equals(req.getFloorId());
                } else if (req.getBlockId() != null) {
                    match = match && b.getRoom().getFloor().getBlock().getId().equals(req.getBlockId());
                }
                return match;
            }).collect(java.util.stream.Collectors.toList());

        if (availableBeds.size() < req.getStudentIds().size()) {
            throw new IllegalStateException("Not enough beds available in the selected block/floor");
        }

        java.util.List<HostelAllocation> allocations = new java.util.ArrayList<>();
        int bedIndex = 0;
        
        for (Long studentId : req.getStudentIds()) {
            HostelDto.EnhancedAllocationRequest allocReq = new HostelDto.EnhancedAllocationRequest();
            allocReq.setStudentId(studentId);
            allocReq.setBedId(availableBeds.get(bedIndex++).getId());
            allocReq.setAcademicYearId(req.getAcademicYearId());
            allocReq.setAllocationType(req.getAllocationType());
            allocReq.setExpectedCheckoutDate(req.getExpectedCheckoutDate());
            allocations.add(allocateRoom(allocReq, userId));
        }

        return allocations;
    }
}
