package com.school.sms.controller.transport;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.transport.GpsEvent;
import com.school.sms.model.transport.VehicleLiveLocation;
import com.school.sms.service.transport.GpsTrackingService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/transport/gps")
@RequiredArgsConstructor
public class GpsTrackingController {

    private final GpsTrackingService gpsTrackingService;

    /**
     * GPS device webhook — receives location push from GPS hardware/app.
     * No authentication required; secured by device UID + API key in production.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> gpsWebhook(@RequestBody GpsWebhookRequest request) {
        gpsTrackingService.processGpsWebhook(
                request.getDeviceUid(),
                request.getLatitude(),
                request.getLongitude(),
                request.getSpeed(),
                request.getHeading(),
                request.isIgnition()
        );
        return ResponseEntity.ok(Map.of("status", "OK"));
    }

    @GetMapping("/vehicles/{vehicleId}/location")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER','PARENT','DRIVER')")
    public ResponseEntity<ApiResponse<Optional<VehicleLiveLocation>>> getLatestLocation(
            @PathVariable Long vehicleId) {
        return ResponseEntity.ok(ApiResponse.success("OK", gpsTrackingService.getLatestLocation(vehicleId)));
    }

    @GetMapping("/vehicles/{vehicleId}/history")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<VehicleLiveLocation>>> getHistory(
            @PathVariable Long vehicleId,
            @RequestParam String start,
            @RequestParam String end) {
        java.time.LocalDateTime startTime = java.time.LocalDateTime.parse(start);
        java.time.LocalDateTime endTime = java.time.LocalDateTime.parse(end);
        return ResponseEntity.ok(ApiResponse.success("OK", gpsTrackingService.getHistory(vehicleId, startTime, endTime)));
    }

    @GetMapping("/vehicles/{vehicleId}/events")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<GpsEvent>>> getEvents(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(ApiResponse.success("OK", gpsTrackingService.getUnacknowledgedEvents(vehicleId)));
    }

    @PatchMapping("/events/{eventId}/acknowledge")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> acknowledgeEvent(@PathVariable Long eventId) {
        gpsTrackingService.acknowledgeEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event acknowledged"));
    }

    @Data
    public static class GpsWebhookRequest {
        private String deviceUid;
        private double latitude;
        private double longitude;
        private double speed;
        private double heading;
        private boolean ignition;
    }
}
