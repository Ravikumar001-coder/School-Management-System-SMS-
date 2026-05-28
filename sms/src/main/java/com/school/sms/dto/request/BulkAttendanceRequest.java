// dto/request/BulkAttendanceRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class BulkAttendanceRequest {

    @NotNull(message = "Class ID is required")
    private Long classRoomId;

    @NotNull(message = "Date is required")
    @JsonProperty("attendance_date")
    private LocalDate date;

    private Long subjectId;

    private Integer periodNumber;

    @NotNull(message = "Attendance list is required")
    private List<AttendanceRequest> attendanceList;
}