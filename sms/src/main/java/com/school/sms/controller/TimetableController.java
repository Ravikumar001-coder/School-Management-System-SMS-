package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Timetable;
import com.school.sms.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/timetables")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
public class TimetableController {

    private final TimetableRepository timetableRepository;

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<Timetable>>> getByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(ApiResponse.success("Timetable fetched", timetableRepository.findByClassRoomIdOrderByPeriodNumber(classId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Timetable>> create(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(ApiResponse.success("Timetable entry created", timetableRepository.save(timetable)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        timetableRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Timetable entry deleted"));
    }
}
