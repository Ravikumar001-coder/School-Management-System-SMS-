// dto/response/DashboardResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private Long totalStudents;
    private Long totalTeachers;
    private Long totalClasses;
    private Long totalSubjects;
    private Long activeStudents;
    private Double todayAttendancePercentage;
    private Double totalPendingFees;
    private Double thisMonthCollection;
    private Map<String, Long> studentsByClass;
    private Map<String, Long> attendanceByStatus;
}