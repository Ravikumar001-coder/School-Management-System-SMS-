package com.school.sms.controller.hostel;

import com.school.sms.dto.hostel.HostelDto;
import com.school.sms.model.User;
import com.school.sms.model.hostel.HostelBed;
import com.school.sms.model.hostel.HostelBlock;
import com.school.sms.model.hostel.HostelFloor;
import com.school.sms.model.AcademicYear;
import com.school.sms.model.hostel.HostelRoom;
import com.school.sms.service.hostel.HostelInfrastructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hostel/infrastructure")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER', 'ADMIN', 'WARDEN')")
public class HostelInfrastructureController {

    private final HostelInfrastructureService infrastructureService;

    @GetMapping("/branches/{branchId}/blocks")
    public ResponseEntity<List<HostelBlock>> getBlocks(@PathVariable Long branchId) {
        return ResponseEntity.ok(infrastructureService.getBlocksByBranch(branchId));
    }

    @GetMapping("/branches/{branchId}/map")
    public ResponseEntity<List<HostelDto.BlockMapDTO>> getBranchInfrastructureMap(@PathVariable Long branchId) {
        return ResponseEntity.ok(infrastructureService.getBranchInfrastructureMap(branchId));
    }

    @PostMapping("/branches/{branchId}/blocks")
    public ResponseEntity<HostelBlock> createBlock(@PathVariable Long branchId, @RequestBody HostelDto.BlockRequest request) {
        HostelBlock block = new HostelBlock();
        block.setBlockName(request.getBlockName());
        block.setGenderType(request.getGenderType());
        block.setBlockCode(request.getBlockCode());
        block.setDescription(request.getDescription());
        block.setBuildingType(request.getBuildingType());
        block.setCapacity(request.getCapacity());
        block.setTotalFloors(request.getTotalFloors());
        block.setEmergencyContact(request.getEmergencyContact());
        if (request.getRfidEnabled() != null) block.setRfidEnabled(request.getRfidEnabled());
        if (request.getBiometricEnabled() != null) block.setBiometricEnabled(request.getBiometricEnabled());
        if (request.getMessAttached() != null) block.setMessAttached(request.getMessAttached());
        block.setRemarks(request.getRemarks());
        
        if (request.getAcademicYearId() != null) {
            AcademicYear year = new AcademicYear();
            year.setId(request.getAcademicYearId());
            block.setAcademicYear(year);
        }

        if (request.getWardenId() != null) {
            User warden = new User();
            warden.setId(request.getWardenId());
            block.setWarden(warden);
        }
        return ResponseEntity.ok(infrastructureService.createBlock(branchId, block));
    }

    @PutMapping("/blocks/{blockId}")
    public ResponseEntity<HostelBlock> updateBlock(@PathVariable Long blockId, @RequestBody HostelDto.BlockRequest request) {
        HostelBlock block = new HostelBlock();
        block.setBlockName(request.getBlockName());
        block.setGenderType(request.getGenderType());
        block.setStatus(request.getStatus() != null ? request.getStatus() : HostelBlock.BlockStatus.ACTIVE);
        block.setBlockCode(request.getBlockCode());
        block.setDescription(request.getDescription());
        block.setBuildingType(request.getBuildingType());
        block.setCapacity(request.getCapacity());
        block.setTotalFloors(request.getTotalFloors());
        block.setEmergencyContact(request.getEmergencyContact());
        if (request.getRfidEnabled() != null) block.setRfidEnabled(request.getRfidEnabled());
        if (request.getBiometricEnabled() != null) block.setBiometricEnabled(request.getBiometricEnabled());
        if (request.getMessAttached() != null) block.setMessAttached(request.getMessAttached());
        block.setRemarks(request.getRemarks());
        
        if (request.getAcademicYearId() != null) {
            AcademicYear year = new AcademicYear();
            year.setId(request.getAcademicYearId());
            block.setAcademicYear(year);
        }

        if (request.getWardenId() != null) {
            User warden = new User();
            warden.setId(request.getWardenId());
            block.setWarden(warden);
        }
        return ResponseEntity.ok(infrastructureService.updateBlock(blockId, block));
    }

    @DeleteMapping("/blocks/{blockId}")
    public ResponseEntity<Void> deleteBlock(@PathVariable Long blockId) {
        infrastructureService.deleteBlock(blockId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/blocks/{blockId}/floors")
    public ResponseEntity<List<HostelFloor>> getFloors(@PathVariable Long blockId) {
        return ResponseEntity.ok(infrastructureService.getFloorsByBlock(blockId));
    }

    @PostMapping("/blocks/{blockId}/floors")
    public ResponseEntity<HostelFloor> createFloor(@PathVariable Long blockId, @RequestBody HostelDto.FloorRequest request) {
        HostelFloor floor = new HostelFloor();
        floor.setFloorName(request.getFloorName());
        floor.setFloorNumber(request.getFloorNumber());
        return ResponseEntity.ok(infrastructureService.createFloor(blockId, floor));
    }

    @PutMapping("/floors/{floorId}")
    public ResponseEntity<HostelFloor> updateFloor(@PathVariable Long floorId, @RequestBody HostelDto.FloorRequest request) {
        HostelFloor floor = new HostelFloor();
        floor.setFloorName(request.getFloorName());
        floor.setFloorNumber(request.getFloorNumber());
        return ResponseEntity.ok(infrastructureService.updateFloor(floorId, floor));
    }

    @DeleteMapping("/floors/{floorId}")
    public ResponseEntity<Void> deleteFloor(@PathVariable Long floorId) {
        infrastructureService.deleteFloor(floorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/floors/{floorId}/rooms")
    public ResponseEntity<List<HostelRoom>> getRooms(@PathVariable Long floorId) {
        return ResponseEntity.ok(infrastructureService.getRoomsByFloor(floorId));
    }

    @PostMapping("/floors/{floorId}/rooms")
    public ResponseEntity<HostelRoom> createRoom(@PathVariable Long floorId, @RequestBody HostelDto.RoomRequest request) {
        HostelRoom room = new HostelRoom();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setCapacity(request.getCapacity());
        room.setHasAttachedBath(request.getHasAttachedBath());
        room.setHasWifi(request.getHasWifi());
        return ResponseEntity.ok(infrastructureService.createRoom(floorId, room));
    }

    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<HostelRoom> updateRoom(@PathVariable Long roomId, @RequestBody HostelDto.RoomRequest request) {
        HostelRoom room = new HostelRoom();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setHasAttachedBath(request.getHasAttachedBath());
        room.setHasWifi(request.getHasWifi());
        room.setStatus(request.getStatus());
        return ResponseEntity.ok(infrastructureService.updateRoom(roomId, room));
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        infrastructureService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rooms/{roomId}/beds")
    public ResponseEntity<List<HostelBed>> getBeds(@PathVariable Long roomId) {
        return ResponseEntity.ok(infrastructureService.getBedsByRoom(roomId));
    }
}
