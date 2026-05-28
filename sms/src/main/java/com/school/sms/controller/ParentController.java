package com.school.sms.controller;

import com.school.sms.dto.request.ParentRequest;
import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.ParentResponse;
import com.school.sms.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<ParentResponse>> createParent(@Valid @RequestBody ParentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Parent registered successfully", parentService.createParent(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<ParentResponse>>> getAllParents() {
        return ResponseEntity.ok(ApiResponse.success("Parents fetched", parentService.getAllParents()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<ParentResponse>> getParentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Parent found", parentService.getParentById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<ParentResponse>> updateParent(@PathVariable Long id, @Valid @RequestBody ParentRequest request) {
        System.out.println("[DEBUG] Updating parent with ID: " + id);
        return ResponseEntity.ok(ApiResponse.success("Parent updated successfully", parentService.updateParent(id, request)));
    }

    @GetMapping("/my-children")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<ApiResponse<List<ParentResponse.StudentLinkResponse>>> getMyChildren() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ApiResponse.success("Children fetched", parentService.getChildrenByParentPhone(phone)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteParent(@PathVariable Long id) {
        parentService.deleteParent(id);
        return ResponseEntity.ok(ApiResponse.success("Parent deleted successfully", null));
    }
}
