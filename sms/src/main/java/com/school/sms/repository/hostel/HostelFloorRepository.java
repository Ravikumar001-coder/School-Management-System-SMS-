package com.school.sms.repository.hostel;

import com.school.sms.model.hostel.HostelFloor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelFloorRepository extends JpaRepository<HostelFloor, Long> {
    List<HostelFloor> findByBlockId(Long blockId);
}
