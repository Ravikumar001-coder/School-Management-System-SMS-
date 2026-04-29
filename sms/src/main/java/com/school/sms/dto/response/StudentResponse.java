// src/main/java/com/school/sms/dto/response/StudentResponse.java

package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentResponse {
    private Long id;
    private String studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    private String guardianRelationship;
    private String bloodGroup;
    private String address;
    private String academicYear;
    private Long classRoomId;
    private String className;      // "Class 10 - A"
    private String status;
    private String profilePhoto;
}