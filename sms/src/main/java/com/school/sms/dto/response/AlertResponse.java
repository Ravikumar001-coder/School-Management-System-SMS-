package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {
    private Long id;
    private String alertType;
    private String severity;
    private String title;
    private String description;
    private String moduleName;
    private boolean isResolved;
    private LocalDateTime createdAt;
}
