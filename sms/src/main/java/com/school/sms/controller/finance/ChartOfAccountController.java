package com.school.sms.controller.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.ChartOfAccount;
import com.school.sms.service.finance.ChartOfAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/coa")
@RequiredArgsConstructor
public class ChartOfAccountController {

    private final ChartOfAccountService coaService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<ApiResponse<List<ChartOfAccount>>> getAll(@PathVariable Long branchId) {
        return ResponseEntity.ok(coaService.getAllAccounts(branchId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChartOfAccount>> create(@RequestBody ChartOfAccount account) {
        return ResponseEntity.ok(coaService.createAccount(account));
    }
}
