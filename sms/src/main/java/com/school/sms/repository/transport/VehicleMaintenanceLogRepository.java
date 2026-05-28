package com.school.sms.repository.transport;

import com.school.sms.model.transport.VehicleMaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleMaintenanceLogRepository extends JpaRepository<VehicleMaintenanceLog, Long> {
    List<VehicleMaintenanceLog> findByVehicleIdOrderByServiceDateDesc(Long vehicleId);
}
