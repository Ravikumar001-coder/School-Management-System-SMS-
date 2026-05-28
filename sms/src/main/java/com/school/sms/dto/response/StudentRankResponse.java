package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRankResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Double totalMarksObtained;
    private Double totalMaxMarks;
    private Double percentage;
    private String grade;
    private Integer rank;
}
