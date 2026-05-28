package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Announcement;
import com.school.sms.model.User;
import com.school.sms.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Announcements fetched", announcementRepository.findAllByOrderByCreatedAtDesc()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> create(
            @RequestBody Announcement announcement,
            @AuthenticationPrincipal User user) {
        announcement.setCreatedBy(user);
        return ResponseEntity.ok(ApiResponse.success("Announcement created", announcementRepository.save(announcement)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted"));
    }
}
