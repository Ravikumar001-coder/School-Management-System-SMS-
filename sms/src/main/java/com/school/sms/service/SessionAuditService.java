package com.school.sms.service;

import com.school.sms.model.UserSession;
import com.school.sms.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionAuditService {

    private final UserSessionRepository userSessionRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getActiveSessions() {
        return userSessionRepository.findByActiveTrue().stream()
                .map(s -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", s.getId());
                    map.put("sessionId", s.getSessionId());
                    map.put("username", s.getUser() != null ? s.getUser().getUsername() : "N/A");
                    map.put("ip", s.getIpAddress());
                    map.put("device", s.getDeviceName() + " (" + s.getBrowser() + ")");
                    map.put("loginTime", s.getCreatedAt().toString());
                    map.put("lastActivity", s.getLastActiveAt().toString());
                    return map;
                }).collect(Collectors.toList());
    }

    @Transactional
    public void terminateSession(Long sessionId) {
        userSessionRepository.findById(sessionId).ifPresent(s -> {
            s.setActive(false);
            s.setRevokedAt(Instant.now());
            userSessionRepository.save(s);
        });
    }
}
