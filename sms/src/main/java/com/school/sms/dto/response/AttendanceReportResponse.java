package com.school.sms.dto.response;

import com.school.sms.model.Attendance;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AttendanceReportResponse {
    private Long studentId;
    private int totalDays;
    private int presentDays;
    private int absentDays;
    private double percentage;
    private List<Attendance> records;
}
