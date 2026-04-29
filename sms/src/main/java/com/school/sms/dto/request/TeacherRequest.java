// dto/request/TeacherRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TeacherRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    private String password;

    private String phone;
    private String qualification;
    private String specialization;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;
    private String gender;
    private String address;
    private String profilePhoto;
    private Double salary;
    private String status;

    // Which subjects this teacher can teach
    private List<Long> subjectIds;

    // Which classes this teacher is assigned as class teacher
    private List<Long> assignedClassIds;
}