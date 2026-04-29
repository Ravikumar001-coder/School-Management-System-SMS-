// dto/request/BulkMarkRequest.java
package com.school.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class BulkMarkRequest {

    @NotNull(message = "Exam ID is required")
    private Long examId;

    @NotNull(message = "Marks list is required")
    private List<MarkRequest> marks;
}