package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.admin.AdmissionLead;
import com.school.sms.service.admin.AdmissionCrmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admission CRM Controller
 * Provides full lead lifecycle management: create, list by status, update status.
 * Route: /api/v1/admin/crm
 */
@RestController
@RequestMapping("/api/v1/admin/crm")
@RequiredArgsConstructor
public class AdmissionCrmController {

    private final AdmissionCrmService crmService;

    /**
     * GET /api/v1/admin/crm/leads
     * Fetch all admission leads (or filter by status).
     */
    @GetMapping("/leads")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<AdmissionLead>>> getLeads(
            @RequestParam(required = false) AdmissionLead.LeadStatus status) {
        List<AdmissionLead> leads = (status != null)
                ? crmService.getLeadsByStatus(status)
                : crmService.getAllLeads();
        return ResponseEntity.ok(ApiResponse.success("Leads fetched", leads));
    }

    /**
     * POST /api/v1/admin/crm/leads
     * Create a new admission enquiry lead.
     */
    @PostMapping("/leads")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<AdmissionLead>> createLead(@RequestBody AdmissionLead lead) {
        AdmissionLead created = crmService.createLead(lead);
        return ResponseEntity.ok(ApiResponse.success("Lead created successfully", created));
    }

    /**
     * PATCH /api/v1/admin/crm/leads/{id}/status
     * Advance a lead to the next pipeline stage.
     */
    @PatchMapping("/leads/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<AdmissionLead>> updateLeadStatus(
            @PathVariable Long id,
            @RequestParam AdmissionLead.LeadStatus status) {
        AdmissionLead updated = crmService.updateLeadStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Lead status updated", updated));
    }

    /**
     * PUT /api/v1/admin/crm/leads/{id}
     * Update lead details (parent info, notes, assigned staff, etc.)
     */
    @PutMapping("/leads/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<AdmissionLead>> updateLead(
            @PathVariable Long id,
            @RequestBody AdmissionLead lead) {
        AdmissionLead updated = crmService.updateLead(id, lead);
        return ResponseEntity.ok(ApiResponse.success("Lead updated", updated));
    }

    /**
     * DELETE /api/v1/admin/crm/leads/{id}
     * Archive / soft-delete a lead.
     */
    @DeleteMapping("/leads/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable Long id) {
        crmService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success("Lead archived"));
    }
}
