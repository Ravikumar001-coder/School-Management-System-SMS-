package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "system_backups")
public class SystemBackup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // SQL, JSON

    @Column(nullable = false)
    private Long fileSize; // in bytes

    private String backupStatus; // SUCCESS, FAILED, IN_PROGRESS
    
    private String restoreStatus; // NOT_RESTORED, SUCCESS, FAILED

    private String createdBy; // SYSTEM, or username

    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
