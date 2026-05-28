package com.school.sms.controller.transport;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.transport.BusAttendanceLog;
import com.school.sms.service.transport.RfidProcessingService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/transport/rfid")
@RequiredArgsConstructor
public class RfidController {

    private final RfidProcessingService rfidService;

    /**
     * Process RFID/NFC/QR scan from bus terminal device.
     */
    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<BusAttendanceLog>> processScan(@RequestBody RfidScanRequest request) {
        BusAttendanceLog log = rfidService.processScan(
                request.getCardUid(),
                request.getVehicleId(),
                request.getRouteId(),
                request.getStopId(),
                request.getScanMethod()
        );
        return ResponseEntity.ok(ApiResponse.success("Scan processed", log));
    }

    @GetMapping("/vehicles/{vehicleId}/occupancy")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER','DRIVER')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getOccupancy(@PathVariable Long vehicleId) {
        long occupancy = rfidService.getCurrentOccupancy(vehicleId);
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of("occupancy", occupancy)));
    }

    @PostMapping("/sync-attendance")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<String>> syncAttendance() {
        rfidService.syncBusAttendanceToMain();
        return ResponseEntity.ok(ApiResponse.success("Sync completed successfully"));
    }

    @Data
    public static class RfidScanRequest {
        private String cardUid;
        private Long vehicleId;
        private Long routeId;
        private Long stopId;
        private BusAttendanceLog.ScanMethod scanMethod = BusAttendanceLog.ScanMethod.RFID;
    }
}
