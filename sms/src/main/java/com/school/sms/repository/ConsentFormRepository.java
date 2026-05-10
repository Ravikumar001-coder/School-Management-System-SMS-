package com.school.sms.repository;

import com.school.sms.model.ConsentForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsentFormRepository extends JpaRepository<ConsentForm, Long> {
    List<ConsentForm> findByTargetAudienceOrClassRoomIdOrderByDueDateAsc(String targetAudience, Long classRoomId);
}
