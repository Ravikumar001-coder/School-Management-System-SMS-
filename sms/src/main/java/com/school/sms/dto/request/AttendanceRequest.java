// dto/request/AttendanceRequest.java
package com.school.sms.dto.request;

import com.school.sms.model.AttendanceStatus;
import lombok.Data;

@Data
public class AttendanceRequest {
    private Long studentId;
    private AttendanceStatus status;
    private String remarks;
}