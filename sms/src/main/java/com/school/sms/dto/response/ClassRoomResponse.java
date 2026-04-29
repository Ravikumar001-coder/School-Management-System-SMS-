// dto/response/ClassRoomResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ClassRoomResponse {
    private Long id;
    private String name;
    private String section;
    private String academicYear;
    private Long classTeacherId;
    private String classTeacherName;
    private List<Long> subjectIds;
    private List<String> subjectNames;
    private Integer maxCapacity;
    private Double classFee;
    private Double admissionFee;
    private Integer studentCount;
}