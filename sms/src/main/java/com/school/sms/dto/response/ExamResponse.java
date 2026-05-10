// dto/response/ExamResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class ExamResponse {
    private Long id;
    private String name;
    private String examType;
    private Long classRoomId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private LocalDate examDate;
    private String startTime;
    private String endTime;
    private Integer totalMarks;
    private Integer passingMarks;
    private String venue;
    private String status;
    private String academicYear;
}
