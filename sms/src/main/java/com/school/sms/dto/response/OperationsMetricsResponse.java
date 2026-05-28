package com.school.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationsMetricsResponse {
    private long activeVehicles;
    private long vehiclesUnderMaintenance;
    private double hostelOccupancy;
    private int inventoryAlerts;
    private long securityIncidents;
    private long maintenanceRequests;
}
