// dto/request/ClassRoomRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.util.List;

@Data
public class ClassRoomRequest {

    @NotBlank(message = "Class name is required")
    private String name;

    @NotBlank(message = "Section is required")
    private String section;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private Long classTeacherId;
    private List<Long> subjectIds;

    private Integer maxCapacity;

    @NotNull(message = "Class fee is required")
    @PositiveOrZero(message = "Class fee must be 0 or more")
    private Double classFee;

    @NotNull(message = "Admission fee is required")
    @PositiveOrZero(message = "Admission fee must be 0 or more")
    private Double admissionFee;
}