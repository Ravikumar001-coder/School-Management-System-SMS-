package com.school.sms.service.hostel;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.Branch;
import com.school.sms.model.User;
import com.school.sms.model.hostel.*;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.BranchRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.hostel.*;
import com.school.sms.dto.hostel.HostelDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HostelInfrastructureService {

    private final HostelBlockRepository blockRepository;
    private final HostelFloorRepository floorRepository;
    private final HostelRoomRepository roomRepository;
    private final HostelBedRepository bedRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;
    private final HostelAllocationRepository allocationRepository;

    @Transactional(readOnly = true)
    public List<HostelDto.BlockMapDTO> getBranchInfrastructureMap(Long branchId) {
        List<HostelBlock> blocks = blockRepository.findByBranchId(branchId);
        List<HostelDto.BlockMapDTO> blockDtos = new java.util.ArrayList<>();
        
        List<HostelAllocation> activeAllocations = allocationRepository.findAll().stream()
                .filter(a -> a.getStatus() == HostelAllocation.AllocationStatus.ACTIVE &&
                        a.getBed().getRoom().getFloor().getBlock().getBranch().getId().equals(branchId))
                .collect(java.util.stream.Collectors.toList());
        
        java.util.Map<Long, HostelAllocation> bedToAllocation = new java.util.HashMap<>();
        for (HostelAllocation a : activeAllocations) {
            bedToAllocation.put(a.getBed().getId(), a);
        }

        for (HostelBlock block : blocks) {
            HostelDto.BlockMapDTO blockDto = new HostelDto.BlockMapDTO();
            blockDto.setId(block.getId());
            blockDto.setBlockName(block.getBlockName());
            blockDto.setGenderType(block.getGenderType().name());
            
            List<HostelDto.FloorMapDTO> floorDtos = new java.util.ArrayList<>();
            List<HostelFloor> floors = floorRepository.findByBlockId(block.getId());
            for (HostelFloor floor : floors) {
                HostelDto.FloorMapDTO floorDto = new HostelDto.FloorMapDTO();
                floorDto.setId(floor.getId());
                floorDto.setFloorName(floor.getFloorName());
                floorDto.setFloorNumber(floor.getFloorNumber());
                
                List<HostelDto.RoomMapDTO> roomDtos = new java.util.ArrayList<>();
                List<HostelRoom> rooms = roomRepository.findByFloorId(floor.getId());
                for (HostelRoom room : rooms) {
                    HostelDto.RoomMapDTO roomDto = new HostelDto.RoomMapDTO();
                    roomDto.setId(room.getId());
                    roomDto.setRoomNumber(room.getRoomNumber());
                    roomDto.setCapacity(room.getCapacity());
                    roomDto.setAvailableBeds(room.getAvailableBeds());
                    
                    List<HostelDto.BedMapDTO> bedDtos = new java.util.ArrayList<>();
                    List<HostelBed> beds = bedRepository.findByRoomId(room.getId());
                    for (HostelBed bed : beds) {
                        HostelDto.BedMapDTO bedDto = new HostelDto.BedMapDTO();
                        bedDto.setId(bed.getId());
                        bedDto.setBedNumber(bed.getBedNumber());
                        bedDto.setIsOccupied(bed.getIsOccupied());
                        bedDto.setStatus(bed.getStatus().name());
                        
                        HostelAllocation alloc = bedToAllocation.get(bed.getId());
                        if (alloc != null) {
                            bedDto.setOccupantId(alloc.getStudent().getId());
                            bedDto.setOccupantName(alloc.getStudent().getFirstName() + " " + alloc.getStudent().getLastName());
                        }
                        bedDtos.add(bedDto);
                    }
                    roomDto.setBeds(bedDtos);
                    roomDtos.add(roomDto);
                }
                floorDto.setRooms(roomDtos);
                floorDtos.add(floorDto);
            }
            blockDto.setFloors(floorDtos);
            blockDtos.add(blockDto);
        }
        return blockDtos;
    }

    // --- Blocks ---
    @Transactional(readOnly = true)
    public List<HostelBlock> getBlocksByBranch(Long branchId) {
        return blockRepository.findByBranchId(branchId);
    }

    public HostelBlock createBlock(Long branchId, HostelBlock block) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found: " + branchId));
        block.setBranch(branch);
        
        if (block.getWarden() != null && block.getWarden().getId() != null) {
            User warden = userRepository.findById(block.getWarden().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));
            block.setWarden(warden);
        }
        
        if (block.getAcademicYear() != null && block.getAcademicYear().getId() != null) {
            block.setAcademicYear(academicYearRepository.findById(block.getAcademicYear().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Academic year not found")));
        }
        
        return blockRepository.save(block);
    }

    public HostelBlock updateBlock(Long blockId, HostelBlock updates) {
        HostelBlock block = blockRepository.findById(blockId)
                .orElseThrow(() -> new ResourceNotFoundException("Block not found: " + blockId));
        block.setBlockName(updates.getBlockName());
        block.setGenderType(updates.getGenderType());
        block.setStatus(updates.getStatus());
        block.setBlockCode(updates.getBlockCode());
        block.setDescription(updates.getDescription());
        block.setBuildingType(updates.getBuildingType());
        block.setCapacity(updates.getCapacity());
        block.setTotalFloors(updates.getTotalFloors());
        block.setEmergencyContact(updates.getEmergencyContact());
        if (updates.getRfidEnabled() != null) block.setRfidEnabled(updates.getRfidEnabled());
        if (updates.getBiometricEnabled() != null) block.setBiometricEnabled(updates.getBiometricEnabled());
        if (updates.getMessAttached() != null) block.setMessAttached(updates.getMessAttached());
        block.setRemarks(updates.getRemarks());
        
        if (updates.getWarden() != null && updates.getWarden().getId() != null) {
            User warden = userRepository.findById(updates.getWarden().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));
            block.setWarden(warden);
        } else {
            block.setWarden(null);
        }

        if (updates.getAcademicYear() != null && updates.getAcademicYear().getId() != null) {
            block.setAcademicYear(academicYearRepository.findById(updates.getAcademicYear().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Academic year not found")));
        } else {
            block.setAcademicYear(null);
        }
        
        return blockRepository.save(block);
    }

    public void deleteBlock(Long blockId) {
        blockRepository.deleteById(blockId);
    }

    // --- Floors ---
    @Transactional(readOnly = true)
    public List<HostelFloor> getFloorsByBlock(Long blockId) {
        return floorRepository.findByBlockId(blockId);
    }

    public HostelFloor createFloor(Long blockId, HostelFloor floor) {
        HostelBlock block = blockRepository.findById(blockId)
                .orElseThrow(() -> new ResourceNotFoundException("Block not found: " + blockId));
        floor.setBlock(block);
        return floorRepository.save(floor);
    }

    public HostelFloor updateFloor(Long floorId, HostelFloor updates) {
        HostelFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        floor.setFloorName(updates.getFloorName());
        floor.setFloorNumber(updates.getFloorNumber());
        return floorRepository.save(floor);
    }

    public void deleteFloor(Long floorId) {
        floorRepository.deleteById(floorId);
    }

    // --- Rooms ---
    @Transactional(readOnly = true)
    public List<HostelRoom> getRoomsByFloor(Long floorId) {
        return roomRepository.findByFloorId(floorId);
    }

    public HostelRoom createRoom(Long floorId, HostelRoom room) {
        HostelFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found: " + floorId));
        room.setFloor(floor);
        room.setAvailableBeds(room.getCapacity());
        HostelRoom savedRoom = roomRepository.save(room);

        // Auto-generate beds
        for (int i = 1; i <= room.getCapacity(); i++) {
            HostelBed bed = HostelBed.builder()
                    .room(savedRoom)
                    .bedNumber("Bed " + i)
                    .isOccupied(false)
                    .status(HostelBed.BedStatus.AVAILABLE)
                    .build();
            bedRepository.save(bed);
        }

        return savedRoom;
    }

    public HostelRoom updateRoom(Long roomId, HostelRoom updates) {
        HostelRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));
        room.setRoomNumber(updates.getRoomNumber());
        room.setRoomType(updates.getRoomType());
        room.setHasAttachedBath(updates.getHasAttachedBath());
        room.setHasWifi(updates.getHasWifi());
        room.setStatus(updates.getStatus());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long roomId) {
        List<HostelBed> beds = bedRepository.findByRoomId(roomId);
        boolean isAnyOccupied = beds.stream().anyMatch(HostelBed::getIsOccupied);
        if (isAnyOccupied) {
            throw new IllegalStateException("Cannot delete room with occupied beds");
        }
        bedRepository.deleteAll(beds);
        roomRepository.deleteById(roomId);
    }

    // --- Beds ---
    @Transactional(readOnly = true)
    public List<HostelBed> getBedsByRoom(Long roomId) {
        return bedRepository.findByRoomId(roomId);
    }
    
    @Transactional(readOnly = true)
    public List<HostelBed> getAvailableBedsByRoom(Long roomId) {
        return bedRepository.findByRoomIdAndStatusAndIsOccupiedFalse(roomId, HostelBed.BedStatus.AVAILABLE);
    }
}
