package com.school.sms.repository.transport;

import com.school.sms.model.transport.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    List<Driver> findByBranchIdAndStatus(Long branchId, Driver.DriverStatus status);

    List<Driver> findByBranchId(Long branchId);

    Optional<Driver> findByLicenseNumber(String licenseNumber);

    @Query("SELECT d FROM Driver d WHERE d.licenseExpiryDate <= :alertDate AND d.status = 'ACTIVE'")
    List<Driver> findLicenseExpiringSoon(@Param("alertDate") LocalDate alertDate);

    @Query("SELECT d FROM Driver d WHERE d.medicalCertificateExpiry <= :alertDate AND d.status = 'ACTIVE'")
    List<Driver> findMedicalExpiringSoon(@Param("alertDate") LocalDate alertDate);
}
