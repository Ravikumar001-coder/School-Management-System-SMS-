package com.school.sms.controller.hostel;

import com.school.sms.dto.hostel.HostelDto;
import com.school.sms.model.hostel.HostelAllocation;
import com.school.sms.service.hostel.HostelAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hostel/allocations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER', 'ADMIN', 'WARDEN')")
public class HostelAllocationController {

    private final HostelAllocationService allocationService;

    @GetMapping
    public ResponseEntity<List<HostelAllocation>> getAllAllocations() {
        return ResponseEntity.ok(allocationService.getAllAllocations());
    }

    @GetMapping("/eligibility/{studentId}")
    public ResponseEntity<HostelDto.EligibilityResponse> checkEligibility(@PathVariable Long studentId) {
        return ResponseEntity.ok(allocationService.checkEligibility(studentId));
    }

    @PostMapping
    public ResponseEntity<HostelAllocation> allocateRoom(@RequestBody HostelDto.EnhancedAllocationRequest request) {
        Long allocatedById = 1L; // Placeholder for currently logged-in user ID
        return ResponseEntity.ok(allocationService.allocateRoom(request, allocatedById));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<HostelAllocation>> bulkAllocate(@RequestBody HostelDto.BulkAllocationRequest request) {
        Long allocatedById = 1L; 
        return ResponseEntity.ok(allocationService.bulkAllocate(request, allocatedById));
    }

    @PostMapping("/{allocationId}/transfer")
    public ResponseEntity<HostelAllocation> transferRoom(@PathVariable Long allocationId, @RequestBody HostelDto.TransferRequest request) {
        Long userId = 1L; 
        return ResponseEntity.ok(allocationService.transferRoom(allocationId, request, userId));
    }

    @PostMapping("/{allocationId}/vacate")
    public ResponseEntity<HostelAllocation> vacateRoom(@PathVariable Long allocationId, @RequestBody HostelDto.VacateRequest request) {
        Long userId = 1L; 
        return ResponseEntity.ok(allocationService.vacateRoom(allocationId, request, userId));
    }
}
