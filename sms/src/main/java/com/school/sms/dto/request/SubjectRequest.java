// dto/request/SubjectRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    private String name;

    private String code;
    private String description;
    private String department;
    private Long classRoomId;
    private Long assignedTeacherId;
    private Integer totalMarks;
    private Integer passingMarks;
    private String subjectType;
}