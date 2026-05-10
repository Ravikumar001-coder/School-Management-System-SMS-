// dto/response/AttendanceResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class AttendanceResponse {
    private Long id;
    private Long studentDbId;
    private String studentName;
    private String studentId;
    private LocalDate date;
    private String status;
    private String subjectName;
    private String remarks;
}
