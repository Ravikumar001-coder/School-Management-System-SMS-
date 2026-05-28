package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.service.GlobalSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/search", "/api/search"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT_ADMIN', 'BRANCH_ADMIN', 'HR_ADMIN', 'FINANCE_ADMIN')")
public class GlobalSearchController {

    private final GlobalSearchService globalSearchService;

    @GetMapping("/global")
    public ResponseEntity<ApiResponse<GlobalSearchService.GlobalSearchResponse>> search(
            @RequestParam String q,
            @RequestParam(required = false) Long branchId) {
        GlobalSearchService.GlobalSearchResponse results = globalSearchService.search(q, branchId);
        return ResponseEntity.ok(ApiResponse.success("Search results loaded successfully", results));
    }
}
