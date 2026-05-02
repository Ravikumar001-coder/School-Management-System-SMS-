package com.school.sms.repository;

import com.school.sms.model.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {

    Optional<AcademicYear> findByActiveTrue();

    Optional<AcademicYear> findFirstByActiveTrueOrderByIdDesc();

    long countByActiveTrue();

    Optional<AcademicYear> findByLabel(String label);

    boolean existsByLabelAndSchoolCode(String label, String schoolCode);
}
