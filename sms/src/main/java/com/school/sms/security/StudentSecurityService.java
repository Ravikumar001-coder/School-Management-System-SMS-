package com.school.sms.security;

import com.school.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("studentSecurityService")
@RequiredArgsConstructor
public class StudentSecurityService {

    private final StudentRepository studentRepository;

    public boolean isOwnProfile(Long studentId) {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || auth.getName() == null) {
            return false;
        }

        String principal = auth.getName();
        return studentRepository.findByUser_UsernameOrUser_Email(principal, principal)
            .or(() -> studentRepository.findByEmail(principal))
                .map(student -> student.getId().equals(studentId))
                .orElse(false);
    }

    public boolean isOwnId(Long studentId) {
        return isOwnProfile(studentId);
    }
}
