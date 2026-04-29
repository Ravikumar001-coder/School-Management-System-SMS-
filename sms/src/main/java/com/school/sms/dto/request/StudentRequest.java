// src/main/java/com/school/sms/dto/request/StudentRequest.java

package com.school.sms.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String address;
    
    @NotBlank(message = "Parent name is required")
    private String parentName;
    
    private String parentPhone;
    private String parentEmail;
    private String guardianRelationship;
    private String bloodGroup;
    private String profilePhoto;
    
    @NotNull(message = "Class is required")
    private Long classRoomId;
    
    private String academicYear;
}