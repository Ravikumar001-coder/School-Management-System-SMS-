// dto/response/TeacherResponse.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TeacherResponse {
    private Long id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String qualification;
    private String specialization;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;
    private String gender;
    private String address;
    private String profilePhoto;
    private String status;
    private Double salary;
    private List<Long> subjectIds;
    private List<Long> assignedClassIds;
}