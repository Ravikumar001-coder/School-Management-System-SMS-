package com.school.sms.dto.hostel;

import com.school.sms.model.hostel.HostelBlock;
import com.school.sms.model.hostel.HostelRoom;
import lombok.Data;

public class HostelDto {

    @Data
    public static class BlockRequest {
        private String blockName;
        private HostelBlock.GenderType genderType;
        private Long wardenId;
        private HostelBlock.BlockStatus status;
        private String blockCode;
        private String description;
        private HostelBlock.BuildingType buildingType;
        private Integer capacity;
        private Integer totalFloors;
        private String emergencyContact;
        private Boolean rfidEnabled;
        private Boolean biometricEnabled;
        private Boolean messAttached;
        private Long academicYearId;
        private String remarks;
    }

    @Data
    public static class FloorRequest {
        private Integer floorNumber;
        private String floorName;
    }

    @Data
    public static class RoomRequest {
        private String roomNumber;
        private HostelRoom.RoomType roomType;
        private Integer capacity;
        private Boolean hasAttachedBath;
        private Boolean hasWifi;
        private HostelRoom.RoomStatus status;
    }

    @Data
    public static class AllocationRequest {
        private Long studentId;
        private Long bedId;
        private Long academicYearId;
        private String notes;
    }

    @Data
    public static class AttendanceSessionRequest {
        private Long blockId;
        private java.time.LocalDate date;
        private com.school.sms.model.hostel.HostelAttendance.AttendanceType attendanceType;
    }

    @Data
    public static class AttendanceLogRequest {
        private Long studentId;
        private Long bedId;
        private com.school.sms.model.hostel.HostelAttendanceLog.AttendanceStatus status;
        private String remarks;
    }

    @Data
    public static class MessPlanRequest {
        private String planName;
        private com.school.sms.model.hostel.MessPlan.PlanType planType;
        private Double dailyRate;
        private Double monthlyRate;
        private Double breakfastCost;
        private Double lunchCost;
        private Double dinnerCost;
        private Double snacksCost;
        private com.school.sms.model.hostel.MessPlan.HolidayDeductionRule holidayDeductionRule;
        private String refundRule;
        private String lateJoiningRule;
    }

    @Data
    public static class GenerateBillRequest {
        private Long allocationId;
        private Long planId;
        private Integer month;
        private Integer year;
        private Integer totalDays;
        private Integer absentDays;
        private Double extraCharges;
        private Double holidayDeductions;
        private Double fines;
        private java.time.LocalDate dueDate;
        private Boolean previewOnly;
    }

    @Data
    public static class MessPaymentRequest {
        private Long billId;
        private Double amountPaid;
        private com.school.sms.model.hostel.MessPayment.PaymentMode paymentMode;
    }

    @Data
    public static class MealAttendanceRequest {
        private Long studentId;
        private java.time.LocalDate date;
        private com.school.sms.model.hostel.MealAttendance.MealType mealType;
        private com.school.sms.model.hostel.MealAttendance.MealStatus status;
    }

    @Data
    public static class EnhancedAllocationRequest {
        private Long studentId;
        private Long bedId;
        private Long academicYearId;
        private String notes;
        private java.time.LocalDate expectedCheckoutDate;
        private String allocationType;
        private Boolean lockerAssigned;
        private Boolean rfidCardAssigned;
        private Boolean transportLinked;
        private Long messPlanId;
        private Boolean adminApproval;
        private Boolean parentConsent;
        private Boolean guardianApproval;
        private String medicalNotes;
        private String specialNeeds;
        private String emergencyContact;
    }

    @Data
    public static class TransferRequest {
        private Long newBedId;
        private String reason;
    }

    @Data
    public static class VacateRequest {
        private java.time.LocalDate vacateDate;
        private Double damageCharges;
        private Double refundAmount;
        private String remarks;
    }

    @Data
    public static class BulkAllocationRequest {
        private java.util.List<Long> studentIds;
        private Long blockId;
        private Long floorId;
        private Long academicYearId;
        private String allocationType;
        private java.time.LocalDate expectedCheckoutDate;
    }

    @Data
    public static class EligibilityResponse {
        private Long studentId;
        private String firstName;
        private String lastName;
        private String gender;
        private Boolean hasActiveAllocation;
        private String currentRoom;
        private Double outstandingDues;
        private String medicalConditions;
        private Boolean eligible;
        private java.util.List<String> warnings;
    }

    @Data
    public static class BedMapDTO {
        private Long id;
        private String bedNumber;
        private Boolean isOccupied;
        private String status;
        private String occupantName;
        private Long occupantId;
    }

    @Data
    public static class RoomMapDTO {
        private Long id;
        private String roomNumber;
        private Integer capacity;
        private Integer availableBeds;
        private java.util.List<BedMapDTO> beds;
    }

    @Data
    public static class FloorMapDTO {
        private Long id;
        private String floorName;
        private Integer floorNumber;
        private java.util.List<RoomMapDTO> rooms;
    }

    @Data
    public static class BlockMapDTO {
        private Long id;
        private String blockName;
        private String genderType;
        private java.util.List<FloorMapDTO> floors;
    }
}
