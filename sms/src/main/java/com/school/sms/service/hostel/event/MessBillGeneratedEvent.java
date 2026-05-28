package com.school.sms.service.hostel.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MessBillGeneratedEvent {
    private Long studentId;
    private Double amount;
    private Integer month;
    private Integer year;
}
