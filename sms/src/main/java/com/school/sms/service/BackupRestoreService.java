package com.school.sms.service;

import com.school.sms.model.SystemBackup;
import com.school.sms.repository.SystemBackupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BackupRestoreService {

    private final SystemBackupRepository backupRepository;

    @Value("${spring.datasource.username:root}")
    private String dbUser;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    // Assuming local mysql installation for mysqldump
    @Value("${app.backup.dir:./backups}")
    private String backupDir;

    @Value("${app.mysql.bin-dir:}")
    private String mysqlBinDir;

    private static final String DB_NAME = "school_db";

    public void init() {
        File dir = new File(backupDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    // Runs every day at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduledBackup() {
        log.info("Starting scheduled daily backup");
        performBackup("SYSTEM", "Scheduled daily backup");
    }

    @Transactional
    public SystemBackup manualBackup(String notes) {
        String username = "SYSTEM";
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        log.info("Starting manual backup triggered by {}", username);
        return performBackup(username, notes);
    }

    private SystemBackup performBackup(String triggeredBy, String notes) {
        init();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = "backup_" + timestamp + ".sql";
        String filePath = backupDir + File.separator + fileName;

        SystemBackup backup = SystemBackup.builder()
                .fileName(fileName)
                .fileType("SQL")
                .backupStatus("IN_PROGRESS")
                .restoreStatus("NOT_RESTORED")
                .createdBy(triggeredBy)
                .notes(notes)
                .fileSize(0L)
                .build();
        backup = backupRepository.save(backup);

        try {
            String mysqldumpPath = resolveMysqlTool("mysqldump.exe");
            ProcessBuilder processBuilder = new ProcessBuilder(
                    mysqldumpPath,
                    "-u" + dbUser,
                    dbPassword.isEmpty() ? "" : "-p" + dbPassword,
                    "--add-drop-table",
                    "--routines",
                    "--events",
                    DB_NAME,
                    "-r", filePath
            );
            
            // Handle empty password correctly
            if (dbPassword.isEmpty()) {
                processBuilder.command().remove(2); // Remove the empty -p argument
            }

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                File backupFile = new File(filePath);
                backup.setBackupStatus("SUCCESS");
                backup.setFileSize(backupFile.length());
                log.info("Backup successful: {}", fileName);
            } else {
                backup.setBackupStatus("FAILED");
                backup.setNotes("Process exited with code: " + exitCode);
                log.error("Backup failed with exit code: {}", exitCode);
            }
        } catch (Exception e) {
            log.error("Backup failed", e);
            backup.setBackupStatus("FAILED");
            backup.setNotes(e.getMessage());
        }

        return backupRepository.save(backup);
    }

    @Transactional
    public SystemBackup restoreBackup(Long backupId) {
        Optional<SystemBackup> backupOpt = backupRepository.findById(backupId);
        if (backupOpt.isEmpty()) {
            throw new RuntimeException("Backup not found");
        }
        
        SystemBackup backup = backupOpt.get();
        String filePath = backupDir + File.separator + backup.getFileName();
        File file = new File(filePath);
        if (!file.exists()) {
            throw new RuntimeException("Backup file not found on disk");
        }

        try {
            String mysqlPath = resolveMysqlTool("mysql.exe");
            ProcessBuilder processBuilder = new ProcessBuilder(
                    mysqlPath,
                    "-u" + dbUser,
                    dbPassword.isEmpty() ? "" : "-p" + dbPassword,
                    DB_NAME
            );
            
            if (dbPassword.isEmpty()) {
                processBuilder.command().remove(2);
            }

            processBuilder.redirectInput(file);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                backup.setRestoreStatus("SUCCESS");
                log.info("Restore successful for: {}", backup.getFileName());
            } else {
                backup.setRestoreStatus("FAILED");
                log.error("Restore failed with exit code: {}", exitCode);
                throw new RuntimeException("Restore failed with exit code: " + exitCode);
            }
        } catch (Exception e) {
            log.error("Restore failed", e);
            backup.setRestoreStatus("FAILED");
            backupRepository.save(backup);
            throw new RuntimeException("Restore failed: " + e.getMessage());
        }

        return backupRepository.save(backup);
    }

    public List<SystemBackup> getAllBackups() {
        return backupRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public File getBackupFile(Long backupId) {
        SystemBackup backup = backupRepository.findById(backupId)
                .orElseThrow(() -> new RuntimeException("Backup not found"));
        return new File(backupDir + File.separator + backup.getFileName());
    }

    private String resolveMysqlTool(String executableName) {
        if (mysqlBinDir != null && !mysqlBinDir.isBlank()) {
            File configured = new File(mysqlBinDir, executableName);
            if (configured.exists()) {
                return configured.getAbsolutePath();
            }
        }

        String[] candidatePaths = {
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\" + executableName,
                "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\" + executableName,
                executableName
        };

        for (String candidate : candidatePaths) {
            File file = new File(candidate);
            if (file.exists() || executableName.equals(candidate)) {
                return candidate;
            }
        }

        throw new RuntimeException("Required MySQL tool not found: " + executableName);
    }
}
