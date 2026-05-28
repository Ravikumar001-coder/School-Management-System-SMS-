package com.school.sms.security;

import com.school.sms.repository.ParentRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.service.UserRoleSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final UserRoleSyncService userRoleSyncService;

    @Override
    public UserDetails loadUserByUsername(String identifier)
            throws UsernameNotFoundException {

        String normalizedIdentifier = normalizeIdentifier(identifier);

        // 1. Try standard user table
        var user = userRepository.findByUsernameOrEmail(normalizedIdentifier, normalizedIdentifier);
        if (user.isPresent()) return user.get();

        // 2. Try parent table (phone number login)
        return parentRepository.findByPhoneAndDeletedAtIsNull(normalizedIdentifier)
                .map(p -> User.builder()
                        .username(p.getPhone())
                        .password("") // Token-based authentication
                        .roles("PARENT")
                        .build())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with identifier: " + normalizedIdentifier
                        )
                );
    }

    private String normalizeIdentifier(String identifier) {
        String normalized = identifier == null ? "" : identifier.trim();
        if (normalized.contains("@")) {
            normalized = normalized.toLowerCase();
        }
        return normalized;
    }
}