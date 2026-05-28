package com.school.sms.repository;

import com.school.sms.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    java.util.Optional<Department> findByName(String name);
}
