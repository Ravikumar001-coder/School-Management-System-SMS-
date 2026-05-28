package com.school.sms.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DiaryEntryRequest {
    private Long classRoomId;
    private Long subjectId;
    private Integer periodNumber;
    private String topicsCovered;
    private String homeworkAssigned;
    private String behaviorNote;
    private String announcements;
    private String resourcesUsed;
    private LocalDate entryDate;
}
