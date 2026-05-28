package com.school.sms.service.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.Expense;
import com.school.sms.repository.finance.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ApiResponse<List<Expense>> getExpenses(Long branchId) {
        return ApiResponse.success("Fetched expenses", expenseRepository.findByBranchId(branchId));
    }

    public ApiResponse<Expense> createExpense(Expense expense) {
        // Here we could auto-generate expense_no
        return ApiResponse.success("Created expense", expenseRepository.save(expense));
    }
}
