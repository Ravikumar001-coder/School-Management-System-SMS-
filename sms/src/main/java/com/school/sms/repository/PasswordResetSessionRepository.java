package com.school.sms.repository;

import com.school.sms.model.PasswordResetSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetSessionRepository extends JpaRepository<PasswordResetSession, Long> {
    Optional<PasswordResetSession> findFirstByEmailOrderByCreatedAtDesc(String email);
}
