package com.school.sms.service.finance;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinanceDashboardService {

    private final StudentLedgerService ledgerService;

    public Map<String, Object> getDashboardStats(Long branchId, Long academicYearId) {
        // MOCK data for the initial rollout
        return Map.of(
            "dailyCollection", BigDecimal.valueOf(150000.00),
            "outstandingDues", BigDecimal.valueOf(450000.00),
            "collectionEfficiency", 85.5,
            "defaulterCount", 45,
            "scholarshipsTotal", BigDecimal.valueOf(50000.00)
        );
    }
}
