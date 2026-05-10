package com.school.sms.repository;

import com.school.sms.model.PtmBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PtmBookingRepository extends JpaRepository<PtmBooking, Long> {
    List<PtmBooking> findByStudentIdOrderBySlotSlotDateAsc(Long studentId);
}
