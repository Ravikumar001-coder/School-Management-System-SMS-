package com.school.sms.service.hostel;

import com.school.sms.repository.hostel.HostelBedRepository;
import com.school.sms.repository.hostel.HostelBlockRepository;
import com.school.sms.repository.hostel.HostelRoomRepository;
import com.school.sms.repository.hostel.HostelAllocationRepository;
import com.school.sms.model.hostel.HostelAllocation;
import com.school.sms.model.hostel.HostelBed;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HostelDashboardService {

    private final HostelBlockRepository blockRepository;
    private final HostelRoomRepository roomRepository;
    private final HostelBedRepository bedRepository;
    private final HostelAllocationRepository allocationRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats(Long branchId) {
        long totalBlocks = blockRepository.findByBranchId(branchId).size();
        
        // This is a naive count; for enterprise scale, we would use native query or counts
        // Given JPA, we'll write a simple query logic
        
        long totalRooms = 0;
        long totalBeds = 0;
        long occupiedBeds = 0;
        long totalStudents = allocationRepository.findByStatus(HostelAllocation.AllocationStatus.ACTIVE)
                                 .stream()
                                 .filter(alloc -> alloc.getBed().getRoom().getFloor().getBlock().getBranch().getId().equals(branchId))
                                 .count();

        // Count via beds
        var allBeds = bedRepository.findAll();
        for (HostelBed bed : allBeds) {
            if (bed.getRoom().getFloor().getBlock().getBranch().getId().equals(branchId)) {
                totalBeds++;
                if (bed.getIsOccupied()) {
                    occupiedBeds++;
                }
            }
        }
        
        // Count via rooms
        var allRooms = roomRepository.findAll();
        for (var room : allRooms) {
            if (room.getFloor().getBlock().getBranch().getId().equals(branchId)) {
                totalRooms++;
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBlocks", totalBlocks);
        stats.put("totalRooms", totalRooms);
        stats.put("totalStudents", totalStudents);
        stats.put("availableBeds", totalBeds - occupiedBeds);
        
        return stats;
    }
}
