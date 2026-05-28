package com.school.sms.controller.transport;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.transport.Driver;
import com.school.sms.service.transport.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<Driver>>> getAllDrivers(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("OK", driverService.getAllByBranch(branchId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Driver>> getDriver(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", driverService.getById(id)));
    }

    @PostMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Driver>> createDriver(
            @PathVariable Long branchId,
            @RequestBody Driver driver) {
        return ResponseEntity.ok(ApiResponse.success("Driver created", driverService.createDriver(driver, branchId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Driver>> updateDriver(
            @PathVariable Long id,
            @RequestBody Driver driver) {
        return ResponseEntity.ok(ApiResponse.success("Driver updated", driverService.updateDriver(id, driver)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable Long id,
            @RequestParam Driver.DriverStatus status) {
        driverService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Driver status updated"));
    }
}
