package com.school.sms.repository.transport;

import com.school.sms.model.transport.VehicleLiveLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VehicleLiveLocationRepository extends JpaRepository<VehicleLiveLocation, Long> {

    @Query("SELECT v FROM VehicleLiveLocation v WHERE v.vehicle.id = :vehicleId ORDER BY v.recordedAt DESC LIMIT 1")
    Optional<VehicleLiveLocation> findLatestByVehicleId(@Param("vehicleId") Long vehicleId);

    java.util.List<VehicleLiveLocation> findByVehicleIdAndRecordedAtBetweenOrderByRecordedAtAsc(
        Long vehicleId, java.time.LocalDateTime start, java.time.LocalDateTime end);
}
