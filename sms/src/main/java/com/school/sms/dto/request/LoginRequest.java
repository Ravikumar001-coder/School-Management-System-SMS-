// src/main/java/com/school/sms/dto/request/LoginRequest.java

package com.school.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class LoginRequest {
    
    @NotBlank(message = "Username or email is required")
    @JsonAlias({"email", "username"})
    private String identifier;
    
    @NotBlank(message = "Password is required")
    private String password;
}