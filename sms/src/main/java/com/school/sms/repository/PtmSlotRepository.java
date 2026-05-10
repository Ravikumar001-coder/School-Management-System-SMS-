package com.school.sms.repository;

import com.school.sms.model.PtmSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PtmSlotRepository extends JpaRepository<PtmSlot, Long> {
    List<PtmSlot> findByTeacherIdOrderBySlotDateAscStartTimeAsc(Long teacherId);
}
