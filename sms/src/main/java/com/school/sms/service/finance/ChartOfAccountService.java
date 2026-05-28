package com.school.sms.service.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.ChartOfAccount;
import com.school.sms.repository.finance.ChartOfAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChartOfAccountService {
    private final ChartOfAccountRepository chartOfAccountRepository;

    public ApiResponse<List<ChartOfAccount>> getAllAccounts(Long branchId) {
        return ApiResponse.success("Fetched COA", chartOfAccountRepository.findByBranchId(branchId));
    }

    public ApiResponse<ChartOfAccount> createAccount(ChartOfAccount account) {
        return ApiResponse.success("Created account", chartOfAccountRepository.save(account));
    }
}
