// src/main/java/com/school/sms/dto/response/AuthResponse.java

package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;       // Short-lived access token (15 min)
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles; // List of roles for the frontend
    private List<String> permissions; // List of permissions for the frontend
    private Long studentId;
    private Long teacherId;
    private boolean firstLogin;
    private String message;
}