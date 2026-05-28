package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmployeeCode(String employeeCode);
    Optional<Staff> findByEmail(String email);
}
