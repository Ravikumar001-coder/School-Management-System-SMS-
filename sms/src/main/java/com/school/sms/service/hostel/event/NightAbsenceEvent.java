package com.school.sms.service.hostel.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class NightAbsenceEvent {
    private Long studentId;
    private LocalDate attendanceDate;
}
