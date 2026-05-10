package com.school.sms.repository;

import com.school.sms.model.ParentOTPSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ParentOTPSessionRepository extends JpaRepository<ParentOTPSession, Long> {
    Optional<ParentOTPSession> findFirstByMobileNumberAndPurposeOrderByCreatedAtDesc(String mobile, String purpose);
}
