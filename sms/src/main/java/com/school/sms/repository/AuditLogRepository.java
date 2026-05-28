package com.school.sms.repository;

import com.school.sms.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByEntityTypeAndEntityIdOrderByChangedAtDesc(
            String entityType, Long entityId, Pageable pageable);

    Page<AuditLog> findByActorUsernameOrderByChangedAtDesc(
            String actorUsername, Pageable pageable);

    Page<AuditLog> findByEntityTypeOrderByChangedAtDesc(
            String entityType, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.changedAt BETWEEN :from AND :to ORDER BY a.changedAt DESC")
    Page<AuditLog> findByDateRange(LocalDateTime from, LocalDateTime to, Pageable pageable);

    List<AuditLog> findTop10ByActorIdOrderByChangedAtDesc(Long actorId);

    // NOTE: No delete methods. AuditLog is an append-only table.
    // The @Repository does NOT expose deleteById or deleteAll from JpaRepository
    // at the service layer — AuditLogService intentionally omits those methods.
}
