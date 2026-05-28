package com.school.sms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastUpdate(String topic, Object payload) {
        messagingTemplate.convertAndSend("/topic/" + topic, payload);
    }

    public void publishAlertEvent(Object alertData) {
        broadcastUpdate("alerts", alertData);
    }

    public void publishKpiRefreshEvent(String module) {
        broadcastUpdate("kpi-refresh", Map.of("module", module, "timestamp", System.currentTimeMillis()));
    }

    public void publishAttendanceAnomaly(Object anomalyData) {
        broadcastUpdate("attendance-anomalies", anomalyData);
    }
}
