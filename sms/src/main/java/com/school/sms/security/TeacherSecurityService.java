// src/main/java/com/school/sms/security/TeacherSecurityService.java
package com.school.sms.security;

import com.school.sms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("teacherSecurityService")
@RequiredArgsConstructor
public class TeacherSecurityService {

    private final TeacherRepository teacherRepository;

    public boolean isOwnId(Long teacherId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return false;
        
        String principal = auth.getName();
        return teacherRepository.findByUser_UsernameOrUser_Email(principal, principal)
                .map(t -> t.getId().equals(teacherId))
                .orElse(false);
    }
}
