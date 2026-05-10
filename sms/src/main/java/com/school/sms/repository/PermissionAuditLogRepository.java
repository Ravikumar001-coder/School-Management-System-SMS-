package com.school.sms.repository;

import com.school.sms.model.PermissionAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionAuditLogRepository extends JpaRepository<PermissionAuditLog, Long> {
}
