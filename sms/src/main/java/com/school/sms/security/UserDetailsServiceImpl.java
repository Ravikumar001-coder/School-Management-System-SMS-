// src/main/java/com/school/sms/security/UserDetailsServiceImpl.java

package com.school.sms.security;

import com.school.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier)
            throws UsernameNotFoundException {

        String normalizedIdentifier = normalizeIdentifier(identifier);

        var user = userRepository.findByUsernameOrEmail(normalizedIdentifier, normalizedIdentifier)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with identifier: " + normalizedIdentifier
                        )
                );

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole())
                .build();
    }

    private String normalizeIdentifier(String identifier) {
        String normalized = identifier == null ? "" : identifier.trim();
        if (normalized.contains("@")) {
            normalized = normalized.toLowerCase();
        }
        return normalized;
    }
}