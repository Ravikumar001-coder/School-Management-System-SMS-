// dto/response/MarkResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MarkResponse {
    private Long id;
    private String studentName;
    private String studentCode;
    private String examName;
    private String subjectName;
    private Double marksObtained;
    private Integer totalMarks;
    private String grade;
    private boolean absent;
    private boolean passed;
}