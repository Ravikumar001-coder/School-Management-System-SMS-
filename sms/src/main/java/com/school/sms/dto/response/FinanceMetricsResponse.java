package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceMetricsResponse {
    private double revenueThisMonth;
    private double outstandingFees;
    private double netProfit;
    private double monthlyExpense;
    private double salaryPayoutPending;
    private List<Map<String, Object>> recentTransactions;
}
