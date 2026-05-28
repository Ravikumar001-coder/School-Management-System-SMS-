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
public class StudentMetricsResponse {
    private long totalActiveStudents;
    private long newAdmissions;
    private double todayAttendancePercentage;
    private double studentTeacherRatio;
    private long pendingAdmissions;
    private Map<String, Long> classWiseDistribution;
}
