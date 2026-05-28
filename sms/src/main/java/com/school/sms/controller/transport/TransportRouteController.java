package com.school.sms.controller.transport;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.transport.*;
import com.school.sms.service.transport.TransportRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport/routes")
@RequiredArgsConstructor
public class TransportRouteController {

    private final TransportRouteService routeService;

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<TransportRoute>>> getAllRoutes(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success("Routes fetched", routeService.getAllRoutesByBranch(branchId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<TransportRoute>> getRoute(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", routeService.getRouteById(id)));
    }

    @PostMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<TransportRoute>> createRoute(
            @PathVariable Long branchId,
            @RequestBody TransportRoute route) {
        return ResponseEntity.ok(ApiResponse.success("Route created", routeService.createRoute(route, branchId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<TransportRoute>> updateRoute(
            @PathVariable Long id,
            @RequestBody TransportRoute route) {
        return ResponseEntity.ok(ApiResponse.success("Route updated", routeService.updateRoute(id, route)));
    }

    @DeleteMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<Void>> archiveRoute(@PathVariable Long id) {
        routeService.archiveRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route archived"));
    }

    // ─── Stops ───────────────────────────────────────────────────────────────

    @GetMapping("/{routeId}/stops")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER','DRIVER')")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getStops(@PathVariable Long routeId) {
        return ResponseEntity.ok(ApiResponse.success("OK", routeService.getStopsByRoute(routeId)));
    }

    @PostMapping("/{routeId}/stops")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<RouteStop>> addStop(
            @PathVariable Long routeId,
            @RequestBody RouteStop stop) {
        return ResponseEntity.ok(ApiResponse.success("Stop added", routeService.addStop(routeId, stop)));
    }

    @PutMapping("/stops/{stopId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<RouteStop>> updateStop(
            @PathVariable Long stopId,
            @RequestBody RouteStop stop) {
        return ResponseEntity.ok(ApiResponse.success("Stop updated", routeService.updateStop(stopId, stop)));
    }

    @DeleteMapping("/stops/{stopId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStop(@PathVariable Long stopId) {
        routeService.deleteStop(stopId);
        return ResponseEntity.ok(ApiResponse.success("Stop deleted"));
    }

    // ─── Student Assignments ─────────────────────────────────────────────────

    @GetMapping("/{routeId}/students")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<List<StudentTransportAssignment>>> getStudents(@PathVariable Long routeId) {
        return ResponseEntity.ok(ApiResponse.success("OK", routeService.getStudentsByRoute(routeId)));
    }

    @PostMapping("/assignments")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<StudentTransportAssignment>> assignStudent(
            @RequestBody StudentTransportAssignment assignment) {
        return ResponseEntity.ok(ApiResponse.success("Student assigned", routeService.assignStudent(assignment)));
    }

    @GetMapping("/{routeId}/student-count")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN','TRANSPORT_MANAGER')")
    public ResponseEntity<ApiResponse<Long>> getStudentCount(@PathVariable Long routeId) {
        return ResponseEntity.ok(ApiResponse.success("OK", routeService.getStudentCountForRoute(routeId)));
    }
}
