package com.school.sms.config;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Branch;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;

/**
 * Seeds the mandatory baseline data required by the new schema:
 * 1. A "MAIN" branch (branch_id = 1 by default for all existing records)
 * 2. An active academic year for the current calendar year
 *
 * This runner is @Order(1) — it runs BEFORE any other ApplicationRunner/CommandLineRunner
 * so that all other seeders can safely assume branch and academic year exist.
 *
 * Idempotent: safe to run on every startup; creates only if not already present.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class BaseDataSeeder implements ApplicationRunner {

    private final BranchRepository branchRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedMainBranch();
        seedCurrentAcademicYear();
    }

    private void seedMainBranch() {
        if (branchRepository.findByCode("MAIN").isPresent()) {
            return; // Already seeded
        }
        Branch mainBranch = Branch.builder()
                .code("MAIN")
                .name("Main Campus")
                .active(true)
                .build();
        branchRepository.save(mainBranch);
        log.info("BASE_DATA: Created default branch 'MAIN' (id will be 1 on fresh DB).");
    }

    private void seedCurrentAcademicYear() {
        // If any active year already exists, do nothing
        if (academicYearRepository.countByActiveTrue() > 0) {
            return;
        }

        int currentYear = Year.now().getValue();
        int endYear     = currentYear + 1;
        String label    = currentYear + "-" + String.valueOf(endYear).substring(2); // "2024-25"

        AcademicYear year = AcademicYear.builder()
                .label(label)
                .startYear(currentYear)
                .endYear(endYear)
                .schoolCode("SMS")
                .startDate(LocalDate.of(currentYear, 4, 1))   // April 1 (Indian academic calendar)
                .endDate(LocalDate.of(endYear, 3, 31))         // March 31
                .active(true)
                .build();

        academicYearRepository.save(year);
        log.info("BASE_DATA: Created active academic year '{}' ({}–{}).",
                label, currentYear, endYear);
    }
}
