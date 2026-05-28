package com.school.sms.controller.transport;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.transport.*;
import com.school.sms.service.transport.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getAllVehicles(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("OK", vehicleService.getAllByBranch(branchId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", vehicleService.getById(id)));
    }

    @PostMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> createVehicle(
            @PathVariable Long branchId,
            @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle created", vehicleService.createVehicle(vehicle, branchId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Vehicle>> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated", vehicleService.updateVehicle(id, vehicle)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable Long id,
            @RequestParam Vehicle.VehicleStatus status) {
        vehicleService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Status updated"));
    }

    @GetMapping("/branch/{branchId}/fleet-stats")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<VehicleService.FleetStats>> getFleetStats(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("OK", vehicleService.getFleetStats(branchId)));
    }

    // ─── Maintenance ─────────────────────────────────────────────────────────

    @GetMapping("/{vehicleId}/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<VehicleMaintenanceLog>>> getMaintenanceLogs(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(ApiResponse.success("OK", vehicleService.getMaintenanceLogs(vehicleId)));
    }

    @PostMapping("/{vehicleId}/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<VehicleMaintenanceLog>> addMaintenanceLog(
            @PathVariable Long vehicleId,
            @RequestBody VehicleMaintenanceLog maintenanceLog) {
        if (maintenanceLog.getVehicle() == null) {
            maintenanceLog.setVehicle(new Vehicle());
        }
        maintenanceLog.getVehicle().setId(vehicleId);
        return ResponseEntity.ok(ApiResponse.success("Log added", vehicleService.addMaintenanceLog(maintenanceLog)));
    }
}
