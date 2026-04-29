// dto/response/SubjectResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubjectResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String department;
    private Long classRoomId;
    private String className;
    private String classSection;
    private String classLabel;
    private Long assignedTeacherId;
    private String assignedTeacherName;
    private Integer totalMarks;
    private Integer passingMarks;
    private String subjectType;
}