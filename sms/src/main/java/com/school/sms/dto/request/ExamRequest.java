// dto/request/ExamRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExamRequest {

    @NotBlank(message = "Exam name is required")
    private String name;

    private String examType;

    @NotNull(message = "Class ID is required")
    private Long classRoomId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private LocalDate examDate;
    private String startTime;
    private String endTime;
    private Integer totalMarks;
    private Integer passingMarks;
    private String venue;
    private String academicYear;
}