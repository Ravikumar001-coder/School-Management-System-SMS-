package com.school.sms.repository.transport;

import com.school.sms.model.transport.VehicleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleAssignmentRepository extends JpaRepository<VehicleAssignment, Long> {
    List<VehicleAssignment> findByVehicleIdAndStatus(Long vehicleId, VehicleAssignment.AssignmentStatus status);
    Optional<VehicleAssignment> findByRouteIdAndStatus(Long routeId, VehicleAssignment.AssignmentStatus status);
}
