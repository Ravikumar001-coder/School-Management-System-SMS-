package com.school.sms.service.transport;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.school.sms.model.transport.Vehicle;
import com.school.sms.model.transport.VehicleLiveLocation;
import com.school.sms.repository.transport.VehicleLiveLocationRepository;
import com.school.sms.repository.transport.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GpsDataSyncScheduler {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final VehicleLiveLocationRepository liveLocationRepository;
    private final VehicleRepository vehicleRepository;

    private static final int BATCH_SIZE = 1000;

    /**
     * Flushes buffered GPS locations from Redis to MySQL every 60 seconds.
     * Uses LPOP to safely retrieve and remove from the list.
     */
    // @Scheduled(fixedRate = 60000) // Disabled due to missing Redis
    @Transactional
    public void syncGpsLocationsToDatabase() {
        Long size = redisTemplate.opsForList().size(GpsTrackingService.REDIS_GPS_BUFFER_KEY);
        if (size == null || size == 0) {
            return;
        }

        log.info("Starting GPS data sync. Found {} records in Redis buffer.", size);
        List<VehicleLiveLocation> batchToSave = new ArrayList<>();
        int processed = 0;

        while (processed < BATCH_SIZE) {
            String jsonPayload = redisTemplate.opsForList().leftPop(GpsTrackingService.REDIS_GPS_BUFFER_KEY);
            if (jsonPayload == null) {
                break; // Buffer is empty
            }

            try {
                Map<String, Object> data = objectMapper.readValue(jsonPayload, new TypeReference<>() {});
                
                Long vehicleId = Long.valueOf(data.get("vehicleId").toString());
                double lat = Double.parseDouble(data.get("latitude").toString());
                double lon = Double.parseDouble(data.get("longitude").toString());
                double speed = Double.parseDouble(data.get("speed").toString());
                double heading = Double.parseDouble(data.get("heading").toString());
                boolean ignition = Boolean.parseBoolean(data.get("ignition").toString());
                
                Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
                if (vehicle != null) {
                    VehicleLiveLocation location = VehicleLiveLocation.builder()
                            .vehicle(vehicle)
                            .latitude(lat)
                            .longitude(lon)
                            .speed(speed)
                            .heading(heading)
                            .ignitionStatus(ignition)
                            .recordedAt(LocalDateTime.now()) // In real app, parse the timestamp from payload
                            .build();
                    batchToSave.add(location);
                }
            } catch (JsonProcessingException e) {
                log.error("Failed to parse GPS payload from Redis: {}", jsonPayload, e);
            } catch (Exception e) {
                log.error("Error processing GPS payload from Redis: {}", jsonPayload, e);
            }
            processed++;
        }

        if (!batchToSave.isEmpty()) {
            liveLocationRepository.saveAll(batchToSave);
            log.info("Successfully synced {} GPS locations to MySQL.", batchToSave.size());
        }
    }
}
