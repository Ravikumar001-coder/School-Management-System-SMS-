package com.school.sms.service.transport;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.Branch;
import com.school.sms.model.transport.*;
import com.school.sms.repository.BranchRepository;
import com.school.sms.repository.transport.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransportRouteService {

    private final TransportRouteRepository routeRepository;
    private final RouteStopRepository stopRepository;
    private final StudentTransportAssignmentRepository assignmentRepository;
    private final BranchRepository branchRepository;

    // ─── Route Management ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TransportRoute> getAllRoutesByBranch(Long branchId) {
        return routeRepository.findByBranchIdAndDeletedAtIsNull(branchId);
    }

    @Transactional(readOnly = true)
    public TransportRoute getRouteById(Long id) {
        return routeRepository.findById(id)
                .filter(r -> r.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + id));
    }

    public TransportRoute createRoute(TransportRoute route, Long branchId) {
        if (routeRepository.existsByRouteCodeAndDeletedAtIsNull(route.getRouteCode())) {
            throw new IllegalArgumentException("Route code already exists: " + route.getRouteCode());
        }
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found: " + branchId));
        route.setBranch(branch);
        TransportRoute saved = routeRepository.save(route);
        log.info("Created transport route: {} [{}]", saved.getRouteName(), saved.getRouteCode());
        return saved;
    }

    public TransportRoute updateRoute(Long id, TransportRoute updates) {
        TransportRoute route = getRouteById(id);
        route.setRouteName(updates.getRouteName());
        route.setRouteType(updates.getRouteType());
        route.setStartLocation(updates.getStartLocation());
        route.setEndLocation(updates.getEndLocation());
        route.setEstimatedDistanceKm(updates.getEstimatedDistanceKm());
        route.setEstimatedDurationMinutes(updates.getEstimatedDurationMinutes());
        route.setActiveDays(updates.getActiveDays());
        route.setNotes(updates.getNotes());
        return routeRepository.save(route);
    }

    public void archiveRoute(Long id) {
        TransportRoute route = getRouteById(id);
        route.setStatus(TransportRoute.RouteStatus.ARCHIVED);
        route.setDeletedAt(LocalDateTime.now());
        routeRepository.save(route);
        log.info("Archived transport route: {}", id);
    }

    // ─── Stop Management ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<RouteStop> getStopsByRoute(Long routeId) {
        return stopRepository.findByRouteIdOrderByStopSequenceAsc(routeId);
    }

    public RouteStop addStop(Long routeId, RouteStop stop) {
        TransportRoute route = getRouteById(routeId);
        stop.setRoute(route);
        return stopRepository.save(stop);
    }

    public RouteStop updateStop(Long stopId, RouteStop updates) {
        RouteStop stop = stopRepository.findById(stopId)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found: " + stopId));
        stop.setStopName(updates.getStopName());
        stop.setStopSequence(updates.getStopSequence());
        stop.setLatitude(updates.getLatitude());
        stop.setLongitude(updates.getLongitude());
        stop.setPickupTime(updates.getPickupTime());
        stop.setDropTime(updates.getDropTime());
        stop.setLandmark(updates.getLandmark());
        stop.setStopRadiusMeters(updates.getStopRadiusMeters());
        return stopRepository.save(stop);
    }

    public void deleteStop(Long stopId) {
        RouteStop stop = stopRepository.findById(stopId)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found: " + stopId));
        long studentsAtStop = stopRepository.countStudentsAtStop(stopId);
        if (studentsAtStop > 0) {
            throw new IllegalStateException("Cannot delete stop with " + studentsAtStop + " assigned students");
        }
        stopRepository.delete(stop);
    }

    // ─── Student Assignments ─────────────────────────────────────────────────

    public StudentTransportAssignment assignStudent(StudentTransportAssignment assignment) {
        // Check for existing active assignment
        assignmentRepository.findByStudentIdAndStatus(
                assignment.getStudent().getId(),
                StudentTransportAssignment.AssignmentStatus.ACTIVE
        ).ifPresent(existing -> {
            existing.setStatus(StudentTransportAssignment.AssignmentStatus.TRANSFERRED);
            assignmentRepository.save(existing);
        });
        return assignmentRepository.save(assignment);
    }

    @Transactional(readOnly = true)
    public List<StudentTransportAssignment> getStudentsByRoute(Long routeId) {
        return assignmentRepository.findByRouteIdAndStatus(
                routeId, StudentTransportAssignment.AssignmentStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public long getStudentCountForRoute(Long routeId) {
        return assignmentRepository.countActiveStudentsOnRoute(routeId);
    }
}
