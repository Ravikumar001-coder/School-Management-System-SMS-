package com.school.sms.repository.admin;

import com.school.sms.model.admin.PromotionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionLogRepository extends JpaRepository<PromotionLog, Long> {
}
