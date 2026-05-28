package com.school.sms.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.io.File;

@Component
public class HostelSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public HostelSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            ClassPathResource resource = new ClassPathResource("hostel_seed.sql");
            if (resource.exists()) {
                System.out.println("Running Hostel Data Seed...");
                String sql = FileCopyUtils.copyToString(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
                
                // JdbcTemplate does not support DELIMITER or executing multiple statements in one go with semicolon in MySQL easily, 
                // but if we enable allowMultiQueries=true in JDBC url, it can. 
                // Wait, MySQL allowMultiQueries is usually false by default.
                // Let's split by semicolon and execute one by one.
                String[] statements = sql.split(";");
                for (String stmt : statements) {
                    if (stmt.trim().length() > 0) {
                        jdbcTemplate.execute(stmt.trim());
                    }
                }
                System.out.println("Hostel Data Seed SUCCESSFUL!");
                
                // Rename file so it doesn't run again on next restart
                File f = resource.getFile();
                f.renameTo(new File(f.getParentFile(), "hostel_seed.sql.done"));
            }
        } catch (Exception e) {
            System.err.println("Failed to run Hostel Data Seed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
