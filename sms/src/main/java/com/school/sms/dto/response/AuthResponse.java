// src/main/java/com/school/sms/dto/response/AuthResponse.java

package com.school.sms.dto.response;

import com.school.sms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Long studentId;
    private boolean firstLogin;
    private String message;
}