package com.school.sms.controller.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.Expense;
import com.school.sms.service.finance.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpenses(@PathVariable Long branchId) {
        return ResponseEntity.ok(expenseService.getExpenses(branchId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> create(@RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.createExpense(expense));
    }
}
