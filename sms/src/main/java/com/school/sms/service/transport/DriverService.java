package com.school.sms.service.transport;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.transport.Driver;
import com.school.sms.repository.transport.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DriverService {

    private final DriverRepository driverRepository;

    @Transactional(readOnly = true)
    public List<Driver> getAllByBranch(Long branchId) {
        return driverRepository.findByBranchId(branchId);
    }

    @Transactional(readOnly = true)
    public Driver getById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + id));
    }

    public Driver createDriver(Driver driver, Long branchId) {
        // Validation for duplicate license
        driverRepository.findByLicenseNumber(driver.getLicenseNumber()).ifPresent(d -> {
            throw new IllegalArgumentException("License number already registered: " + driver.getLicenseNumber());
        });
        
        if (driver.getEmployeeId() == null || driver.getEmployeeId().trim().isEmpty()) {
            driver.setEmployeeId("DRV-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        com.school.sms.model.Branch branch = new com.school.sms.model.Branch();
        branch.setId(branchId);
        driver.setBranch(branch);
        
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Long id, Driver updates) {
        Driver driver = getById(id);
        
        // Don't update employeeId or licenseNumber if already set
        driver.setFirstName(updates.getFirstName());
        driver.setLastName(updates.getLastName());
        driver.setPhone(updates.getPhone());
        driver.setAlternatePhone(updates.getAlternatePhone());
        driver.setEmail(updates.getEmail());
        driver.setAddress(updates.getAddress());
        driver.setBloodGroup(updates.getBloodGroup());
        driver.setEmergencyContact(updates.getEmergencyContact());
        driver.setLicenseType(updates.getLicenseType());
        driver.setLicenseIssueDate(updates.getLicenseIssueDate());
        driver.setLicenseExpiryDate(updates.getLicenseExpiryDate());
        driver.setExperienceYears(updates.getExperienceYears());
        driver.setMedicalCertificateExpiry(updates.getMedicalCertificateExpiry());
        driver.setAadhaarNumber(updates.getAadhaarNumber());
        driver.setProfilePhoto(updates.getProfilePhoto());
        driver.setStatus(updates.getStatus());
        driver.setRemarks(updates.getRemarks());

        return driverRepository.save(driver);
    }

    public void updateStatus(Long id, Driver.DriverStatus status) {
        Driver driver = getById(id);
        driver.setStatus(status);
        driverRepository.save(driver);
        log.info("Driver {} status updated to {}", id, status);
    }

    @Transactional(readOnly = true)
    public List<Driver> getExpiringLicenses(LocalDate dateThreshold) {
        // Example check: find licenses expiring before the threshold
        // Requires a custom query in DriverRepository, but we can do a simple check
        return driverRepository.findAll().stream()
                .filter(d -> d.getLicenseExpiryDate() != null && d.getLicenseExpiryDate().isBefore(dateThreshold))
                .toList();
    }
}
