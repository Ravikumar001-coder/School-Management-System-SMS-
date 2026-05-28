package com.school.sms.controller.hostel;

import com.school.sms.dto.hostel.HostelDto;
import com.school.sms.model.hostel.MessBilling;
import com.school.sms.model.hostel.MessPayment;
import com.school.sms.model.hostel.MessPlan;
import com.school.sms.service.hostel.MessBillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hostel/mess")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER', 'ADMIN', 'WARDEN', 'ACCOUNTANT')")
public class MessBillingController {

    private final MessBillingService messBillingService;

    @GetMapping("/branches/{branchId}/plans")
    public ResponseEntity<List<MessPlan>> getPlans(@PathVariable Long branchId) {
        return ResponseEntity.ok(messBillingService.getPlansByBranch(branchId));
    }

    @PostMapping("/branches/{branchId}/plans")
    public ResponseEntity<MessPlan> createPlan(@PathVariable Long branchId, @RequestBody HostelDto.MessPlanRequest request) {
        MessPlan plan = new MessPlan();
        plan.setPlanName(request.getPlanName());
        plan.setPlanType(request.getPlanType());
        plan.setDailyRate(request.getDailyRate());
        plan.setMonthlyRate(request.getMonthlyRate());
        plan.setBreakfastCost(request.getBreakfastCost());
        plan.setLunchCost(request.getLunchCost());
        plan.setDinnerCost(request.getDinnerCost());
        plan.setSnacksCost(request.getSnacksCost());
        plan.setHolidayDeductionRule(request.getHolidayDeductionRule());
        plan.setRefundRule(request.getRefundRule());
        plan.setLateJoiningRule(request.getLateJoiningRule());
        
        return ResponseEntity.ok(messBillingService.createMessPlan(branchId, plan));
    }

    @GetMapping("/bills")
    public ResponseEntity<List<MessBilling>> getAllBills() {
        return ResponseEntity.ok(messBillingService.getAllBills());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<MessPayment>> getAllPayments() {
        return ResponseEntity.ok(messBillingService.getAllPayments());
    }

    @PostMapping("/bills/preview")
    public ResponseEntity<MessBilling> previewBill(@RequestBody HostelDto.GenerateBillRequest request) {
        return ResponseEntity.ok(messBillingService.previewMonthlyBill(
                request.getAllocationId(),
                request.getPlanId(),
                request.getMonth(),
                request.getYear(),
                request.getTotalDays(),
                request.getAbsentDays(),
                request.getExtraCharges() != null ? request.getExtraCharges() : 0.0,
                request.getFines() != null ? request.getFines() : 0.0,
                request.getHolidayDeductions() != null ? request.getHolidayDeductions() : 0.0
        ));
    }

    @PostMapping("/bills/generate")
    public ResponseEntity<MessBilling> generateBill(@RequestBody HostelDto.GenerateBillRequest request) {
        Long dummyGeneratedById = 1L; // For MVP context

        return ResponseEntity.ok(messBillingService.generateMonthlyBill(
                request.getAllocationId(),
                request.getPlanId(),
                request.getMonth(),
                request.getYear(),
                request.getTotalDays(),
                request.getAbsentDays(),
                request.getExtraCharges() != null ? request.getExtraCharges() : 0.0,
                request.getFines() != null ? request.getFines() : 0.0,
                request.getHolidayDeductions() != null ? request.getHolidayDeductions() : 0.0,
                request.getDueDate(),
                dummyGeneratedById
        ));
    }

    @PostMapping("/payments")
    public ResponseEntity<MessPayment> recordPayment(@RequestBody HostelDto.MessPaymentRequest request) {
        Long dummyRecordedById = 1L; // For MVP context
        // Generating random receipt number for mock UI
        String receipt = "REC" + System.currentTimeMillis();

        return ResponseEntity.ok(messBillingService.recordPayment(
                request.getBillId(),
                request.getAmountPaid(),
                request.getPaymentMode(),
                receipt,
                dummyRecordedById
        ));
    }

    @PutMapping("/bills/{billId}/pay")
    public ResponseEntity<MessBilling> payBill(@PathVariable Long billId) {
        return ResponseEntity.ok(messBillingService.markBillAsPaid(billId));
    }
}
