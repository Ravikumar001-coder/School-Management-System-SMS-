package com.school.sms.repository.transport;

import com.school.sms.model.transport.GpsDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GpsDeviceRepository extends JpaRepository<GpsDevice, Long> {
    Optional<GpsDevice> findByVehicleId(Long vehicleId);
    Optional<GpsDevice> findByImeiNumber(String imeiNumber);
    Optional<GpsDevice> findByDeviceUid(String deviceUid);
}
