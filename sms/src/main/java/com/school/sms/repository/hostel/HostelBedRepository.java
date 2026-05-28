package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.HostelBed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelBedRepository extends JpaRepository<HostelBed, Long> {
    List<HostelBed> findByRoomId(Long roomId);
    List<HostelBed> findByRoomIdAndStatusAndIsOccupiedFalse(Long roomId, HostelBed.BedStatus status);
}
