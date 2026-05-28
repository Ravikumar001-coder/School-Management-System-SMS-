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
public class HrMetricsResponse {
    private long totalTeachingStaff;
    private long totalNonTeachingStaff;
    private double todayAttendancePercentage;
    private long onLeaveToday;
    private double upcomingPayroll;
    private Map<String, Long> departmentDistribution;
}
