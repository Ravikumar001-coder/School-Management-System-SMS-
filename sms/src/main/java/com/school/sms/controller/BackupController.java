package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.SystemBackup;
import com.school.sms.service.BackupRestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/v1/backups")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class BackupController {

    private final BackupRestoreService backupRestoreService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SystemBackup>>> getAllBackups() {
        return ResponseEntity.ok(ApiResponse.success(
                "Backups retrieved", backupRestoreService.getAllBackups()));
    }

    @PostMapping("/manual")
    public ResponseEntity<ApiResponse<SystemBackup>> triggerManualBackup(@RequestParam(required = false, defaultValue = "Manual backup via API") String notes) {
        return ResponseEntity.ok(ApiResponse.success(
                "Backup triggered", backupRestoreService.manualBackup(notes)));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<SystemBackup>> restoreBackup(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Restore completed", backupRestoreService.restoreBackup(id)));
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadBackup(@PathVariable Long id) {
        File file = backupRestoreService.getBackupFile(id);
        Resource resource = new FileSystemResource(file);
        
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}
