package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RootAdminOverviewResponse {
    private StudentKpis students;
    private HrKpis hr;
    private FinanceKpis finance;
    private OperationsKpis operations;
    private double healthScore;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentKpis {
        private long totalActive;
        private long newAdmissions;
        private long pendingAdmissions;
        private double attendanceToday;
        private double studentTeacherRatio;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HrKpis {
        private long totalTeaching;
        private long totalNonTeaching;
        private double attendanceToday;
        private long onLeaveToday;
        private double upcomingPayroll;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FinanceKpis {
        private double revenueThisMonth;
        private double outstandingFees;
        private double netProfit;
        private double monthlyExpenses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OperationsKpis {
        private long activeVehicles;
        private long vehiclesMaintenance;
        private double hostelOccupancy;
        private long pendingMaintenance;
        private int inventoryAlerts;
        private long securityIncidents;
    }
}
