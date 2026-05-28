// dto/response/DashboardResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Map;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    
    // New fields for updated Admin Dashboard
    private Long totalDepartments;
    private List<Map<String, Object>> trends;
    private Map<String, Long> enrollmentByDepartment;
    private List<Map<String, Object>> recentActivity;
    private List<Map<String, Object>> upcomingDeadlines;
    private Long activeSessionsCount;
}