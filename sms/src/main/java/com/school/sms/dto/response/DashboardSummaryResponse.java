package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalActiveStudents;
    private long totalTeachingStaff;
    private long totalNonTeachingStaff;
    private double monthlyRevenue;
    private double outstandingFees;
    private long activeVehiclesCount;
    private double hostelOccupancyRate;
    private Map<String, Object> healthScore;
}
