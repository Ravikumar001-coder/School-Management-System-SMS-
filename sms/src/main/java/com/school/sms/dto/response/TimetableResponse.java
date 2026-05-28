package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;

@Data
@Builder
public class TimetableResponse {
    private Long id;
    private Integer period;
    private String startTime;
    private String endTime;
    private String subject;
    private String className;
    private String room;
    private Boolean isBreak;
}
