package com.school.sms.repository.transport;

import com.school.sms.model.transport.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByBranchIdAndCurrentStatus(Long branchId, Vehicle.VehicleStatus status);

    List<Vehicle> findByBranchId(Long branchId);

    long countByCurrentStatus(Vehicle.VehicleStatus status);

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    // Expiry alert queries
    @Query("SELECT v FROM Vehicle v WHERE v.insuranceExpiryDate <= :alertDate AND v.currentStatus = 'ACTIVE'")
    List<Vehicle> findInsuranceExpiringSoon(@Param("alertDate") LocalDate alertDate);

    @Query("SELECT v FROM Vehicle v WHERE v.fitnessExpiryDate <= :alertDate AND v.currentStatus = 'ACTIVE'")
    List<Vehicle> findFitnessExpiringSoon(@Param("alertDate") LocalDate alertDate);

    @Query("SELECT v FROM Vehicle v WHERE v.pollutionCertificateExpiry <= :alertDate AND v.currentStatus = 'ACTIVE'")
    List<Vehicle> findPollutionExpiringSoon(@Param("alertDate") LocalDate alertDate);

    @Query("SELECT v FROM Vehicle v WHERE v.permitExpiryDate <= :alertDate AND v.currentStatus = 'ACTIVE'")
    List<Vehicle> findPermitExpiringSoon(@Param("alertDate") LocalDate alertDate);
}
