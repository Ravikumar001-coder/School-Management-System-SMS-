package com.school.sms.service.transport;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.transport.Vehicle;
import com.school.sms.model.transport.VehicleAssignment;
import com.school.sms.model.transport.VehicleMaintenanceLog;
import com.school.sms.repository.transport.VehicleRepository;
import com.school.sms.repository.transport.VehicleMaintenanceLogRepository;
import com.school.sms.repository.transport.VehicleAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMaintenanceLogRepository maintenanceRepository;
    private final VehicleAssignmentRepository assignmentRepository;

    @Transactional(readOnly = true)
    public List<Vehicle> getAllByBranch(Long branchId) {
        return vehicleRepository.findByBranchId(branchId);
    }

    @Transactional(readOnly = true)
    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle, Long branchId) {
        vehicleRepository.findByVehicleNumber(vehicle.getVehicleNumber()).ifPresent(v -> {
            throw new IllegalArgumentException("Vehicle number already registered: " + vehicle.getVehicleNumber());
        });
        com.school.sms.model.Branch branch = new com.school.sms.model.Branch();
        branch.setId(branchId);
        vehicle.setBranch(branch);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updates) {
        Vehicle vehicle = getById(id);
        vehicle.setVehicleNumber(updates.getVehicleNumber());
        vehicle.setRegistrationNumber(updates.getRegistrationNumber());
        vehicle.setVehicleType(updates.getVehicleType());
        vehicle.setBrand(updates.getBrand());
        vehicle.setModel(updates.getModel());
        vehicle.setSeatingCapacity(updates.getSeatingCapacity());
        vehicle.setFuelType(updates.getFuelType());
        vehicle.setInsuranceNumber(updates.getInsuranceNumber());
        vehicle.setInsuranceExpiryDate(updates.getInsuranceExpiryDate());
        vehicle.setFitnessCertificateNumber(updates.getFitnessCertificateNumber());
        vehicle.setFitnessExpiryDate(updates.getFitnessExpiryDate());
        vehicle.setPollutionCertificateExpiry(updates.getPollutionCertificateExpiry());
        vehicle.setPermitExpiryDate(updates.getPermitExpiryDate());
        vehicle.setGpsDeviceId(updates.getGpsDeviceId());
        vehicle.setCurrentStatus(updates.getCurrentStatus());
        vehicle.setNotes(updates.getNotes());
        return vehicleRepository.save(vehicle);
    }

    public void updateStatus(Long id, Vehicle.VehicleStatus status) {
        Vehicle vehicle = getById(id);
        vehicle.setCurrentStatus(status);
        vehicleRepository.save(vehicle);
        log.info("Vehicle {} status changed to {}", vehicle.getVehicleNumber(), status);
    }

    // ─── Maintenance ─────────────────────────────────────────────────────────

    public VehicleMaintenanceLog addMaintenanceLog(VehicleMaintenanceLog log_entry) {
        return maintenanceRepository.save(log_entry);
    }

    @Transactional(readOnly = true)
    public List<VehicleMaintenanceLog> getMaintenanceLogs(Long vehicleId) {
        return maintenanceRepository.findByVehicleIdOrderByServiceDateDesc(vehicleId);
    }

    // ─── Expiry Alert Scheduler ───────────────────────────────────────────────

    @Scheduled(cron = "0 0 8 * * *") // Every day at 8 AM
    public void checkExpiryAlerts() {
        LocalDate thirtyDays = LocalDate.now().plusDays(30);
        LocalDate sevenDays = LocalDate.now().plusDays(7);

        List<Vehicle> insuranceExpiring30 = vehicleRepository.findInsuranceExpiringSoon(thirtyDays);
        List<Vehicle> fitnessExpiring30 = vehicleRepository.findFitnessExpiringSoon(thirtyDays);
        List<Vehicle> pollutionExpiring7 = vehicleRepository.findPollutionExpiringSoon(sevenDays);

        insuranceExpiring30.forEach(v ->
            log.warn("VEHICLE ALERT: Insurance expiring soon for vehicle {}: {}", 
                     v.getVehicleNumber(), v.getInsuranceExpiryDate()));

        fitnessExpiring30.forEach(v ->
            log.warn("VEHICLE ALERT: Fitness certificate expiring soon for vehicle {}: {}", 
                     v.getVehicleNumber(), v.getFitnessExpiryDate()));

        pollutionExpiring7.forEach(v ->
            log.warn("VEHICLE ALERT: Pollution certificate critical expiry for vehicle {}: {}", 
                     v.getVehicleNumber(), v.getPollutionCertificateExpiry()));
    }

    // ─── Fleet Dashboard Stats ────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public FleetStats getFleetStats(Long branchId) {
        List<Vehicle> all = vehicleRepository.findByBranchId(branchId);
        long active = all.stream().filter(v -> v.getCurrentStatus() == Vehicle.VehicleStatus.ACTIVE).count();
        long maintenance = all.stream().filter(v -> v.getCurrentStatus() == Vehicle.VehicleStatus.MAINTENANCE).count();
        long inactive = all.stream().filter(v -> v.getCurrentStatus() == Vehicle.VehicleStatus.INACTIVE).count();
        int totalCapacity = all.stream().filter(v -> v.getCurrentStatus() == Vehicle.VehicleStatus.ACTIVE)
                               .mapToInt(v -> v.getSeatingCapacity() != null ? v.getSeatingCapacity() : 0).sum();

        return new FleetStats(all.size(), active, maintenance, inactive, totalCapacity);
    }

    public record FleetStats(long total, long active, long maintenance, long inactive, int totalCapacity) {}
}
