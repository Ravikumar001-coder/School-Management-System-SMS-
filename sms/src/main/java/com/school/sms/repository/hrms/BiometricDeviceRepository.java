package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.BiometricDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BiometricDeviceRepository extends JpaRepository<BiometricDevice, Long> {
}
