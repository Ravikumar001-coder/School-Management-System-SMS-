package com.school.sms.exception;

import com.school.sms.dto.response.AuthResponse;
import lombok.Getter;

@Getter
public class LoginException extends RuntimeException {
    private final AuthResponse response;

    public LoginException(String message, AuthResponse response) {
        super(message);
        this.response = response;
    }
}
