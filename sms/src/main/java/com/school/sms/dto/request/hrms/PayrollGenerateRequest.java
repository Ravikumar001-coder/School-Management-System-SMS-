package com.school.sms.dto.request.hrms;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PayrollGenerateRequest {

    @NotNull(message = "Month is required")
    private Integer month;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Branch ID is required")
    private Long branchId;
}
