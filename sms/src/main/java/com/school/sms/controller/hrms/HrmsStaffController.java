package com.school.sms.controller.hrms;

import com.school.sms.dto.request.hrms.StaffOnboardingRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.Staff;
import com.school.sms.repository.hrms.StaffRepository;
import com.school.sms.service.hrms.StaffOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hrms/staff")
@RequiredArgsConstructor
public class HrmsStaffController {

    private final StaffOnboardingService onboardingService;
    private final StaffRepository staffRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<Staff>> onboardStaff(@Valid @RequestBody StaffOnboardingRequest request) {
        Staff createdStaff = onboardingService.onboardNewStaff(request);
        return ResponseEntity.ok(ApiResponse.success("Staff onboarded successfully", createdStaff));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<Page<Staff>>> getAllStaff(Pageable pageable) {
        Page<Staff> staffPage = staffRepository.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success("Fetched all staff", staffPage));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','HR')")
    public ResponseEntity<ApiResponse<Staff>> getStaffById(@PathVariable Long id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));
        return ResponseEntity.ok(ApiResponse.success("Fetched staff", staff));
    }
}
