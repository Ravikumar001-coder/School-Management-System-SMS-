package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "permission_audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long actorId;
    private Long parentRoleId;
    private Long targetUserId;
    private String action; // "ROLE_CREATED", "PERMISSION_CHANGED", "ROLE_ASSIGNED"
    
    @Column(columnDefinition = "TEXT")
    private String beforeValue;
    
    @Column(columnDefinition = "TEXT")
    private String afterValue;

    @Column(columnDefinition = "TEXT")
    private String details;
    
    private String ipAddress;
    
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
