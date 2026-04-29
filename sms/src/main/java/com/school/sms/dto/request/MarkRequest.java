package com.school.sms.dto.request;

import lombok.Data;

@Data
public class MarkRequest {
    private Long examId;
    private Long studentId;
    private Double marksObtained;
    private Double totalMarks;
    private boolean absent;
    private String remarks;
}
