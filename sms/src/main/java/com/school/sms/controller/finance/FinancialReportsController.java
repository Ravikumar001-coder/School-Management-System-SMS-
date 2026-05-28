package com.school.sms.controller.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.service.finance.FinancialReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/finance/reports")
@RequiredArgsConstructor
public class FinancialReportsController {

    private final FinancialReportsService reportsService;

    @GetMapping("/pnl/{branchId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPnL(
            @PathVariable Long branchId, 
            @RequestParam(required = false) String fromDate, 
            @RequestParam(required = false) String toDate) {
        return ResponseEntity.ok(reportsService.getProfitAndLoss(branchId, fromDate, toDate));
    }

    @GetMapping("/balancesheet/{branchId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBalanceSheet(
            @PathVariable Long branchId, 
            @RequestParam(required = false) String asOfDate) {
        return ResponseEntity.ok(reportsService.getBalanceSheet(branchId, asOfDate));
    }
}
