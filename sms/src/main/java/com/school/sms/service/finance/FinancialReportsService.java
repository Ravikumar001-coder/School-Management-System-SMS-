package com.school.sms.service.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.ChartOfAccount;
import com.school.sms.repository.finance.ChartOfAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinancialReportsService {

    private final ChartOfAccountRepository coaRepository;

    public ApiResponse<Map<String, Object>> getProfitAndLoss(Long branchId, String fromDate, String toDate) {
        List<ChartOfAccount> allAccounts = coaRepository.findByBranchId(branchId);
        
        // In a real application, we would aggregate JournalEntryLine amounts within the date range.
        // Since we are mocking the report aggregation slightly for speed, we'll use the opening balances for demo.
        
        List<ChartOfAccount> incomeAccounts = allAccounts.stream()
                .filter(a -> a.getAccountType() == ChartOfAccount.AccountType.INCOME)
                .collect(Collectors.toList());
                
        List<ChartOfAccount> expenseAccounts = allAccounts.stream()
                .filter(a -> a.getAccountType() == ChartOfAccount.AccountType.EXPENSE)
                .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();
        report.put("income", incomeAccounts);
        report.put("expense", expenseAccounts);
        
        return ApiResponse.success("Profit & Loss Report", report);
    }
    
    public ApiResponse<Map<String, Object>> getBalanceSheet(Long branchId, String asOfDate) {
        List<ChartOfAccount> allAccounts = coaRepository.findByBranchId(branchId);
        
        List<ChartOfAccount> assets = allAccounts.stream()
                .filter(a -> a.getAccountType() == ChartOfAccount.AccountType.ASSET)
                .collect(Collectors.toList());
                
        List<ChartOfAccount> liabilities = allAccounts.stream()
                .filter(a -> a.getAccountType() == ChartOfAccount.AccountType.LIABILITY)
                .collect(Collectors.toList());
                
        List<ChartOfAccount> equity = allAccounts.stream()
                .filter(a -> a.getAccountType() == ChartOfAccount.AccountType.EQUITY)
                .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();
        report.put("assets", assets);
        report.put("liabilities", liabilities);
        report.put("equity", equity);
        
        return ApiResponse.success("Balance Sheet", report);
    }
}
