package com.school.sms.service.transport;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.transport.*;
import com.school.sms.repository.transport.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * GPS Tracking Service — abstraction layer over multiple GPS providers.
 *
 * Supports: Teltonika, Concox, Ruptela, Android GPS App, Generic API
 * Pushes real-time location updates over WebSocket (STOMP).
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GpsTrackingService {

    private final VehicleLiveLocationRepository liveLocationRepository;
    private final GpsDeviceRepository gpsDeviceRepository;
    private final GpsEventRepository gpsEventRepository;
    private final VehicleRepository vehicleRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private static final double OVERSPEED_THRESHOLD_KMH = 60.0;
    public static final String REDIS_GPS_BUFFER_KEY = "gps:buffer:locations";

    // ─── Location Ingestion (called by GPS webhook or device push) ───────────

    public void ingestLocation(Long vehicleId, double lat, double lon,
                                                double speed, double heading, boolean ignition) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));

        // 1. Broadcast live location over WebSocket immediately
        Map<String, Object> payload = buildLocationPayload(vehicleId, lat, lon, speed, heading, ignition);
        messagingTemplate.convertAndSend("/topic/vehicle/" + vehicleId + "/location", payload);

        // 2. Buffer location in Redis instead of saving directly to MySQL
        try {
            String json = objectMapper.writeValueAsString(payload);
            redisTemplate.opsForList().rightPush(REDIS_GPS_BUFFER_KEY, json);
        } catch (Exception e) {
            log.error("Failed to serialize GPS payload for Redis buffering", e);
        }

        // 3. Check for anomalies
        if (speed > OVERSPEED_THRESHOLD_KMH) {
            triggerGpsEvent(vehicle, GpsEvent.GpsEventType.OVERSPEED, lat, lon,
                           "Speed: " + speed + " km/h", "WARNING");
        }

        log.debug("Location buffered to Redis for vehicle {}: lat={}, lon={}, speed={}", vehicleId, lat, lon, speed);
    }

    // ─── Webhook Entry Points (per GPS provider) ──────────────────────────────

    /**
     * Generic GPS webhook — normalises any provider format.
     */
    public void processGpsWebhook(String deviceUid, double lat, double lon,
                                   double speed, double heading, boolean ignition) {
        gpsDeviceRepository.findByDeviceUid(deviceUid).ifPresentOrElse(
            device -> {
                device.setLastPingAt(LocalDateTime.now());
                gpsDeviceRepository.save(device);
                if (device.getVehicle() != null) {
                    ingestLocation(device.getVehicle().getId(), lat, lon, speed, heading, ignition);
                }
            },
            () -> log.warn("Unknown GPS device: {}", deviceUid)
        );
    }

    // ─── Live Location Retrieval ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Optional<VehicleLiveLocation> getLatestLocation(Long vehicleId) {
        return liveLocationRepository.findLatestByVehicleId(vehicleId);
    }

    @Transactional(readOnly = true)
    public List<VehicleLiveLocation> getHistory(Long vehicleId, LocalDateTime start, LocalDateTime end) {
        return liveLocationRepository.findByVehicleIdAndRecordedAtBetweenOrderByRecordedAtAsc(vehicleId, start, end);
    }

    // ─── GPS Events ───────────────────────────────────────────────────────────

    public GpsEvent triggerGpsEvent(Vehicle vehicle, GpsEvent.GpsEventType type,
                                     double lat, double lon, String metadata, String severity) {
        GpsEvent event = GpsEvent.builder()
                .vehicle(vehicle)
                .eventType(type)
                .latitude(lat)
                .longitude(lon)
                .severity(severity)
                .metadataJson(metadata)
                .eventTime(LocalDateTime.now())
                .build();
        GpsEvent saved = gpsEventRepository.save(event);

        // Broadcast critical events to admin dashboard
        if ("CRITICAL".equals(severity) || "WARNING".equals(severity)) {
            messagingTemplate.convertAndSend("/topic/transport/alerts", Map.of(
                "vehicleId", vehicle.getId(),
                "vehicleNumber", vehicle.getVehicleNumber(),
                "eventType", type.name(),
                "severity", severity,
                "metadata", metadata,
                "timestamp", LocalDateTime.now().toString()
            ));
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<GpsEvent> getUnacknowledgedEvents(Long vehicleId) {
        return gpsEventRepository.findByVehicleIdAndAcknowledgedFalseOrderByEventTimeDesc(vehicleId);
    }

    public void acknowledgeEvent(Long eventId) {
        gpsEventRepository.findById(eventId).ifPresent(e -> {
            e.setAcknowledged(true);
            gpsEventRepository.save(e);
        });
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Map<String, Object> buildLocationPayload(Long vehicleId, double lat, double lon,
                                                      double speed, double heading, boolean ignition) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("vehicleId", vehicleId);
        payload.put("latitude", lat);
        payload.put("longitude", lon);
        payload.put("speed", speed);
        payload.put("heading", heading);
        payload.put("ignition", ignition);
        payload.put("timestamp", LocalDateTime.now().toString());
        return payload;
    }
}
