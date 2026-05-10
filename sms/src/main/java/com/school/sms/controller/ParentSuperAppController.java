// src/main/java/com/school/sms/controller/ParentSuperAppController.java
package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.dto.response.ParentSuperAppDto.*;
import com.school.sms.model.LeaveRequest;
import com.school.sms.service.ParentSuperAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.school.sms.model.Complaint;
import com.school.sms.model.ConsentResponse;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/parents/app")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PARENT')")
public class ParentSuperAppController {

    private final ParentSuperAppService superAppService;

    private String getParentMobile() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/attendance/{studentId}")
    public ResponseEntity<ApiResponse<AttendanceSummary>> getAttendance(
            @PathVariable Long studentId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now().plusDays(1);
        
        return ResponseEntity.ok(ApiResponse.success("Attendance fetched", 
                superAppService.getAttendance(getParentMobile(), studentId, start, end)));
    }

    @GetMapping("/fees/{studentId}")
    public ResponseEntity<ApiResponse<FeeSummary>> getFees(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Fees fetched", 
                superAppService.getFees(getParentMobile(), studentId)));
    }

    @GetMapping("/homework/{studentId}")
    public ResponseEntity<ApiResponse<HomeworkSummary>> getHomework(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Homework fetched", 
                superAppService.getHomework(getParentMobile(), studentId)));
    }

    @GetMapping("/leave/{studentId}")
    public ResponseEntity<ApiResponse<List<LeaveRequestItem>>> getLeaveRequests(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Leave requests fetched", 
                superAppService.getLeaveRequests(getParentMobile(), studentId)));
    }

    @PostMapping("/{studentId}/leave")
    public ResponseEntity<ApiResponse<Void>> submitLeave(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId,
            @RequestBody LeaveRequest request) {
        String parentMobile = user.getUsername();
        superAppService.submitLeaveRequest(parentMobile, studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Leave request submitted successfully", null));
    }

    // ==========================================
    // ADVANCED MODULES
    // ==========================================

    @GetMapping("/{studentId}/circulars")
    public ResponseEntity<ApiResponse<List<com.school.sms.dto.response.ParentSuperAppDto.CircularItem>>> getCirculars(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId) {
        String parentMobile = user.getUsername();
        return ResponseEntity.ok(ApiResponse.success("Circulars fetched", superAppService.getCirculars(parentMobile, studentId)));
    }

    @GetMapping("/{studentId}/complaints")
    public ResponseEntity<ApiResponse<List<com.school.sms.dto.response.ParentSuperAppDto.ComplaintItem>>> getComplaints(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId) {
        String parentMobile = user.getUsername();
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched", superAppService.getComplaints(parentMobile, studentId)));
    }

    @PostMapping("/{studentId}/complaints")
    public ResponseEntity<ApiResponse<Void>> submitComplaint(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId,
            @RequestBody Complaint request) {
        String parentMobile = user.getUsername();
        superAppService.submitComplaint(parentMobile, studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint submitted successfully", null));
    }

    @GetMapping("/{studentId}/ptm")
    public ResponseEntity<ApiResponse<List<com.school.sms.dto.response.ParentSuperAppDto.PtmSlotItem>>> getPtmSlots(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId,
            @RequestParam Long teacherId) {
        String parentMobile = user.getUsername();
        return ResponseEntity.ok(ApiResponse.success("PTM slots fetched", superAppService.getPtmSlots(parentMobile, studentId, teacherId)));
    }

    @PostMapping("/{studentId}/ptm/book/{slotId}")
    public ResponseEntity<ApiResponse<Void>> bookPtmSlot(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId,
            @PathVariable Long slotId) {
        String parentMobile = user.getUsername();
        superAppService.bookPtmSlot(parentMobile, studentId, slotId);
        return ResponseEntity.ok(ApiResponse.success("PTM slot booked successfully", null));
    }

    @GetMapping("/{studentId}/results")
    public ResponseEntity<ApiResponse<List<com.school.sms.dto.response.ParentSuperAppDto.ResultItem>>> getResults(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId) {
        String parentMobile = user.getUsername();
        return ResponseEntity.ok(ApiResponse.success("Results fetched", superAppService.getResults(parentMobile, studentId)));
    }

    @GetMapping("/{studentId}/downloads")
    public ResponseEntity<ApiResponse<List<com.school.sms.dto.response.ParentSuperAppDto.DownloadItem>>> getDownloads(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId) {
        String parentMobile = user.getUsername();
        return ResponseEntity.ok(ApiResponse.success("Downloads fetched", superAppService.getDownloads(parentMobile, studentId)));
    }

    @GetMapping("/{studentId}/consents")
    public ResponseEntity<ApiResponse<List<com.school.sms.dto.response.ParentSuperAppDto.ConsentItem>>> getConsentForms(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId) {
        String parentMobile = user.getUsername();
        return ResponseEntity.ok(ApiResponse.success("Consent forms fetched", superAppService.getConsentForms(parentMobile, studentId)));
    }

    @PostMapping("/{studentId}/consents/{formId}")
    public ResponseEntity<ApiResponse<Void>> submitConsentResponse(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long studentId,
            @PathVariable Long formId,
            @RequestBody ConsentResponse response) {
        String parentMobile = user.getUsername();
        superAppService.submitConsentResponse(parentMobile, studentId, formId, response);
        return ResponseEntity.ok(ApiResponse.success("Consent response submitted successfully", null));
    }
}
